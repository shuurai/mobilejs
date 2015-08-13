/* 
 * MobileJS
 * MIT Licence
 * You can use this according to the MIT Licence.
 * 
 * Filename: common.js
 * Version: 1.0
 * 
 * Description: 
 * 
 * Common things that needs to work globally can be set here.
 * 
 */

// Primitive Prototypes Overrides
// =========================================
// Gets the month value in 2 digits, starts at 0
Date.prototype.getMonthFormatted = function () {
    var month = this.getMonth() + 1;
    return month < 10 ? '0' + month : month; // ('' + month) for string result
};

// Gets the day value in 2 digits
Date.prototype.getDateFormatted = function () {
    var date = this.getDate();
    return date < 10 ? '0' + date : date; // ('' + month) for string result
};

// Removes a char from a string
String.prototype.removeChar = function (char) {
    var str = this;
    return str.replace(new RegExp(char, 'g'), '');
};

// Inserts a string to a string
String.prototype.insert = function( idx, rem, s ) {
    return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
};

// DG Specific Helper Functions
// =========================================
// _dictionary is a reserved word for future overrides from language specific js files
// each template will need to have its own language specific files
// Returns the string by key from global _dictionary object
function _s(key) {
    if (_global['_dictionary'][key] === null) {
            return "MISSING: " + key;
    }
    return _global['_dictionary'][key];
}

// Incase Typo
function _S(key) { return _s(key); };

function _lang() { return _global['_language']; }

// Component getter
function _c(n) { return _global['_components'][n]; }

// Common Bootstraps
// =========================================

// When internet is down
function onInternetDown( e ) {
    var popup = createPopup(_s('C014'), _s('C016'), _s('DREFRESH'), null, function(){
        location.reload();
    }, null, null, null, true);
    //popup.hideCloseButton();
}

// Loads a feature and can be called everywhere anywhere
function loadFeature( feature, data ) {
    // Add a Spinner
    var bodyNode = can.$('body');
    var waitingNode = can.$('<div class="dg-feature-loading"><span class="dg-square-spinner">&nbsp;</span></div>');
    waitingNode.appendTo(bodyNode);

    // Loads the feature files and templates, feature name is critical to the file name
    require(['js/features/'+feature+'.min.js'], function( init ){
        fadeOut(waitingNode, function(){
            init( data );
            waitingNode.remove();
        });
    }, onInternetDown);
    
    currentFeature = feature;

    return feature;
}

// Loads can view with internet wrap handling
function loadView(path, options) {
    var page;

    console.log("common : load view " + path);
    try {
        page = can.view(path, options);
    } catch (e) {
        console.log("common : error loading view " +e);
        onInternetDown( e );
        return;
    }

    return page;
}

// Inits dictionaries
function initDictionary(strings) {
    if(can.isEmptyObject(_global['_dictionary'])) {
        alert("ERROR: `config.js` not loaded or initialized.");
    }
    
    if (!can.isEmptyObject(strings)) {

        var allocatedKeys = [];

        // Clear previously loaded "DXXXXX strings where X is a digit" to null
        can.each(_global['_dictionary'], function(item, key){
            if(key.charAt(0) === 'D' && can.isNumeric(key.charAt(1))) {
                allocatedKeys.push(key);
            }
        });

        for(var i = 0; i < allocatedKeys.length; i++) {
            var key = allocatedKeys[i];
            _global['_dictionary'][key] = null;
        }

        can.extend(_global['_dictionary'], strings);
    }
}

// Inits Components
function initComponents() {
    var count = 0;
    can.each(_global['_components'], function (comp, index) {
        if (can.isFunction(comp.instantiate)) {
            comp.instantiate();
            count++;
        }
    });
    console.log("common : components initialized " + count);
}

// Constructs the API URL
function constructAPIURL(area, arg) {
    area = can.trim(area);
    arg = can.trim(arg);
    var baseURL = dgServiceURL + area + "/" + arg;
    return baseURL;
}

// Sets the TransactionID
function setTransactionID(id, type) {
    _global['transactionID'] = id;
    _global['transactionType'] = type;
}

// Clean Up when Control Transits
function cleanUp(control, skipFocus) {
    if (oldControl) {
        // This needs to be forcefully removed due to structuring
        var topAreas = can.$('#dg-nav-canvas');
        if (topAreas) {
            var area = topAreas.first();
            if (area) {
                console.log("common : cleanUp removed a dg-nav-canvas");
                area.remove();
            }
        }

        oldControl.destroy();
    }
    oldControl = control;

    if (!skipFocus) {
        setTimeout(function () {
            control.infocus = true;
        }, TRANSITION_SPEED * 2);
    }
}

// URL Query
function getURLParam( query ) {
    query = query.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var expr = "[\\?&]"+query+"=([^&#]*)";
    var regex = new RegExp( expr );
    var results = regex.exec( window.location.href );
    if ( results !== null ) {
        return results[1];
    } else {
        return false;
    }
}

// Get Page Slider
function getPageSlider( pageOrder ) {
    if(!dgPageSlider) {
        dgPageSlider = _c('PageSlider').create('#dg-overall-wrapper', { stateHistory: pageOrder });
    }
    dgPageSlider.setOptions( { stateHistory: pageOrder } );
    return dgPageSlider;
}

// Reverse Page Slide Direction
function reverseDirection( dir ) {
    if(dir === 'left') {
        return 'right';
    }
    return 'left';
}

// Initialises iCheck, needs to be enabled.
function initialiseICheck(parent) {
    parent.find('input').iCheck({
        checkboxClass: 'icheckbox_square-red',
        radioClass: 'iradio_square-red',
        increaseArea: '20%' // optional
      });
}

// Log user out
function logout() {
    var onLogout = function(msg) {
        console.log("common : logout "+msg);

        // resets userdata
        userData = {};
        loadFeature(FEATURE_HOME);
    };

    callAjax({ url: constructAPIURL("api", "account/signout"), type:"POST", dataType:"json", contentType:'text/json', data: JSON.stringify({
        xlr: 1
    })}, onLogout, onLogout, this);
}

// Parses userData from getuserprofile result
function parseUserData(result) {
    console.log('common : parseUserdata '+result);

    var addresses = {};
    can.each(result['addresses'], function(address, index){
        var addressType = address['addressTypeName'];
        if(!isEmpty(address['city'])) {
            address['suburb'] = address['city'];
            delete address['city'];
        }
        addresses[addressType+"Full"] = address;
        addresses[addressType] = formatAddress(address);
    });
    
    can.extend(userData, result);

    userData['addresses'] = addresses;
    
    // Quick hack to conform date of birth with local string
    if(!isEmpty(userData['dateOfBirth'])) {
        userData['dob'] = userData['dateOfBirth'];
        delete userData['dateOfBirth'];
    }
    
    if(!isEmpty(userData['firstName'])) {
        userData['firstname'] = userData['firstName'];
        delete userData['firstName'];
    }
    
    if(!isEmpty(userData['lastName'])) {
        userData['lastname'] = userData['lastName'];
        delete userData['lastName'];
    }    
}

// Inits Common Behaviors and Initializers that can only be executed when everything has been loaded
function common() {
    // Inits the strings for common, this is depenant on common_str_en.js to be loaded first or concatenated into common.min.js
    initDictionary(commonStrEN);
    console.log("common : dictionary initialized commonStrEN");
    
    // Inits the components
    initComponents();

    // Set moment lang
    moment.lang('en-au');

    // EJS Common Helpers    
    // Use _s inside templates as getStr, just to be different so in case it gets into weird loop
    can.EJS.Helpers.prototype.getStr = function (params) {
        return _s(params);
    };
    // Check if string is empty
    can.EJS.Helpers.prototype.isStringEmpty = function (params) {
        return isEmpty(params);
    };
    // Changes to upper string
    can.EJS.Helpers.prototype.today = function (params) { return moment.utc().format('YYYY-MM-DD'); };
    can.EJS.Helpers.prototype.toUpper = function (params) { return params.toUpperCase(); };
    // Counts the list 
    can.EJS.Helpers.prototype.countList = function (params) {
        var i = 0;
        can.each(params, function (value, index) {
            i++;
        });
        return i;
    };
    // Gets a human friendly date from a yyyy-mm-ddTHH:mm:ss.zzzzzz format
    can.EJS.Helpers.prototype.formatDotNetDate = function (params, custom) {
        if (isEmpty(custom)) {
            custom = 'LLL';
        }
        var date = moment(params);
        //date.setISO8601(params);
        return date.format(custom);
    };
    // Gets hack mm/dd/yyyy hh.... format 
    can.EJS.Helpers.prototype.hackSiebelDate = function (params) {
        return moment(params, "MM/DD/YYYY HH:mm:ss").format('LLL');
        /*
        var splits = params.split('/');
        var output = "";
        output = splits[1] + '/' + splits[0] + '/' + splits[2];
        return output;*/
    };
    // Check if its apple mobile
    can.EJS.Helpers.prototype.getMobile = function () {
        if (isAppleMobile()) {
            return "apple";
        } else if (isIEMobile()) {
            return "ie";
        }

        return "others";
    };
    // Displays address block in one line
    can.EJS.Helpers.prototype.displayAddress = function ( address ) {
        var oneline = address['addressLine1']+', '+(address['addressLine2']?address['addressLine2']+', ':'')+address['addressSuburb']+', '+address['addressState']+', '+address['addressPostcode'];
        return oneline;
    };

    // iOS Keyboard Shifting Fix
    can.$.fn.mobileFix = function (options) {
        var parent = can.$(this);
        fixedElements = can.$(options.inputElements);

        can.$(document).on('focus', fixedElements, function (e) {
            parent.addClass(options.addClass);
        }).on('blur', fixedElements, function (e) {
            parent.removeClass(options.addClass);

            // Fix for some scenarios where you need to start scrolling
            setTimeout(function () {
                can.$(document).scrollTop(can.$(document).scrollTop());
            }, 100);
        });

        return this; // Allowing chaining
    };

    // Enter Button Shifts Scroll on iOS Fix
    can.$.fn.enterFix = function (options) {
        //var parent = can.$(this);
        fixedElements = can.$(options.inputElements);

        can.$(document).on('keyup keydown keypress', fixedElements, function (e) {
            if (e.keyCode === 13) {
                can.$(e.target).trigger('blur');
                e.stopPropagation();
                e.preventDefault();
                return false;
            }
        });

        return this; // Allowing chaining
    };

    // Form submit prevention for PC web browsers
    can.$.fn.formFix = function (options) {
        //var parent = can.$(this);
        fixedElements = can.$(options.inputElements);

        can.$(document).on('submit', fixedElements, function (e) {
            e.stopPropagation();
            e.preventDefault();
            return false;
        });

        return this; // Allowing chaining
    };

    // Apploies the iOS Keyboard shifting problem
    /* Disabled For Now TODO Check
    if (Modernizr.touch) {
        can.$("body").mobileFix({ // Pass parent to apply to
            inputElements: "input,textarea,select", // Pass activation child elements
            addClass: "fixfixed" // Pass class name
        });

        can.$("body").enterFix({ // Pass parent to apply to
            inputElements: "input"
        });
    } else {
        can.$("body").formFix({ // Pass parent to apply to
            inputElements: "form"
        });
    }*/
}

// Helpers Start =======
// =========================================

// Creates the address input, id the parent element to place this element
function addAutoAddressInput(id, options) {
    if (_c('AutoAddress')) {
            return _c('AutoAddress').create(id, options);
    } else {
            alert('Error: Components not yet loaded.');
    }
}

// Shows the splash
function showSplashError(str) {
    if (_c('SplashError')) {
        console.log('common : showSplashError ' + str)
        splashErrorControl = _c('SplashError').create(str, '.dg-sticky-top');
        return splashErrorControl;
    } else {
        alert('Error: Components not yet loaded.');
    }
}

// Shows the date widget
function showDateWidget(date, minY, maxY, callBack) {
    if (_c('DatePicker')) {
        return _c('DatePicker').create(str);
    } else {
        alert('Error: Components not yet loaded.');
    }
}

// Submit Error
// {"DGTransactionID":"DG0000000001","DGTransactionType":"Fishing Application or Renewal","DGTransactionStep":"Step name","DGServiceError": Any error returned by service. If none, null}
function submitError(error) {
    var stepName, transactionID, transactionType;
    stepName = can.route.attr('step');
    var data = { "DGTransactionID": _global['transactionID'], "DGTransactionType": _global['transactionType'], "DGTransactionStep": stepName, "DGServiceError": error };

    // What is the service api?
}

// Checks if user is logged in or not
function isLoggedIn() {
    return (!can.isEmptyObject(userData) && !isEmpty(userData.access_token));
}

// Get a user data attribute by key
function getUserDataByKey(key) {
    if(!can.isEmptyObject(userData)) {
        return userData[key];
    }
    return "";
}

// Ajax Call Helper
function callAjax(args, successCallBack, failCallBack, callBackObj) {
    if (can.isEmptyObject(args) || isEmpty(args.url) || can.isEmptyObject(args.data) || !can.isFunction(successCallBack) || !can.isFunction(failCallBack)) {
        //alert("Error: Ajax Arguments missing data and url");
        if (callBackObj) {
            failCallBack.call(callBackObj, "Error: Arguments and callbacks missing.");
        }
        return;
    }
    //alert(JSON.stringify(args.data));
    var msg = _s('CE003');

    args.timeout = TIME_OUT;

    if(isLoggedIn()) {
        args.beforeSend = function (xhr) {
            xhr.setRequestHeader("Authorization", 'Bearer ' + getUserDataByKey(KEY_ACCESS_TOKEN));
        };
    }

    can.when(can.ajax(args)).then(function (result) {
        if (result !== null) {
            if (callBackObj && can.isFunction(successCallBack)) {
                successCallBack.call(callBackObj, result);
            }
            return;

            // Deprecated handler for now
            if (result.code === AJAX_OK) { //&& !can.isEmptyObject(result.Data)
                if (callBackObj && can.isFunction(successCallBack)) {
                    successCallBack.call(callBackObj, result.data);
                }
                return;
            } else {
                msg = result.description + " (" + result.code + ")";
            }

            if (callBackObj) {
                failCallBack.call(callBackObj, msg);
            }
        }
    }, function (xhr, exception) {
        // handle errors
        //alert(JSON.stringify(xhr) + ' [] ' + exception);
        if (callBackObj) {
            var obj = {};
            if (xhr.responseText) {
                try {
                    obj = JSON.parse(xhr.responseText);
                } catch (e) {
                    obj.code = xhr.status;
                }
            }

            if (isEmpty(obj.code)) {
                obj.code = xhr.status || 500;
            }

            /*Authorization Handler
            if(obj.code === 401) {
                obj.message = obj.error_description || "The request is invalid.";
            }*/

            // Timeout Handler
            if (exception === "timeout") {
                obj.message = _s('CE006');
                obj.code = 408;
            }

            // Empty Object Handler
            if(isEmpty(obj.message)) {
                obj.message = _s('CE004');
            }

            if(obj.code === 500) {
                submitError(exception);
            }
            

            // Making sure that callBackObj is a control with inputs
            // Requires "modelState" to be returned with a table of errors based on keys
            if(!can.isEmptyObject(callBackObj.inputs)) {
                var control = callBackObj;
                can.each(obj.modelState, function(item, key){
                    if(!isEmpty(key)) {
                        var input = control.element.find("input[name="+key+"]");
                        if(input) {
                            //msg = item;
                            var objMessage = null;
                            if(Array.isArray(item) && item.length > 0) {
                                objMessage = item[0] || "This field cannot be validated.";
                            } else {
                                objMessage = item;
                            }
                            addInputError(control.inputs, input, objMessage);

                            return;
                        }
                    } else {
                        if(Array.isArray(item) && item.length > 0) {
                            console.log("common : callAjax setting obj message to = "+obj.message);
                            obj.message = item[0];
                        }
                    }
                });
            }

            failCallBack.call(callBackObj, obj.message + " (" + obj.code + ")", obj.modelState);
        }
    });
}

function isTrue(t) {
    return t === "true" || t === true;
}

// Test to see if this is IE mobile
function isIEMobile() {
    var regExp = new RegExp("IEMobile", "i");
    return navigator.userAgent.match(regExp);
}

// Test to see if this is old chrome
function isOldChrome() {
    var regExp = new RegExp("Chrome/1.\.", "i");
    var test = navigator.userAgent.match(regExp);

    return test && hasChrome();
}

// Test to see if this is new chrome after or equal to 20.
function isNewChrome() {
    var regExp = new RegExp("Chrome/[23][0-9]\.", "i");
    var test = navigator.userAgent.match(regExp);

    return test && hasChrome();
}

// Test to see if this is chrome
function hasChrome() {
    var test = (navigator.userAgent.indexOf('Chrome') !== -1);
    return test;
}

// Test to see if this is HTC Default Browser
function isHTCMobile() {
    var regExp = new RegExp("HTC", "i");
    var test = navigator.userAgent.match(regExp);
    return test;
}

// Test to see if this is apple
function isAppleMobile() {
    var regExp = new RegExp("iPhone|iPad|iPod", "i");
    return navigator.userAgent.match(regExp);
}

// Fade something in using CSS
function fadeIn(element, callBack) {
    if (!element.hasClass('dg-css-hidden')) {
        element.addClass('dg-css-hide');
    }
    setTimeout(function () {
        element.removeClass('dg-css-hide');
        element.removeClass('dg-css-hidden');
        element.addClass('dg-css-fade-in');
        element.one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function (e2) {
            element.removeClass('dg-css-fade-in');
        });

        if (callBack !== undefined && can.isFunction(callBack)) {
            callBack();
        }
    }, 1);
}

// Fade something out using CSS
function fadeOut(element, callBack) {
    var removed = false;
    element.addClass('dg-css-fade-out');
    element.one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function (e) {
        if(!removed) {
            element.removeClass('dg-css-fade-out');
            removed = true;
            if (callBack !== undefined && can.isFunction(callBack)) {
                callBack();
            }
        }
    });
    setTimeout(function () {
        if(!removed) {
            element.removeClass('dg-css-fade-out');
            removed = true;
            if (callBack !== undefined && can.isFunction(callBack)) {
                callBack();
            }
        }
    }, TRANSITION_SPEED);
}

// This handles both dd/mm/yyyy as well as yyyy-mm-dd
function getDateFromInput(str) {
    var dateParts = null;
    var targetDate = null;
    str = can.trim(str);
    //var offsetHours = moment.duration(1, 'h');
    if (str.indexOf('-') !== -1 && moment.utc(str, "YYYY-MM-DD").isValid()) {
        targetDate = moment.utc(str, "YYYY-MM-DD").toDate();
    /*
            dateParts = str.split('-');
            // Date takes in yyyy, mm, dd force to 1 oclcok
            targetDate = new Date(Date.UTC(dateParts[0], parseInt(dateParts[1]) - 1, parseInt(dateParts[2]), 0, 0, 0));

            if (parseInt(dateParts[1]) - 1 > 11) { return null; }
            if (parseInt(dateParts[2]) > 31) { return null; }*/
    } else if (str.indexOf('/') !== -1 && moment.utc(str, "DD/MM/YYYY").isValid()) {
        // Force to 1 oclock
        targetDate = moment.utc(str, "DD/MM/YYYY").toDate();
    /*
            dateParts = str.split('/');
            targetDate = new Date(Date.UTC(dateParts[2], parseInt(dateParts[1]) - 1, parseInt(dateParts[0]), 0, 0, 0));
            if (parseInt(dateParts[1]) - 1 > 11) { return null; }
            if (parseInt(dateParts[0]) > 31) { return null; }*/
    }
    //alert(JSON.stringify(targetDate));
    return targetDate;
}

// Makes a string's first letter uppercase
function formatCapName(str) {
    str = str.toLowerCase();
    var pieces = str.split(" ");
    for (var i = 0; i < pieces.length; i++) {
        var j = pieces[i].charAt(0).toUpperCase();
        pieces[i] = j + pieces[i].substr(1);
    }
    return pieces.join(" ");
}

// Format Phone, removes all spaces, -(dashes) and changes O to 0.
function formatPhone(phone) {
    var str = String(phone).replace(/ /g, '');
    str = str.replace(/O/g, '0');
    str = str.replace(/-/g, '');
    return str;
}

function formatEmail(email) {
    var str = String(email).replace(/ /g, '');
    str = str.toLowerCase();
    return str;
}

// Formats address object to a single string
function formatAddress(addressObject) {
    if(isEmpty(addressObject.addressLine1) && isEmpty(addressObject.suburb)) {
        return '';
    }
    var str = addressObject.addressLine1 + ', ';
    if (!isEmpty(addressObject.addressLine2)) {
        str += addressObject.addressLine2 + ', ';
    }
    if (!isEmpty(addressObject.suburb)) {
        str += addressObject.suburb + ', ';
    }
    if (!isEmpty(addressObject.state)) {
        str += addressObject.state + ', ';
    }
    if (!isEmpty(addressObject.postcode)) {
        str += addressObject.postcode;
    }
    return str;
}

// Quick format currency of whole digit numbers
function formatCurrency(value) {
    var stringValue = String(value);
    value = Math.round(value * 100) / 100;

    var output = "" + value;
    if (stringValue.indexOf('$') === -1) {
        output = '$' + output;
    }
    var dotIndex = output.indexOf('.');
    if (dotIndex === -1) {
        output = output + ".00";
    } else if (output.substring(dotIndex + 1).length === 1) {
        output = output + "0";
    }
    return output;
}

/* For Password Complexity Weak 50 <> Average 75 <> Strong 100 <> Secure ++ */
function analysePasswordScore(str , minLen) {
    var num = {};
    num.Excess = 0;
    num.Upper = 0;
    num.Numbers = 0;
    num.Symbols = 0;

    var bonus = {};
    bonus.Excess = 5;
    bonus.Upper = 4;
    bonus.Numbers = 5;
    bonus.Symbols = 5;
    bonus.Combo = 0;
    bonus.FlatLower = 0;
    bonus.FlatNumber = 0;

    var charPassword = str.split("");

    var baseScore = 50;
    for (i = 0; i < charPassword.length; i++) {
        if (charPassword[i].match(/[A-Z]/g)) { num.Upper++; }
        if (charPassword[i].match(/[0-9]/g)) { num.Numbers++; }
        if (charPassword[i].match(/(.*[!,@,#,$,%,^,&,*,?,_,~])/)) { num.Symbols++; }
    }

    num.Excess = charPassword.length - minLen;
    if(num.Excess < 0) {
        bonus.Excess = 10;
    } else {
        bonus.Excess = 5;
    }

    if (num.Upper && num.Numbers && num.Symbols) {
        bonus.Combo = 25;
    }

    if (str.match(/^[\sa-z]+$/)) {
        bonus.FlatLower = -50;
    }

    if (str.match(/^[\s0-9]+$/)) {
        bonus.FlatNumber = -50;
    }

    var score = baseScore + (num.Excess * bonus.Excess) + bonus.Combo + bonus.FlatLower + bonus.FlatNumber;

    return score;
}

// Australian states for select boxes
function getAusStates() {
    return {
        0: {
            label: "ACT",
            value: "ACT"
        },
        1: {
            label: "NSW",
            value: "NSW"
        },
        2: {
            label: "NT",
            value: "NT"
        },
        3: {
            label: "QLD",
            value: "QLD"
        },
        4: {
            label: "SA",
            value: "SA"
        },
        5: {
            label: "TAS",
            value: "TAS"
        },
        6: {
            label: "VIC",
            value: "VIC"
        },
        7: {
            label: "WA",
            value: "WA"
        }
    };
}

// Scrolls to the top
function resetScrollTop() {        
    // Hack Setting for Mobile done here because, its the only place safe
    can.$('#dg-overall-wrapper').css('min-height', window.innerHeight);
    
    setTimeout(function () {
        //alert("scrolling");
        window.scrollTo(0, 0);
    }, Math.round(TRANSITION_SPEED/2));
}

// Removes Error Splash
function removeSplashError() {
    var splashNode = can.$('.dg-splash-error');
    if (splashNode) {
        splashNode.remove();
    }

    if (splashErrorControl) {
        splashErrorControl.destroy();
        splashErrorControl = null;
    }
}

// Clear Error State
function clearError(node, border) {
    if (node !== null) {
        node.removeClass("error");

        var smallMessage = node.closest('div').find('small.error');
        smallMessage.remove();
    }

    if (border) {
        node.css("borderColor", "#c8c8c8");
    }

    removeSplashError();
}

// Home Button Click
function homeFunction() { location.href = homeURL; }

// Exit Popup Prompt
function exitFunction(onYesFunction, onNoFunction) {
    if (!can.isFunction(onYesFunction)) {
        //this.location.href = '/';
        onYesFunction = function () {
            //alert('TBD - Please update common.js exitFunction');
            homeFunction();
        };
    }
    createPopup(_s('C007'), "<p>" + _s('C008') + "</p>", _s('CYES'), _s('CNO'), onYesFunction, onNoFunction);
}

// Does a Waiting Animation Fake Waiting Time
// Only calls call back when delay is not -1 and if call back is valid function
function showWaitOnSubmit(button, callBack, delay) {
    var originalVal = button.val();
    var originalClass = button.attr('class');
    button.removeClass('alert');
    button.removeClass('info');
    button.removeClass('success');

    button.addClass('dg-submit-spinner');
    button.val('');
    if (delay > -1 && can.isFunction(callBack)) {
        setTimeout(callBack, delay * 500);
    }
    // UX
    var t = 0;
    button.val(_s('C009'));
    var timer = setInterval(function () {
        t++;
        if (t === WAITING_1) {
            button.val(_s('C010'));
        } else if (t === WAITING_2) {
            button.val(_s('C011'));
        } else if (t === WAITING_3) {
            button.val(_s('C012'));
        } else if (t === WAITING_4) {
            button.val(_s('C013'));
        } else if (t === WAITING_5) {
            // Reset button
            button.attr('class', originalClass);
            button.val(originalVal);
        }
    }, 1000);

    button.trigger('blur');

    return timer;
}

// Used to reset the waiting button back
function clearWaitOnSubmit(button, className, value) {
    if (button) {
        button.attr('class', className);
        button.val(value);
    } else {
        alert('button not valid');
    }
}

// Adds the clear button to inputs
function addClearButton(element) {
    var clearButton = element.closest('div').find('.dg-input-clear-button');
    if (clearButton) {
        clearButton.hide();
        element.off('keydown paste change');
        element.on('keydown paste change', function (event) {
            if (!isEmpty(element.val())) {
                clearButton.show();
            }
        });
        clearButton.click(function (event) {
            element.val('');

            setTimeout(function(){
                element.trigger('focus');
                element.trigger('keyup');
            }, TYPING_THRESHOLD/5);

            clearButton.hide();
            event.preventDefault();
            return false;
        });
    }
}

// Updates the form element value one of
// name, type, limit, message, comparator, value, parent
function updateFormElement(inputs, n, k, v) {
    if (inputs) {
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].name === n) {
                var obj = inputs[i];
                obj[k] = v;
                break;
            }
        }
    }
}

// Adds a form element to the list to be validated
// Name, Type, Limit, Error Message, Comparator, Value if not Null
function addFormElement(inputs, n, t, l, m, c, v, p) {
    if (!c) {
        c = ">";
    }
    var obj = { name: n, type: t, limit: (l || 0), message: m, comparator: c, value: v, parent: p };
    inputs.push(obj);

    // Clear Button functionality requires parent to be set and only works for input type of text
    if (p) {
        addInputBehaviors(n, t, p, l);
    }
}

function addInputBehaviors(n, t, p, l) {
    var element = p.find("input[name='" + n + "']");
    addClearButton(element);

    if (t === 'letter') {
        element.off('blur keyup');
        element.on('blur keyup', function (e) {
            element.val(formatCapName(element.val()));
        });
    } else if(t === 'password') {
        element.off('blur keyup change');
        element.on('blur keyup change', function (e) {
            var strength = analysePasswordScore(element.val(), l);
            if(!isEmpty(element.val())) {
                updatePasswordIndicator(element, strength);
            } else {
                var closestParentDiv = element.closest('div.columns');
                var icon = closestParentDiv.find('div.dg-password');
                var iconText = closestParentDiv.find('div.dg-password-text');
                iconText.html("");
                icon.attr("class", "dg-password dg-password-none");
                icon.html("");
                setTimeout(function(){
                    var passwordBlock = closestParentDiv.find('.dg-password-block');
                    if(passwordBlock) {
                        passwordBlock.removeClass('dg-password-entered');
                        passwordBlock.addClass('dg-password-empty');
                    }
                }, TRANSITION_SPEED);
            }
        });
    }
}

// Removes the form element from detection list
function removeFormElement(inputs, n) {
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].name === n) {
            var obj = inputs.splice(i, 1);
            if (obj.type === 'letter') {
                var p = obj.parent;
                if (p) {
                    var element = p.find("input[name='" + n + "']");
                    element.off('blur keyup');
                }
            }
            break;
        }
    }
}

// Updates password indicator
function updatePasswordIndicator(input, strength) {
    var closestParentDiv = input.closest('div.columns');
    console.log("common : updatePasswordIndicator " + strength);

    var passwordBlock = closestParentDiv.find('.dg-password-block');
    if(passwordBlock) {
        passwordBlock.removeClass('dg-password-empty');
        passwordBlock.addClass('dg-password-entered');
    }

    var icon = closestParentDiv.find('div.dg-password');
    var iconText = closestParentDiv.find('div.dg-password-text');
    if(icon) {
        var displayPer = strength;
        if(displayPer < 0) {
            displayPer = 0;
        } else if(displayPer > 100) {
            displayPer = 100;
        }
        icon.removeClass('dg-password-none dg-password-vstrong dg-password-strong dg-password-average dg-password-bad dg-password-vbad');
        if(strength < 20) {
            icon.addClass('dg-password-vbad');
            iconText.html("VERY WEAK");
        } else if(strength <= 40) {
            icon.addClass('dg-password-bad');
            iconText.html("WEAK");
        } else if(strength <= 60) {
            icon.addClass('dg-password-average');
            iconText.html("AVERAGE");
        } else if(strength <= 80) {
            icon.addClass('dg-password-strong');
            iconText.html("STRONG");
        } else if(strength > 80) {
            icon.addClass('dg-password-vstrong');
            iconText.html("VERY STRONG");
        }
        //icon.html(displayPer + "%");
    }
}

// Check if a string is empty
function isEmpty(str) {
    if (!str || str === '' || str.length === 0 || str === 'null' || str === "undefined") {
        return true;
    }

    return false;
}

// Validates an email address
function validateEmail(sEmail) {
    var filter = (/^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/);
    if (filter.test(sEmail)) {
        return true;
    } else {
        return false;
    }
}

// Vavlidates mobile only in the format +614XXXXXXXX or +614 XXXXX XXX
function validateMobile(sMobile) {
    var stripped = sMobile.removeChar(' ');
    //var filter = (/^\+\d{2}\s\d\d{5}\s\d{3}/);
    var filter2 = (/^\+\d{2}[4]\d{5}\d{3}/);
    var filter3 = (/^[0][4]\d{8}/);
    if (filter2.test(stripped) || filter3.test(stripped)) {
        return true;
    } else {
        return false;
    }
}

// Validates if a string is letters only
function validateLetters(str) {
    return (/^[a-zA-Z\s']+$/i).test(str);
}

// Invalidates all inputs in the list, types are configured specifically for this app
// dateCompare, text, letter, number, email, date, checkbox, radio, legal, select, month, year
function invalidateForm(inputs, successCallBack, failCallBack) {
    // Resets previous splash
    removeSplashError();

    var valid = true;
    var message = _s('CE000');
    var messageSet = false;

    var firstError = null;

    for (var i = 0; i < inputs.length; i++) {
        var obj = inputs[i];
        var objName = obj.name;
        var objType = obj.type;
        var objLimit = obj.limit;
        var objMessage = obj.message;
        var objComp = obj.comparator;
        var objValue = obj.value;
        var objParent = obj.parent;

        var input = can.$("input[name='" + objName + "']");
        if (objType === "textarea") {
            input = can.$("textarea[name='" + objName + "']");
        }

        if (objParent) {
            // Not catered for select
            input = objParent.find("input[name='" + objName + "']");

            if (objType === "textarea") {
                input = objParent.find("textarea[name='" + objName + "']");
            }
        }

        var value = input.val();
        var localValid = false;

        // Update limit swap for dynamic message
        objMessage = objMessage.replace('%d%', objLimit);

        switch (objType) {
            case "dateCompare":
                var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                var today = moment.utc().toDate();
                var targetDate = getDateFromInput(can.trim(value));
                if (targetDate) {
                    var diffDays = Math.floor(targetDate.getTime() / oneDay) - Math.floor(today.getTime() / oneDay);
                    //alert(JSON.stringify(today) + ' - ' + JSON.stringify(targetDate));
                    //alert(Math.floor(targetDate.getTime() / oneDay) + ' - ' + Math.floor(today.getTime() / oneDay));
                    localValid = eval(diffDays + objComp + objLimit);
                } else {
                    localValid = false;
                }
                break;
            case "hidden":
                localValid = !isEmpty(value) && eval(value.length + objComp + objLimit);
            case "textarea":
                value = can.trim(value);
                input.val(value);
                localValid = !isEmpty(value) && eval(value.length + objComp + objLimit);
                break;
            case "passwordStrength":
                value = can.trim(value);
                input.val(value);
                
                if(isEmpty(value)) {
                    // For password editing modes
                    localValid = true;
                } else {
                    var strength = analysePasswordScore(value, objLimit);
                    console.log("common : analysePasswordScore " + strength);
                    localValid = !isEmpty(value) && eval(strength + '>=' + MIN_PASSWORD_STRENGTH);
                }
                break;
            case "stringCompare":
                value = can.trim(value);
                var compareInput = objParent.find("input[name='" + objValue + "']");
                if(compareInput) {
                    var compareString = can.trim(compareInput.val());
                    console.log("common : stringCompare "+value+" =? " + compareString)
                    localValid = !isEmpty(value) && (value === compareString);
                } else {
                    localValid = false;
                }
                break;
            case "text":
            case "password":
                value = can.trim(value);
                input.val(value);
                localValid = !isEmpty(value) && eval(value.length + objComp + objLimit);
                break;
            case "letter":
                value = can.trim(value);
                input.val(value);
                localValid = !isEmpty(value) && eval(value.length + objComp + objLimit) && validateLetters(value);
                break;
            case "mobile":
                value = can.trim(value);
                input.val(value);
                localValid = !isEmpty(value) && validateMobile(value);
                break;
            case "number":
                value = can.trim(value);
                input.val(value);
                localValid = !isEmpty(value) && eval(value.length + objComp + objLimit) && $.isNumeric(value);
                break;
            case "email":
                value = can.trim(value);
                input.val(value);
                localValid = !isEmpty(value) && validateEmail(value);
                break;
            case "dob":
            case "date":
                localValid = !isEmpty(value) && eval(value.length + objComp + objLimit);
                break;
            case "checkbox":
                localValid = $('input[name="' + objName + '"]:checkbox:checked').length >= objLimit;
                break;
            case "radio":
                localValid = input.is(':checked');
                /*
                if (!localValid) {
                    input.closest('.btn-radio-container').css("borderColor", ERROR_BORDER_COLOR);
                } else {
                    input.closest('.btn-radio-container').css("borderColor", "#c8c8c8");
                }*/
                break;
            case "legal":
                localValid = input.is(':checked');
                if (!localValid) {
                    input.css("borderColor", ERROR_BORDER_COLOR);
                } else {
                    input.css("borderColor", "#c8c8c8");
                }
                break;
            case "select":
                input = $("select[name='" + objName + "']");
                value = input.val();
                localValid = (value !== "NA") && !isEmpty(value);
                // Hack
                if (!localValid) {
                    input.css("borderColor", ERROR_BORDER_COLOR);
                } else {
                    input.css("borderColor", "#c8c8c8");
                }
                break;
            case "month":
                input = $("select[name='" + objName + "']");
                value = input.val();
                localValid = (value !== "Month") && !isEmpty(value);
                // Hack
                if (!localValid) {
                    input.css("borderColor", ERROR_BORDER_COLOR);
                } else {
                    input.css("borderColor", "#c8c8c8");
                }
                break;
            case "year":
                input = $("select[name='" + objName + "']");
                value = input.val();
                localValid = (value !== "Year") && !isEmpty(value);
                // Hack
                if (!localValid) {
                    input.css("borderColor", ERROR_BORDER_COLOR);
                } else {
                    input.css("borderColor", "#c8c8c8");
                }
                break;
        }

        if (!localValid) {
            if (!firstError) {
                firstError = input;
            }

            if(objType !== 'radio') {
                addInputError(inputs, input, objMessage);
                //input.addClass("error");
            }

            if (!messageSet) {
                // Set the latest message for splashes
                message = (objType !== 'legal' && objType !== 'checkbox' && objType !== 'radio') ? _s('CE000') : objMessage;
                messageSet = true;
            }

            /*
            if(objType !== 'legal' && objType !== 'checkbox') {
                var smallMessage = input.closest('div').find('small.error');
                if(smallMessage) {
                    smallMessage.remove();
                }

                can.$('<small class="error">'+objMessage+'</small>').insertAfter(input);
            }
            */
        } else if (!isEmpty(value)) {
            input.removeClass("error");
        }

        valid = valid && localValid;
    }

    if (firstError) {
        //Red borders will not work with this
        //firstError.trigger('focus');
    }

    if (valid && can.isFunction(successCallBack)) {
        successCallBack();
    } else if (!valid && can.isFunction(failCallBack)) {
        failCallBack(message);
    }

    return valid;
}

// Add error to an input
function addInputError(inputs, input, message) {
    var inputName = input.prop('name');

    var objType = null;

    for (var i = 0; i < inputs.length; i++) {
        var obj = inputs[i];
        if(obj.name === inputName) {
            objType = obj.type;
            console.log("common : found type " + objType);
        }
    }

    input.addClass("error");
    
    if(objType !== 'legal' && objType !== 'checkbox' && objType !== null) {
        var smallMessage = input.closest('div').find('small.error');
        if(smallMessage) {
            smallMessage.remove();
        }

        can.$('<small class="error">'+message+'</small>').insertAfter(input);
    }
            
    // On focus out remove all error
    if (objType === "select" || objType === "month" || objType === "year") {
        input.on("change", function () {
            if ($(this).val() !== "NA" && !isEmpty($(this).val())) {
                clearError($(this), true);
            }
        });
    } else if (objType === "radio") {
        input.on("change", function () {
            if ($(this).val() !== "NA" && !isEmpty($(this).val())) {
                clearError($('.btn-radio-container'), true);
            }
        });
    } else if(objType !== null) {
        input.on("propertychange input paste", function () {
            if ($(this).val() !== "NA" && !isEmpty($(this).val())) {
                clearError($(this));
            }
        });
    }
}

// Checks if anything that is not new chrome or apple mobile, then change to text
function fixDateInput(n, parent) {
	var element = parent.find("input[name='" + n + "']");
	if (!(isNewChrome() || isAppleMobile())) {
		element.attr('type', 'text');
	}
}

// Format Mobile Input on every change/input
function formatMobileInput(n, parent) {
    var element = parent.find("input[name='" + n + "']");
    element.on('propertychange keyup input change', function(e){
        var currentValue = element.val();
        if(currentValue === '0') {
            currentValue = '+61 ';
            element.val(currentValue);
        } else if(currentValue.length === 1 && currentValue !== '+') {
            currentValue = '+' + currentValue;
            element.val(currentValue);
        } else if(currentValue.length >= 11) {
            //console.log('beforeRemove ='+currentValue);
            currentValue = currentValue.removeChar(' ');
            //console.log('afterRemove ='+currentValue);
            currentValue = currentValue.insert(3, 0, ' ');
            //console.log('afterInsert At 3 ='+currentValue);
            currentValue = currentValue.insert(10, 0, ' ');
            //console.log('afterInsert At 10 ='+currentValue);
            element.val(currentValue);
        } else if(currentValue.length >= 4) {
            currentValue = currentValue.removeChar(' ');
            currentValue = currentValue.insert(3, 0, ' ');
            element.val(currentValue);
        } 
    });
}

// Populates form value in the list
function populateFormValues(elementParent, inputs, values) {
    if (!values || can.isEmptyObject(values)) {
        return;
    }

    can.each(inputs, function (obj, key) {
        var objName = obj.name;
        var objType = obj.type;
        var objLimit = obj.limit;
        var objMessage = obj.message;
        var objComp = obj.comparator;
        var objValue = values[objName];

        var element = elementParent.find("input[name='" + objName + "']");

        if (objType === "textarea") {
            input = elementParent.find("textarea[name='" + objName + "']");
        }

        switch (objType) {
            case "textarea":
            case "password":
            case "text":
            case "letter":
            case "number":
            case "email":
            case "mobile":
            case "hidden":
            case "dob":
            case "date":
                element.val(objValue).trigger('change');
                break;
            case "radio":
                element = elementParent.find("input[value='" + objValue + "']");
                element.prop('checked', true);
                break;
            case "legal":
            case "checkbox":
                element = elementParent.find("input[value='" + objValue + "']");
                element.prop('checked', true);
                break;
            case "select":
                element = $("select[name='" + objName + "']");
                // TODO test to see if this works
                element.val(objValue);
                break;
            case "month":
                element = $("select[name='" + objName + "']");
                element.val(objValue);
                break;
            case "year":
                element = $("select[name='" + objName + "']");
                element.val(objValue);
                break;
        }
    });
}

// Popup Helper function
function createPopup(titleString, bodyString, leftString, rightString, leftFunction, rightFunction, caller, removeOnButton, hideCloseButton) {
    console.log("common : createPopup");
    return _c('Popup').create(titleString, bodyString, leftString, rightString, leftFunction, rightFunction, caller, removeOnButton, hideCloseButton);
}

// Helpers End =====