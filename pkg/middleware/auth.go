package middleware

import (
	"net/url"
	"strings"
	"strconv"

	macaron "gopkg.in/macaron.v1"

	m "github.com/grafana/grafana/pkg/models"
	"github.com/grafana/grafana/pkg/setting"
	"github.com/grafana/grafana/pkg/util"
)

type AuthOptions struct {
	ReqGrafanaAdmin bool
	ReqSignedIn     bool
}

func getApiKey(c *m.ReqContext) string {
	header := c.Req.Header.Get("Authorization")
	parts := strings.SplitN(header, " ", 2)
	if len(parts) == 2 && parts[0] == "Bearer" {
		key := parts[1]
		return key
	}

	username, password, err := util.DecodeBasicAuthHeader(header)
	if err == nil && username == "api_key" {
		return password
	}

	return ""
}

func accessForbidden(c *m.ReqContext) {
	if c.IsApiRequest() {
		c.JsonApiErr(403, "Permission denied", nil)
		return
	}

	c.Redirect(setting.AppSubUrl + "/")
}

func notAuthorized(c *m.ReqContext) {
	if c.IsApiRequest() {
		c.JsonApiErr(401, "Unauthorized", nil)
		return
	}

	c.Resp.Header().Add("Set-Cookie", "redirect_to="+url.QueryEscape(setting.AppSubUrl+c.Req.RequestURI)+"; HttpOnly; Path="+setting.AppSubUrl + "/; Secure; Max-Age="+strconv.Itoa(0)+"; SameSite=None")
	//c.SetCookie("redirect_to", url.QueryEscape(setting.AppSubUrl+c.Req.RequestURI), 0, setting.AppSubUrl+"/", nil, false, true)

	queryString := ""
	if c.Req.URL.RawQuery != "" {
		queryString = "?" + c.Req.URL.RawQuery
	}
	c.Redirect(setting.AppSubUrl + "/login" + queryString)
}

func EnsureEditorOrViewerCanEdit(c *m.ReqContext) {
	if !c.SignedInUser.HasRole(m.ROLE_EDITOR) && !setting.ViewersCanEdit {
		accessForbidden(c)
	}
}

func RoleAuth(roles ...m.RoleType) macaron.Handler {
	return func(c *m.ReqContext) {
		ok := false
		for _, role := range roles {
			if role == c.OrgRole {
				ok = true
				break
			}
		}
		if !ok {
			accessForbidden(c)
		}
	}
}

func Auth(options *AuthOptions) macaron.Handler {
	return func(c *m.ReqContext) {
		if !c.IsSignedIn && options.ReqSignedIn && !c.AllowAnonymous {
			notAuthorized(c)
			return
		}

		if !c.IsGrafanaAdmin && options.ReqGrafanaAdmin {
			accessForbidden(c)
			return
		}
	}
}

// AdminOrFeatureEnabled creates a middleware that allows access
// if the signed in user is either an Org Admin or if the
// feature flag is enabled.
// Intended for when feature flags open up access to APIs that
// are otherwise only available to admins.
func AdminOrFeatureEnabled(enabled bool) macaron.Handler {
	return func(c *m.ReqContext) {
		if c.OrgRole == m.ROLE_ADMIN {
			return
		}

		if !enabled {
			accessForbidden(c)
		}
	}
}
