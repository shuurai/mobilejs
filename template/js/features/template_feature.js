/* 
 * MobileJS
 * MIT Licence
 * You can use this according to the MIT Licence.
 * 
 * Filename: TODO.js
 * Version: 1.0
 * 
 * Description:
 * 
 * This is a template feature.
 * 
 */

var init = function ( data ) {
    // Inits the feature strings, string files must be loaded before this
    // This will override existing strings
    initDictionary(exampleStrEN);

    // Scope Variables
    var mainContainer = can.$("#dg-overall-wrapper");

    // Step result is important for reinstantiations
    var formValues = {};
    var formDatas = {};
    var stepInfo = {};
    var currentPage;
    var currentStep;

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
        model = {
            licenceType: _s("D001")
        };
    }
    console.log(currentFeature+" : init");

    // Miscellaneous
    
    // Controls ==============================================================================

    // Page Controllers

    var ExamplePage = can.Control({
        init: function () {
            this.infocus = true;

            can.route(currentFeature+"/:page", { page: currentPage });

            // Directional
            var page = loadView(baseURL+'ejs/features/setup/example.ejs', this.options);
            if(!page) {
                return;
            }
            pageSlider.slidePage(page, '#dg-example-section', this.element, currentPage);

            cleanUp(this);

            var control = this;
            setTimeout(function () {
            }, TRANSITION_SPEED);
        }
    });
    
    // Starts TODO Page
    showExample = function () {
        removeSplashError();
        var content = {
            leftBtnString: _s('DBACK'),
            leftBtnClass: "backIcon",
            rightBtnString: "",
            rightBtnClass: "",
            hideLogo: true,
            logoTitle: _s('CSITENAME'),
            showTitle: true,
            title: 'EXAMPLE',
            hideSuperTitle: false,
            superTitle: 'ONE GOV ACCOUNT',
            fullSiteURL: fullSiteURL
        };
        var formElements = {
            submit: {
                name: "submit",
                value: 'NEXT',
                inputClass: "expand",
                title: 'NEXT'
            }
        };
        currentPage = 'example';
        console.log(currentFeature+" : "+currentPage);
        var map = new can.Map({ content: content, form: formElements });
        new ExamplePage('#dg-overall-wrapper', map);
        resetScrollTop();
    };

    // Initialization ========================================================================

    // Creates a slider
    var pageOrder = ['example'];
    pageSlider = getPageSlider( pageOrder );
    
    // Setup route format
    can.route(currentFeature+"/:page", { page: "example" });
    can.route.ready();
    
    // Checks Init Data
    if(!can.isEmptyObject(data)) {
        console.log(currentFeature+' : init data default=' + data.defaultPage);
        if(data.defaultPage === 'example') {
            showExample();
        }
    } else {
        showExample();
    }
};

// Require define module
define(function(){
    return init;
});