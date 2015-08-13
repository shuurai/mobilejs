/* 
 * MobileJS
 * MIT Licence
 * You can use this according to the MIT Licence.
 * 
 * Filename: app.js
 * Version: 1.0
 * 
 * Description: 
 * 
 * Configured for usage with canJS's development structure.
 * The app controller here is like the `main` class of a C program and the `features` 
 * are like the screens or views.
 *  
 */

// App Configuration Headers
var currentFeature = FEATURE_NONE;
var splashErrorControl = null;
var oldControl = null;
var dgPageSlider = null;

// App Global Stores
var userData = {};

// Preload jQuery first
require(["canjs"], function (_canjs_) {
    require(["canjs-ejs", "foundation", "moment", "moment-lang", "dg-components", "fastclick", "icheck", "common"], function (_can_ejs_, _foundation_, _moment_, _moment_lang_, _components_, _fastclick_, _icheck_, _common_) {
        // Initializes Foundation
        can.$(document).foundation();
        
        // Version
        console.log('app : init version ' + VERSION);

        // Service URL Automatic Parsing
        var host = can.$(location).attr('host');
        var hostname = can.$(location).attr('hostname');
        var protocol = can.$(location).attr('protocol');
        var port = can.$(location).attr('port');

        if(hostname !== "localhost") {
            host = host.replace('www', 'portal');
            dgServiceURL = protocol + "//" + host + "/icpdgservices/";
            console.log('app : dg service url = '+dgServiceURL);
        } else if (hostname === "localhost" && port != 1777) {
            port = "1092";
            
            dgServiceURL = protocol + "//" + hostname + ":" + port + "/icpdgservices/";

            console.log('app : dg service url = '+dgServiceURL);
        }

        // Initializes DG Common Strap
        common();

        // Attaches FastClick Mechanism
        if (Modernizr.touch && isAppleMobile() && (typeof (FastClick) !== 'undefined')) {
            new FastClick(document.body);
        }

        // Load the first feature or from parsed `defaultFeature`
        var defaultFeature = getURLParam("defaultFeature");
        if(isEmpty(defaultFeature) || FEATURE_LIST.indexOf(defaultFeature) === -1) {
            defaultFeature = FEATURE_HOME;
        } else {
            console.log("app : default feature detected from url = "+defaultFeature);
        }

        var params = null;

        // Keeping it simple for now, and only look for `defaultPage`
        var defaultPage = getURLParam("defaultPage");
        if(!isEmpty(defaultPage)) {
            console.log("app : default page detected from url = "+defaultPage);
            params = { defaultPage: defaultPage };
        }

        currentFeature = loadFeature(defaultFeature, params);
    });
});