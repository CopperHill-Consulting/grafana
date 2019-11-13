$( document ).ready(function() {

    /**
     * Cookies management library
     *
     * @type type
     */
    var helperCookie = {
        create: function (name, value, time) {
            var today = new Date(),
                    offset = (typeof time == 'undefined') ? (1000 * 60 * 60 * 24) : (time * 1000),
                    expires_at = new Date(today.getTime() + offset);

            var cookie = _.map({
                name: escape(value),
                expires: expires_at.toGMTString(),
                path: '/'
            }, function (value, key) {
                return [(key == 'name') ? name : key, value].join('=');
            }).join(';');

            document.cookie = cookie;
            return this;
        }
    };

    function getUrlVars() {
        var vars = {};
        const parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
        });
        return vars;
    }

    function getUrlParameter (parameter) {
        var urlparameter = null;
        if(window.location.href.indexOf(parameter) > -1){
          urlparameter = getUrlVars()[parameter];
        }
        return urlparameter;
    };

    //check for login info cookie to send us to a login screen
    const cookieArr = document.cookie.split(';');
    cookieArr.forEach(function(value, index) {
        if (value.includes("login_info")) {
            const valueParts = value.split('=');
            const loginInfoCookieStr = valueParts[1];

            if (loginInfoCookieStr) {
                var newLocation = window.location.protocol + '//' + window.location.host + '/login?t=';
                const data = new Buffer(decodeURIComponent(loginInfoCookieStr), 'utf-8').toString('base64');
                const t_encoded = encodeURIComponent(data);
                newLocation += t_encoded;
                helperCookie.create("login_info", null, -1000000);
                window.location = newLocation;
            }
        }
    });

    //deal with parameter t
    const t = getUrlParameter('t');

    if (typeof (t) == 'undefined') {
        return false;
    }

    if (t.length == 0) {
        return false;
    }

    $('body').append("<div id='overlay'></div>");
    $('#overlay').height($(document).height())
      .css({
         'opacity' : 1,
         'position': 'absolute',
         'top': 0,
         'left': 0,
         'background-color': '#161719',
         'width': '100%',
         'z-index': 5000
      });

    try{

        const t_decoded = decodeURIComponent(t);
        const dataBuffer = new Buffer(t_decoded, 'base64');
        const data = dataBuffer.toString('utf-8');
        const ojson = JSON.parse(data);

        if (typeof (ojson.user) == 'undefined' || typeof (ojson.pass) == 'undefined') {
            throw "Undefined type";
        }

        if (ojson.user.length == 0 || ojson.pass.length == 0) {
            throw "User or password empty";
        }

        if (typeof (ojson.user) != 'undefined' && typeof (ojson.pass) != 'undefined' && typeof (ojson.logout) != 'undefined') {
            helperCookie.create("login_info", JSON.stringify({ "user": ojson.user, "pass": ojson.pass }));
            window.location =  window.location.protocol + '//' + window.location.host + '/logout';
        }

        setTimeout(function () {
            var $form = $('form[name="loginForm"]');
      
            if (typeof (ojson.redirect_to) != 'undefined') {
                  helperCookie.create("redirect_to", ojson.redirect_to);
                if ($form.length <= 0){
                  window.location = window.location.protocol + '//' + window.location.host + '/login';
                }
            }
      
            if ($form.length > 0) {
              $form.find("input[name=username]").val(ojson.user).trigger("input");
              $form.find("input[name=password]").val(ojson.pass).trigger("input");
              $form.find("button[type=submit]").trigger('click');
            }
          }, 500);
        
    } catch (e) {
        console.error(e);
        return false;
    }
    
});
