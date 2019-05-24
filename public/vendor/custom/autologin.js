$( document ).ready(function() {

    /**
     * Cookies management library
     *
     * @type type
     */
    var helperCookie = {
        findAll: function () {
            var cookies = {};
            _(document.cookie.split(';'))
                    .chain()
                    .map(function (m) {
                        return m.replace(/^\s+/, '').replace(/\s+$/, '');
                    })
                    .each(function (c) {
                        var arr = c.split('='),
                                key = arr[0],
                                value = null;
                        var size = _.size(arr);
                        if (size > 1) {
                            value = arr.slice(1).join('');
                        }
                        cookies[key] = value;
                    });
            return cookies;
        },
        find: function (name) {
            var cookie = null,
                    list = this.findAll();

            _.each(list, function (value, key) {
                if (key === name)
                    cookie = value;
            });
            return cookie;
        },
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
        },
        destroy: function (name, cookie) {
            if (cookie = this.find(name)) {
                this.create(name, null, -1000000);
            }
            return this;
        }
    };

    function getUrlVars() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
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

    var t = getUrlParameter('t');

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

    try {
        var t_decoded = decodeURIComponent(t);
        var dataBuffer = new Buffer(t_decoded, 'base64');
        var data = dataBuffer.toString('utf-8');
        var ojson = JSON.parse(data);

        if (typeof (ojson.user) == 'undefined' || typeof (ojson.pass) == 'undefined') {
            throw "Undefined type";
        }

        if (ojson.user.lenght == 0 || ojson.pass.lenght == 0) {
            throw "User or password empty";
        }

    } catch (e) {
        return false;
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
    }, 1000);
});
