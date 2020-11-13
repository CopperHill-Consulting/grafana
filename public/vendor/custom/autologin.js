// Useless comment //
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
                    expiresAt = new Date(today.getTime() + offset);

            var cookieValues = {
              name: encodeURIComponent(name),
              value: encodeURIComponent([value].toString()),
              expires: expiresAt.toGMTString()
            };
            var cookie = '@name=@value;expires=@expires;path=/;samesite=none;secure'.replace(
              /@(\w+)/g,
              function(m, key) {
                return cookieValues[key];
              }
            );
            console.log('helperCookie.create()', {name:name, value:value, time:time, cookie:cookie});
            document.cookie = cookie;
            return this;
        }
    };

    /**
     * Used to get the URL parameters.
     */
    function getUrlVars() {
        var vars = {};
        // NOTE:  Does not decode the names or values of the URL parameters.
        const parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
        });
        return vars;
    }

    /**
     * Used to get a particular URL parameter.
     */
    function getUrlParameter (parameter) {
        var urlparameter = null;
        // NOTE:  Terrible test to see if the parameter is in the URL.
        if(window.location.href.indexOf(parameter) > -1){
          urlparameter = getUrlVars()[parameter];
        }
        return urlparameter;
    };

    // Finds the index of the login_info cookie within the array of cookies.
    const cookieArr = document.cookie.split(';');
    var loginInfoIndex = -1;
    cookieArr.forEach(function(value, index) {
        // NOTE:  Why are we not doing this?  value.startsWith("login_info=")
        if (value.includes("login_info")) {
            loginInfoIndex = index;
        }
    });

    // If the login_info cookie was found and it has a value take its value,
    // go to the /login page with this value passed as the "t" paraameter.
    // Before redirecting remove the login_info cookie.
    if (loginInfoIndex != -1) {
        var cookieParts = cookieArr[loginInfoIndex].split('=');
        const loginInfoCookieStr = cookieParts[1];

        if (loginInfoCookieStr) {
            //console.log('loading login page with T params')
            var newLocation = window.location.protocol + '//' + window.location.host + '/login?t=';
            // NOTE:  May need to use btoa() instead but need to investigate differences.
            const data = new Buffer(decodeURIComponent(loginInfoCookieStr), 'utf-8').toString('base64');
            newLocation += data;
            helperCookie.create("login_info", null, -1000000);

            window.location = newLocation;
        }
    }

    //deal with parameter t
    const t = getUrlParameter('t');
    if (typeof (t) == 'undefined' || t.length == 0) {
        return false;
    }

    // Place an overlay over all content.
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

    // Seems to be using a try-catch primarily to print custom errors to the console.
    try{

        const t_decoded = decodeURIComponent(t);
        //const dataBuffer = new Buffer(t_decoded, 'base64');
        //const data = dataBuffer.toString('utf-8');
		    const data = atob(t_decoded)
        const ojson = JSON.parse(data);

        if (typeof (ojson.user) == 'undefined' || typeof (ojson.pass) == 'undefined') {
            throw "Undefined type";
        }

        if (ojson.user.length == 0 || ojson.pass.length == 0) {
            throw "User or password empty";
        }

        // If the username, password and logout values were specified in the
        // "t" parameter then create the login_info cookie which will just
        // contain the username and password.  If the "redirect" value was given
        // in the "t" parameter define "redirect_to" cookie with that value.
        // If the "logout" parameter is given in the "t" parameter as a true-ish
        //  value and we are not currently on the login page, log the user out.
        if (typeof (ojson.user) != 'undefined' && typeof (ojson.pass) != 'undefined' && typeof (ojson.logout) != 'undefined') {
            //console.log('creating login info cookie')
            helperCookie.create("login_info", JSON.stringify({ "user": ojson.user, "pass": ojson.pass }));
            if (typeof (ojson.redirect) != 'undefined') {
                //console.log('creating redirect to cookie')
                helperCookie.create("redirect_to", ojson.redirect );
            }
            if (ojson.logout && !window.location.href.includes('/login')) {
                //console.log('logging out')
                window.location = window.location.protocol + '//' + window.location.host + '/logout';
            }
        }

        // If on a page whose file name or directory starts with "login", wait half a second
        // (presumably for the login form to load) and then try to trigger the auto login.
        if (window.location.href.includes('/login')){
            setTimeout(function () {
                //console.log('submitting login form with T params')
                // NOTE:  Is this really the only way to identify the login form?
                var $form = $('form');
                
                if ($form.length > 0) {
                    $form.find("input[name=user]").val(ojson.user).trigger("input");
                    $form.find("input[name=password]").val(ojson.pass).trigger("input");
                    $form.find(':submit').trigger('click');
                }
            }, 500);
        }
        
    } catch (e) {
        console.error(e);
        return false;
    }
    
});
