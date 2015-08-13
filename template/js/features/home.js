/* 
 * MobileJS
 * MIT Licence
 * You can use this according to the MIT Licence.
 * 
 * Filename: home.js
 * Version: 1.0
 * 
 * Description:
 * 
 * The first screen when user lands on this web app when the user has not yet logged in.
 * This screen contains all the prelogin contents.
 * 
 * !! NOTE
 * Due to the way the canvas are setup, we need to rely on css to stretch height to the full of screen dyanmically.
 * 
 */


var init = function ( data ) {
    // Inits the feature strings, string files must be loaded before this
    // This will override existing strings
    initDictionary(homeStrEN);

    // Scope Variables
    var mainContainer = can.$("#dg-overall-wrapper");

    // Step result is important for reinstantiations
    var formValues = {};
    var formDatas = {};
    var stepInfo = {};
    var currentPage;
    var currentStep;
    var pageSlider;

    // Language Things ================================================================================

    // Models & Ajax ================================================================================

    // State
    var lastFeature, lastFeaturePage, nextFeature, nextFeaturePage, forcedDirection, model;
    if(data) {
        lastFeature = data.lastFeature;
        lastFeaturePage = data.lastFeaturePage;
        nextFeature = data.nextFeature;
        nextFeaturePage = data.nextFeaturePage;
        forcedDirection = data.forcedDirection;
        model = data.model;
    }

    if(!model || can.isEmptyObject(model)) {
        model = {};
    }
    // Miscellaneous

    console.log(currentFeature+" : init");

    // A wrapper completion function when a page's control init has been called.
    var onInitComplete = function( control ) {
        cleanUp(control);
        forcedDirection = null;
    }

    // Controls ==============================================================================

    // Page Controllers

    // Services Page
    var ServicesPage = can.Control({
        init: function () {
            this.infocus = true;

            can.route.attr('page', currentPage);

            // Directional
            var page = loadView(baseURL+'ejs/features/home/services.ejs', this.options);
            if(!page) {
                return;
            }
            pageSlider.slidePage(page, '#dg-services-section', this.element, currentPage, forcedDirection);

            onInitComplete(this);
        },
        'a.dg-back-icon click': function (element, event) {
            if(!isEmpty(lastFeature) && !isEmpty(lastFeaturePage)) {
                // Force Direction
                loadFeature(lastFeature, { forcedDirection: 'left' , defaultPage:lastFeaturePage, model:model });
            } else {
                showLanding();
            }
            event.preventDefault();
        },
        'input[name=submit] click': function (element, event) {
            window.open(fullSiteURL, '_blank');

            //event.preventDefault();
            //return false;
        }
    });

    // Starts Services Page
    showServices = function () {
        //alert("showContact()");
        removeSplashError();
        var content = {
            leftBtnString: _s('DBACK'),
            leftBtnClass: "backIcon",
            rightBtnString: "",
            rightBtnClass: "",
            hideLogo: false,
            logoTitle: _s('CSITENAME'),
            showTitle: true,
            title: _s('D006'),
            hideSuperTitle: true,
            //superTitle: '',
            fullSiteURL: fullSiteURL
        };
        var formElements = {
            submit: {
                name: "submit",
                value: _s('D001'),
                inputClass: "expand",
                title: _s('D001')
            }
        };

        currentPage = 'services';
        var map = new can.Map({ content: content, form: formElements });
        new ServicesPage('#dg-overall-wrapper', map);
        resetScrollTop();
    };

    var ContactPage = can.Control({
        init: function () {
            this.infocus = true;

            can.route.attr('page', currentPage);

            // Directional
            var page = loadView(baseURL+'ejs/features/home/contact.ejs', this.options);
            if(!page) {
                return;
            }
            pageSlider.slidePage(page, '#dg-contact-section', this.element, currentPage, forcedDirection);

            onInitComplete(this);
        },
         'a.dg-back-icon click': function (element, event) {
            if(!isEmpty(lastFeature) && !isEmpty(lastFeaturePage)) {
                // Force Direction
                loadFeature(lastFeature, { forcedDirection: 'left' , defaultPage:lastFeaturePage, model:model });
            } else {
                showLanding();
            }
            event.preventDefault();
        },
        'input[name=submit] click': function (element, event) {
            location.href = "mailto:support@licence.nsw.gov.au?subject="+_s('D005');

            event.preventDefault();
            return false;
        }
    });

    // Starts Contact Page
    showContact = function () {
        //alert("showContact()");
        removeSplashError();
        var content = {
            leftBtnString: _s('DBACK'),
            leftBtnClass: "backIcon",
            rightBtnString: "",
            rightBtnClass: "",
            hideLogo: false,
            logoTitle: _s('CSITENAME'),
            showTitle: true,
            title: _s('D004'),
            hideSuperTitle: true,
            //superTitle: '',
            fullSiteURL: fullSiteURL
        };
        var formElements = {
            submit: {
                name: "submit",
                value: _s('D003'),
                inputClass: "expand",
                title: _s('D003')
            }
        };

        currentPage = 'contact';
        var map = new can.Map({ content: content, form: formElements });
        new ContactPage('#dg-overall-wrapper', map);
        resetScrollTop();
    };

    var PrivacyPage = can.Control({
        init: function () {
            this.infocus = true;

            can.route(currentFeature+"/:page", { page: currentPage });

            // Directional
            var page = loadView(baseURL+'ejs/features/home/privacy.ejs', this.options);
            if(!page) {
                return;
            }
            pageSlider.slidePage(page, '#dg-privacy-section', this.element, currentPage, forcedDirection);

            onInitComplete(this);
            
            var control = this;
            setTimeout(function () {
            }, TRANSITION_SPEED);
        },
        'a.dg-back-icon click': function (element, event) {
            if(!isEmpty(lastFeature) && !isEmpty(lastFeaturePage)) {
                // Force Direction
                loadFeature(lastFeature, { forcedDirection: 'left' , defaultPage:lastFeaturePage, model:model });
            } else {
                showLanding();
            }
            event.preventDefault();
        },
        'input[name=submit] click': function (element, event) {
            window.open(fullSiteURL, '_blank');

            event.preventDefault();
            return false;
        }
    });

    // Starts Privacy Page
    showPrivacy = function () {
        //alert("showAbout()");
        removeSplashError();
        var content = {
            leftBtnString: _s('DBACK'),
            leftBtnClass: "backIcon",
            rightBtnString: "",
            rightBtnClass: "",
            hideLogo: false,
            logoTitle: _s('CSITENAME'),
            showTitle: true,
            title: 'Privacy Policy',
            hideSuperTitle: true,
            //superTitle: '',
            fullSiteURL: fullSiteURL
        };
        var formElements = {
            submit: {
                name: "submit",
                value: _s('D001'),
                inputClass: "expand",
                title: _s('D001')
            }
        };
        currentPage = 'privacy';
        var map = new can.Map({ content: content, form: formElements });
        new PrivacyPage('#dg-overall-wrapper', map);
        resetScrollTop();
    };

    var AboutPage = can.Control({
        init: function () {
            this.infocus = true;

            can.route(currentFeature+"/:page", { page: currentPage });

            // Directional
            var page = loadView(baseURL+'ejs/features/home/about.ejs', this.options);
            if(!page) {
                return;
            }
            pageSlider.slidePage(page, '#dg-about-section', this.element, currentPage, forcedDirection);

            onInitComplete(this);
            
            var control = this;
            setTimeout(function () {
            }, TRANSITION_SPEED);
        },
        'a.dg-back-icon click': function (element, event) {
            if(!isEmpty(lastFeature) && !isEmpty(lastFeaturePage)) {
                // Force Direction
                loadFeature(lastFeature, { forcedDirection: 'left' , defaultPage:lastFeaturePage, model:model });
            } else {
                showLanding();
            }
            event.preventDefault();
        },
        'input[name=submit] click': function (element, event) {
            window.open(fullSiteURL, '_blank');

            event.preventDefault();
            return false;
        }
    });

    // Starts About Page
    showAbout = function () {
        //alert("showAbout()");
        removeSplashError();
        var content = {
            leftBtnString: _s('DBACK'),
            leftBtnClass: "backIcon",
            rightBtnString: "",
            rightBtnClass: "",
            hideLogo: false,
            logoTitle: _s('CSITENAME'),
            showTitle: true,
            title: _s('D002'),
            hideSuperTitle: true,
            //superTitle: '',
            fullSiteURL: fullSiteURL
        };
        var formElements = {
            submit: {
                name: "submit",
                value: _s('D001'),
                inputClass: "expand",
                title: _s('D001')
            }
        };
        currentPage = 'about';
        var map = new can.Map({ content: content, form: formElements });
        new AboutPage('#dg-overall-wrapper', map);
        resetScrollTop();
    };

    // Landing Control Widget ==========================
    var LandingPage = can.Control({
        init: function () {
            this.infocus = true;

            can.route(currentFeature+"/:page", { page: currentPage });

            // Directional
            var page = loadView(baseURL+'ejs/features/home/landing.ejs', this.options);
            if(!page) {
                return;
            }
            pageSlider.slidePage(page, '#dg-landing-section', this.element, currentPage, forcedDirection);

            onInitComplete(this);
            
            var control = this;
            setTimeout(function () {
                // Color hack to force background
                var landingHeight = control.element.find('.dg-home').innerHeight();
                var footerHeight = control.element.find('.dg-landing-footer').innerHeight();
                console.log('home : landing differece ' + window.innerHeight + " - " + landingHeight + " + " + footerHeight);
                control.element.find('.dg-landing-footer').css('min-height', window.innerHeight - landingHeight + footerHeight);
            }, 1);
        },
        willExit: function() {
            //can.$('body').css('background-color','#fff');
        },
        '.dg-landing-banner click': function (element, event) {
            // Color hack to force background back to white
            this.willExit();
            console.log('landing: banner clicked');
            
            loadFeature(FEATURE_SETUP, { defaultPage:"register" });
            
            event.preventDefault();
            return false;
        },
        '.dg-landing-renew click': function (element, event) {
            // Color hack to force background back to white
            this.willExit();
            console.log('landing: renewal clicked');
            
            loadFeature(FEATURE_RENEWAL);

            event.preventDefault();
            return false;
        },
        '.dg-landing-fish click': function (element, event) {
            // Color hack to force background back to white
            this.willExit();
            console.log('landing: fish clicked');
            
            loadFeature(FEATURE_FISH);

            event.preventDefault();
            return false;
        },
        '.dg-landing-update click': function (element, event) {
            // Color hack to force background back to white
            this.willExit();
            console.log('landing: update clicked');
            
            loadFeature(FEATURE_UPDATE);

            /* Test Demo Purpose
            createPopup("Example Title", "I want to fly to the galaxy of updates!", _s('CYES'), _s('DCANCEL'), function(){
                loadFeature(FEATURE_UPDATE);
            }, function() {
                alert("Cancel Clicked");
            }); 
            */

            event.preventDefault();
            return false;
        },
        'a[data-search="right menu privacy"] click': function (element, event) {
            this.willExit();
            console.log('landing: privacy clicked');

            showPrivacy();
            event.preventDefault();
            //return false;
        },
        'a[data-search="right menu about"] click': function (element, event) {
            this.willExit();
            console.log('landing: about clicked');

            showAbout();
            event.preventDefault();
            //return false;
        },
        'a[data-search="right menu contact"] click': function (element, event) {
            this.willExit();
            console.log('landing: contact clicked');

            showContact();
            event.preventDefault();
            //return false;
        },
        'a[data-search="right menu services"] click': function (element, event) {
            this.willExit();
            console.log('landing: services clicked');

            showServices();
            event.preventDefault();
            //return false;
        },
        'a[data-search="right menu register"] click': function (element, event) {
            this.willExit();
            console.log('landing: register clicked');
            loadFeature(FEATURE_SETUP, { defaultPage:"register" });
            event.preventDefault();
            //return false;
        },
        'a[data-search="right menu login"] click': function (element, event) {
            this.willExit();
            console.log('landing: login clicked');
            loadFeature(FEATURE_SETUP, { defaultPage:"login" });
            event.preventDefault();
            //return false;
        }
    });

    // Starts Landing Page
    showLanding = function () {
        removeSplashError();
        var content = {
            leftBtnString: "",
            leftBtnClass: "",
            rightBtnString: " ",
            rightBtnClass: "menuIcon",
            hideLogo: false,
            logoTitle: _s('CSITENAME'),
            //showTitle: true,
            //title: _s('CSITENAME'),
            //hideSuperTitle: true,
            //superTitle: '',
            fullSiteURL: fullSiteURL
        };
        var formElements = {
            
        };
        currentPage = 'landing';
        var map = new can.Map({ content: content, form: formElements });
        new LandingPage('#dg-overall-wrapper', map);
        resetScrollTop();
    };

    // Initialization ========================================================================

    // Creates a slider
    var pageOrder = ['landing', 'about', 'contact', 'services', 'privacy'];
    
    pageSlider = getPageSlider( pageOrder );

    // Setup route format
    can.route(currentFeature+"/:page", { page: "landing" });
    can.route.ready();
    
    // Checks Init Data
    if(!can.isEmptyObject(data)) {
        console.log(currentFeature+' : init data default=' + data.defaultPage);
        
        if(data.defaultPage === 'about') {
            showAbout();
            return;
        } else if(data.defaultPage === 'services') {
            showServices();
            return;
        } else if(data.defaultPage === 'contact') {
            showContact();
            return;
        } else if(data.defaultPage === 'privacy') {
            showPrivacy();
            return;
        }
    }

    showLanding();
};

// Require define module
define(function(){
    return init;
});