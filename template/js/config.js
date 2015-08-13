/* 
 * MobileJS
 * MIT Licence
 * You can use this according to the MIT Licence.
 * 
 * Filename: config.js
 * Version: 1.2
 * 
 * Configuratables should all be implemented here.
 * Every new feature should have a global constant declared here, to ease typos.
 * 
 */

// Global Variables
AJAX_OK = 0;
AJAX_WARNING = 1;
AJAX_ERROR = 2;
TIME_OUT = 120000;
WAITING_1 = 1;
WAITING_2 = 5;
WAITING_3 = 10;
WAITING_4 = 20;
WAITING_5 = 60; // Should be timed out by now
TYPING_THRESHOLD = 500;
MIN_QAS_LENGTH = 5;
TRANSITION_SPEED = 350;
WAIT_ON_SUBMIT_SPEED = 0.77;
ERROR_BORDER_COLOR = '#efbbb5';

// Global Keys
KEY_ACCESS_TOKEN = "access_token";

/* For Password Complexity Weak 50 <> Average 75 <> Strong 100 <> Secure ++ */
MIN_PASSWORD_STRENGTH = 75;

// Feature Constants
FEATURE_LIST = [];
FEATURE_NONE = "none";
FEATURE_HOME = "home";
FEATURE_SETUP = "setup";
FEATURE_RENEWAL = "renewal";
FEATURE_FISH = "fish";
FEATURE_UPDATE = "update";
FEATURE_DASHBOARD = "dashboard";
FEATURE_FEEDBACK = "feedback";
FEATURE_PRODUCT = "product";

FEATURE_LIST.push(FEATURE_NONE);
FEATURE_LIST.push(FEATURE_HOME);
FEATURE_LIST.push(FEATURE_FISH);

VERSION = 2.1;

// Language String
var _global = this; // window object

// Defaults DG _language to english
_global["_language"] = "en";
_global['_dictionary'] = { _loaded: true };

// Set DG _components to empty
_global["_components"] = { _loaded: true };

// Set all the URL and paths here
var dgServiceURL = "http://localhost/api";
var homeURL = "";
var fullSiteURL = "https://github.com/shuurai/mobilejs";
var cdnURL = "";
var baseURL = "";

var siteName = "OneGov";
        
// Require Configs
require.config({
    baseUrl: "",
    paths: {
        "jquery": cdnURL+"vendor/jquery/dist/jquery.min",
        "canjs": cdnURL+"vendor/canjs/can.jquery.min",
        "canjs-ejs": cdnURL+"vendor/canjs/can.ejs",
        "foundation": cdnURL+"vendor/foundation/js/foundation.min",
        "moment": cdnURL+"vendor/momentjs/min/moment.min",
        "moment-lang": cdnURL+"vendor/momentjs/lang/en-au",
        "fastclick": cdnURL+"vendor/fastclick/lib/fastclick",
        "icheck": cdnURL+"vendor/iCheck/icheck.min",
        
        "common": baseURL+"js/common.min",
        // Add all the components
        "dg-components": baseURL+"js/components/components.min"
    }
});