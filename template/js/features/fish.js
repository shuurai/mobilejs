/* 
 * MobileJS
 * MIT Licence
 * You can use this according to the MIT Licence.
 * 
 * Filename: fish.js
 * Version: 1.0
 * 
 * Description:
 * 
 * This feature starts the fishing application process.
 *
 * Pages
 * fstep1 - default information page
 * fstep1a - sign in selection page
 * fstep1b - for sign in (possibly register) success call back, and is a quick redirect to 2
 * fstep2 - personal details screen
 * fstep3 - contact details screen
 * fstep4 - address
 * 
 */

var init = function ( data ) {
    // Inits the feature strings, string files must be loaded before this
    // This will override existing strings
    initDictionary(fishStrEN);

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
            licenceType: "Recreational Fishing Fee",
            context: null
        };
    }
    console.log(currentFeature+" : init");

    // Miscellaneous
    var onInitComplete = function( control, skipFocus ) {
        cleanUp(control, skipFocus);
        forcedDirection = null;
    };
 
    var getCardSurcharge = function(card) {
        can.each(model.creditCards, function (card, index) {
            if (card.creditCard === card) {
                return card.creditCardSurcharge;
            }
        });
        return 0.4;
    }

    // Controls ==============================================================================

    // Page Controllers

    // Fish Step 9 Page
    var FishStep9 = can.Control({
        init: function () {
            this.infocus = true;

            can.route(currentFeature+"/:page", { page: currentPage });

            // Directional
            var page = loadView(baseURL+'ejs/features/fish/fstep9.ejs', this.options);
            if(!page) {
                return;
            }
            pageSlider.slidePage(page, '#dg-fstep9-section', this.element, currentPage, forcedDirection);

            // Full application result data also avaiable in model.result as extended in step 8
            
            onInitComplete(this);
            
            var control = this;
            setTimeout(function () {

            }, TRANSITION_SPEED);
        },
        onGenerateSuccess: function(result) {
            clearInterval(this.timer);

            model['context'] = result.ctx;

            loadFeature(FEATURE_FEEDBACK, { model: model })
        },
        onGenerateFail: function(msg) {
            // Proceed anyway but no linkage
            clearInterval(this.timer);
            loadFeature(FEATURE_FEEDBACK, { model: model })
        },
        '.dg-fish input[name=submit] click': function(element, event) {
            if(this.infocus) {
                this.infocus = false;

                this.submitButton = element;
                this.submitButtonClass = element.attr('class');
                this.submitButtonValue = element.val();

                this.timer = showWaitOnSubmit(element, null, -1);

                // Generate the context here
                callAjax({ url: constructAPIURL("api", "security/generateLicencectx"), 
                    dataType:"json", 
                    data: JSON.stringify({ 
                        licenceId: model.result.licenceID || model.result.licenceId, 
                        licenceType: model.licenceType, 
                        licenceNumber: model.result.licenceNo 
                    }) 
                }, this.onGenerateSuccess, this.onGenerateFail, this);
            
                /*
                showWaitOnSubmit(element, function(){
                    // TODO Load Feature Feedback, pass in model from fishing
                    loadFeature(FEATURE_FEEDBACK, { model: model })

                }, WAIT_ON_SUBMIT_SPEED);
                */
            }
            
            event.preventDefault();
        }
    });

    // Starts Fish Step 9 Page
    showFishStep9 = function ( result ) {
        var msg = _s('D063');

        if (model.duration >= 2) {
            msg = _s('D062');
        }

        removeSplashError();
        var content = {
            leftBtnString: "",
            leftBtnClass: "",
            rightBtnString: "",
            rightBtnClass: "",
            hideLogo: false,
            logoTitle: _s('CSITENAME'),
            showTitle: true,
            title: _s('D061'),
            hideSuperTitle: false,
            superTitle: _s('D007'),
            fullSiteURL: fullSiteURL,
            confirmationMsg: msg
        };
        var formElements = {
            submit: {
                name: "submit",
                value: _s('DNEXT'),
                inputClass: "expand alert",
                title: _s('DNEXT')
            }
        };
        currentPage = 'fstep9';
        console.log(currentFeature+" : "+currentPage);
        var map = new can.Map({ content: content, form: formElements, data:result });
        new FishStep9('#dg-overall-wrapper', map);
        resetScrollTop();
    };    

    // Fish Step 8 Page
    var FishStep8 = can.Control({
        init: function () {
            this.infocus = true;

            can.route(currentFeature+"/:page", { page: currentPage });

            // Directional
            var page = loadView(baseURL+'ejs/features/fish/fstep8.ejs', this.options);
            if(!page) {
                return;
            }
            pageSlider.slidePage(page, '#dg-fstep8-section', this.element, currentPage, forcedDirection);
            
            onInitComplete(this);
            
            this.inputs = [];

            addFormElement(this.inputs, 'cardNumber', 'number', 16, _s('E009'), "===", null, this.element);
            addFormElement(this.inputs, 'expMonth', 'month', 1, _s('E010'));
            addFormElement(this.inputs, 'expYear', 'year', 1, _s('E011'));
            addFormElement(this.inputs, 'cvv', 'number', 2, _s('E012'), null, null, this.element);
            addFormElement(this.inputs, 'fullName', 'letter', 2, _s('E013'), null, null, this.element);

            populateFormValues(this.element, this.inputs, formValues["page" + currentPage]);
            
            this.addCardDetection();

            var control = this;
            setTimeout(function () {

            }, TRANSITION_SPEED);
        },
        changeContent: function (msg) {
            var paymentForm = this.element.find('#dg-payment-form');
            paymentForm.hide();
            var contentArea = this.element.find('.dg-fstep8');
            var messageNode = can.$('<h4>' + msg + '</h4>');
            messageNode.appendTo(contentArea);
        },
        onGetTotal: function(result) {
            //var contentString = "<p>Please note that there is a " + getCardSurcharge(this.thisCard) + "% surcharge on '" + this.thisCard + "'.</p>";
            //createPopup("Surcharge Applicable", contentString, "OK");
            model.totalSurchargeIncAmountPayable = result.totalAmountPayable;
            model.feeInfo = result.fees;

            this.options.content.attr('surcharge', formatCurrency(parseFloat(result.totalAmountPayable) - model.totalAmountPayable));
            this.options.content.attr('total', formatCurrency(result.totalAmountPayable));
            this.options.content.attr('cost', formatCurrency(model.totalAmountPayable));

            if (this.autoConfirm) {
                // To cater for surcharge breaks
                var element = this.element.find('input[type=button]');
                this.confirm(element);
            }
        },
        onGetTotalFail: function (msg) {
            showSplashError(msg);

            if (this.autoConfirm) {
                this.infocus = true;
            }
        },
        addCardDetection: function () {
            var cardHolder = this.element.find('#dg-footer-card-icons');
            can.each(model.creditCards, function (card, index) {
                var cardSpan = can.$('<span class="' + String(card.creditCard).toLowerCase() + ' small"></span>');
                cardSpan.appendTo(cardHolder);
                can.$('<span> </span>').appendTo(cardHolder);
            });

            this.resetCards();

            var myControl = this;
            var cardInput = this.element.find("input[name='cardNumber']");
            cardInput.on('keyup', function (e) {
                myControl.resetCards();
                if (/^5[1-5]/.test($(this).val())) {
                    myControl.element.find(".mastercard").css("opacity", 1);
                    removeSplashError();

                    myControl.thisCard = "MasterCard";
                } else if (/^4/.test($(this).val())) {
                    myControl.element.find(".visa").css("opacity", 1);
                    removeSplashError();

                    myControl.thisCard = "Visa";
                } else if ($(this).val().length >= 4) {
                    removeSplashError();
                    showSplashError(_s('D060'));
                }
            });

            // Setting for population
            if (!isEmpty(cardInput.val())) {
                if (/^5[1-5]/.test(cardInput.val())) {
                    myControl.element.find(".mastercard").css("opacity", 1);

                    myControl.thisCard = "MasterCard";
                } else if (/^4/.test(cardInput.val())) {
                    myControl.element.find(".visa").css("opacity", 1);

                    myControl.thisCard = "Visa";
                } else if (cardInput.val().length >= 4) {
                    removeSplashError();
                    showSplashError(_s('D060'));
                }

                this.calculateTotalAmount();
            }
        },
        resetCards: function () {
            this.element.find(".mastercard").css("opacity", 0.2);
            this.element.find(".visa").css("opacity", 0.2);
        },
        calculateTotalAmount: function () {
            // TODO Can check if last card and last duration is the same, then just reuse the same details, instead of recalling the server

            callAjax({ url: constructAPIURL("api", "Fish/TotalAmountIncSurcharge"), dataType:"json", data: { creditCard: this.thisCard, durationVal: model.durationValue, duration: model.durationLabel } }, this.onGetTotal, this.onGetTotalFail, this);
            this.lastCard = this.thisCard;
            model.cardType = this.thisCard;
        },
        'input[name="cardNumber"] blur': function (element, event) {
            // Change the Surcharge Wording
            if (this.lastCard != this.thisCard) {
                this.calculateTotalAmount();
            }
        },
        validateInputs: function () {
            return invalidateForm(this.inputs, null, showSplashError);
        },
        onPaymentSuccess: function (result) {
            clearInterval(this.timer);
            //alert(JSON.stringify(result));

            if (this.popupControl) {
                this.popupControl.removePopup( true );
                this.popupControl = null;
            }

            var displayResult = {
                licenceNo: result.licenceNo,
                licenceType: model.licenceType,
                amount: formatCurrency(model.totalSurchargeIncAmountPayable),
                date: result.applicationDate,
                fullName: result.licencee,
                startDate: result.licenceStartDate,
                duration: model.durationLabel
            };

            can.extend(model, {result:result});

            showFishStep9(displayResult);
        },
        onPaymentFail: function(msg) {
            clearInterval(this.timer);

            if (this.popupControl) {
                this.popupControl.removePopup( true );
                this.popupControl = null;
            }

            var code = parseInt(msg.match(/\((.*)\)/)[1]);
            if (code == 10 || code == 408) {
                can.$('.dg-left-small').hide();
                // Shows support message for automatic payments, time out
                msg = _s('CE007') + "<br/><br/>" + _s('C015');
                this.changeContent(msg);
            } else if (code == 500 || code == 1) {
                can.$('.dg-left-small').hide();
                // Shows support message for definite issues with error 500
                msg = _s('CE004') + "<br/><br/>" + _s('C015');
                this.changeContent(msg);
            } else {
                // handle errors
                showSplashError(msg);
                clearWaitOnSubmit(this.submitButton, this.submitButtonClass, this.submitButtonValue);
                this.infocus = true;
            }
        },
        proceed: function (element) {
            if (!this.infocus) {
                var form = this.element.find('form');
                values = can.deparam(form.serialize());
                formValues["step" + currentStep] = values;

                this.submitButton = element;
                this.submitButtonClass = element.attr('class');
                this.submitButtonValue = element.val();

                this.infocus = false;

                this.timer = showWaitOnSubmit(element, null, -1);

                var dateOfBirth = getDateFromInput(model.dob);

                var primaryDetails = {
                    firstname: model.firstname,
                    lastname: model.lastname,
                    dateOfBirth: dateOfBirth
                };
                var contactDetails = {
                    email: model.email,
                    mobile: model.mobile
                };
                //var resAddress = model.ResidentialAddressFull;
                //delete resAddress.QASValidated;

                var postalAddress = { 
                    addressLine1: model.address.addressLine1,
                    addressLine2: model.address.addressLine2,
                    suburb: model.address.addressSuburb,
                    postcode: model.address.addressPostcode,
                    state: model.address.addressState
                };

                var isSameAsResidentialAddress = true;//model.isSameAsResidentialAddress;

                var licenceStateDate = getDateFromInput(model.licenceDate);

                var licenceDetails = {
                    licenceStartDate: licenceStateDate,
                    durationDescription: model.durationLabel,
                    durationValue: model.durationValue,
                    licenceFeeAmount: model.totalAmountPayable
                };
                var paymentDetails = {
                    creditCardNumber: values['cardNumber'],
                    creditCardExpiryMonth: values['expMonth'],
                    creditCardExpiryYear: values['expYear'],
                    creditCardCVV: values['cvv'],
                    creditCardName: values['fullName'],
                    creditCardType: model.cardType,
                    paymentAmount: parseFloat(model.totalSurchargeIncAmountPayable)
                };
                var submissionDataString = JSON.stringify({
                    requestID: model.requestID,
                    individualPrimaryDetails: primaryDetails,
                    individualContactDetails: contactDetails,
                    individualPhysicalAddressDetails: null,
                    isPostalSameAsPhysical: null,
                    individualPostalAddressDetails: postalAddress,
                    fishingLicenceDetails: licenceDetails,
                    paymentDetails: paymentDetails
                });

                // Dummy Test
                /*this.onPaymentSuccess({
                    licenceNo: "123123123",
                    licenceType: model.licenceType,
                    totalSurchargeIncAmountPayable: model.totalSurchargeIncAmountPayable,
                    applicationDate: '01/01/2014',
                    licencee: model.firstname,
                    licenceStartDate: '01/01/2014',
                    durationLabel: '1 Year'
                });
                return;*/

                // Process submission model
                callAjax({
                    url: constructAPIURL("api", "Fish/Submit"),
                    type: 'POST',
                    dataType:"json",
                    contentType: 'application/json',
                    data: submissionDataString
                }, this.onPaymentSuccess, this.onPaymentFail, this);
            }
        },
        proceedConfirmPopup: function(element) {
            this.popupControl.updateHeading(_s('D091'));
            this.popupControl.updateContent('<p class="panel"><span class="dg-square-spinner">&nbsp;</span></p>');
            this.popupControl.hideCloseButton();
            this.proceed(element);

            console.log("fish : step8 proceedConfirmPopup()");
        },
        cancelConfirmPopup: function(element) {  
            this.infocus = true;
            
            if(this.popupControl) {
                this.popupControl.removePopup( true );
                this.popupControl = null;
            }

            console.log("fish : step8 cancelConfirmPopup()");
        },
        createConfirmPopup: function (element) {
            var control = this;
            control.popupControl = createPopup(_s('D052'), "<strong>" + _s('D056') + ": " + formatCurrency(model.totalSurchargeIncAmountPayable) + "</strong><br />" + _s('D059') + " <strong>" + getCardSurcharge(this.thisCard) + "%</strong> " + _s('D058') + " '" + this.thisCard + "'.", _s('DOK'), _s("DCANCEL"), 
            function () {
                control.proceedConfirmPopup(element);
            }, function () {
                control.cancelConfirmPopup(element);
            }, null, false);
        },
        confirm: function (element) {
            if (this.popupDiv) {
                return;
            }
            var control = this;

            can.$(':focus').trigger('blur');

            setTimeout(function () {
                control.createConfirmPopup(element);
            }, TRANSITION_SPEED / 2);
        },
        '#dg-card-icon click': function (element, event) {
            createPopup(_s('D053'), _s('D054'), _s('DOK'));
            event.preventDefault();
            return false;
        },
        '#dg-cvv-icon click': function (element, event) {
            createPopup(_s('D053'), _s('D055'), _s('DOK'));
            event.preventDefault();
            return false;
        },
        '.dg-fish input[name=submit] click': function(element, event) {
            if (this.validateInputs() && this.infocus && !isEmpty(model.totalSurchargeIncAmountPayable)) {
                this.infocus = false;

                this.confirm(element);
            } else if (this.validateInputs() && this.infocus && isEmpty(model.totalSurchargeIncAmountPayable)) {
                // This is a safe robust mechanism to re get total value if first call failed due to wahtever reason
                this.infocus = false;

                // Smart recaculate
                this.calculateTotalAmount();
                this.autoConfirm = true;
            }
            event.preventDefault();
        },
        'a.dg-back-icon click': function (element, event) {
            if(this.infocus) {
                this.infocus = false;
                showFishStep7();
            }

            event.preventDefault();
        }
    });

    // Starts Fish Step 8 Page
    showFishStep8 = function () {
        removeSplashError();
        var content = {
            leftBtnString: _s('DBACK'),
            leftBtnClass: "backIcon",
            rightBtnString: "",
            rightBtnClass: "",
            hideLogo: false,
            logoTitle: _s('CSITENAME'),
            showTitle: true,
            title: _s('D047'),
            hideSuperTitle: false,
            superTitle: _s('D007'),
            fullSiteURL: fullSiteURL,
            surcharge: 'Applicable',
            cost: formatCurrency(model.totalAmountPayable),
            total: formatCurrency(model.totalAmountPayable)
        };
        var formElements = {
            cardNumber: {
                name: "cardNumber",
                label: _s('D064'),
                id: "dg-card-icon",
                infoIcon: 'fi-info fi-size-medium',
                inputType: (isAppleMobile()?'text':'number'),
                value: '',
                placeholder: "",
                inputClass: "",
                pattern: (isAppleMobile()?'[0-9]*':null)
            },
            fullName: {
                name: "fullName",
                label: _s('D049'),
                infoIcon: null,
                inputType: "text",
                value: '',
                placeholder: "",
                inputClass: "",
                pattern: null
            },
            cvv: {
                name: "cvv",
                label: _s('D050'),
                id: "dg-cvv-icon",
                infoIcon: 'fi-info fi-size-medium',
                inputType: "text",
                value: '',
                placeholder: "",
                inputClass: "",
                pattern: '[0-9]*'
            },
            submit: {
                name: "submit",
                value: _s('D042'),
                inputClass: "expand alert",
                title: _s('D042')
            }
        };
        currentPage = 'fstep8';
        console.log(currentFeature+" : "+currentPage);
        var map = new can.Map({ content: content, form: formElements, data:model });
        new FishStep8('#dg-overall-wrapper', map);
        resetScrollTop();
    };
    
    // Fish Step 7 Page
    var FishStep7 = can.Control({
        init: function () {
            this.infocus = true;

            can.route(currentFeature+"/:page", { page: currentPage });

            // Directional
            var page = loadView(baseURL+'ejs/features/fish/fstep7.ejs', this.options);
            if(!page) {
                return;
            }
            pageSlider.slidePage(page, '#dg-fstep7-section', this.element, currentPage, forcedDirection);

            var cost = model['totalAmountPayable'];
            this.options.attr('data').attr('totalAmountPayable', formatCurrency(cost));

            var date = getDateFromInput(model['dob']);
            this.options.attr('data').attr('dob', moment(date).format('L'));
            
            onInitComplete(this);
            
            var control = this;
            setTimeout(function () {

            }, TRANSITION_SPEED);
        },
        '.dg-fish input[name=submit] click': function(element, event) {
            if(this.infocus) {
                this.infocus = false;
                
                showWaitOnSubmit(element, function(){
                    showFishStep8();
                }, WAIT_ON_SUBMIT_SPEED);
            }
            
            event.preventDefault();
        },
        'a.dg-back-icon click': function (element, event) {
            if(this.infocus) {
                this.infocus = false;
                showFishStep6();
            }

            event.preventDefault();
        }
    });

    // Starts Fish Step 7 Page
    showFishStep7 = function () {
        removeSplashError();
        var content = {
            leftBtnString: _s('DBACK'),
            leftBtnClass: "backIcon",
            rightBtnString: "",
            rightBtnClass: "",
            hideLogo: false,
            logoTitle: _s('CSITENAME'),
            showTitle: true,
            title: _s('D043'),
            hideSuperTitle: false,
            superTitle: _s('D007'),
            fullSiteURL: fullSiteURL
        };
        var formElements = {
            submit: {
                name: "submit",
                value: _s('D042'),
                inputClass: "expand alert",
                title: _s('D042')
            }
        };
        currentPage = 'fstep7';
        console.log(currentFeature+" : "+currentPage);
        var map = new can.Map({ content: content, form: formElements, data:model });
        new FishStep7('#dg-overall-wrapper', map);
        resetScrollTop();
    };
    
    // Fish Step 6 Page
    var FishStep6 = can.Control({
        init: function () {
            this.infocus = true;

            can.route(currentFeature+"/:page", { page: currentPage });

            // Directional
            var page = loadView(baseURL+'ejs/features/fish/fstep6.ejs', this.options);
            if(!page) {
                return;
            }
            pageSlider.slidePage(page, '#dg-fstep6-section', this.element, currentPage, forcedDirection);

            onInitComplete(this);
            
            var terms = loadView(baseURL+'ejs/features/fish/fterms.ejs');
            this.element.find('#dg-terms').append(terms);

            this.inputs = [];

            addFormElement(this.inputs, 'legal', 'legal', 1, _s('E008'));

            populateFormValues(this.element, this.inputs, formValues["page" + currentPage]);
            
            var control = this;
            setTimeout(function () {
                initialiseICheck(control.element);    
            }, TRANSITION_SPEED);
        },
        validateInputs: function () {
            return invalidateForm(this.inputs, null, showSplashError);
        },
        'input[name=submit] click': function (element, event) {
            var form = this.element.find('form');
            var values = can.deparam(form.serialize());
            formValues["page" + currentPage] = values;

            if (this.validateInputs() && this.infocus) {
                this.infocus = false;

                this.submitButton = element;
                this.submitButtonClass = element.attr('class');
                this.submitButtonValue = element.val();
                
                can.extend(model, values);
                
                this.timer = showWaitOnSubmit(element, function(){
                    showFishStep7();
                }, WAIT_ON_SUBMIT_SPEED);
            }

            event.preventDefault();
            return false;
        },
        'a.dg-back-icon click': function (element, event) {
            if(this.infocus) {
                this.infocus = false;
                showFishStep5();
            }

            event.preventDefault();
        }
    });

    // Starts Fish Step 6 Page
    showFishStep6 = function () {
        removeSplashError();
        var content = {
            leftBtnString: _s('DBACK'),
            leftBtnClass: "backIcon",
            rightBtnString: "",
            rightBtnClass: "",
            hideLogo: false,
            logoTitle: _s('CSITENAME'),
            showTitle: true,
            title: _s('D040'),
            hideSuperTitle: false,
            superTitle: _s('D007'),
            fullSiteURL: fullSiteURL
        };
        var formElements = {
            legal: {
                name: "legal",
                id: "dg-legal",
                value: "agreed",
                inputClass: "",
                labelTop: null,
                label: _s('D041'),
                checked: ""
            },
            submit: {
                name: "submit",
                value: _s('DNEXT'),
                inputClass: "expand alert"
            }

        };
        currentPage = 'fstep6';
        console.log(currentFeature+" : "+currentPage);
        var map = new can.Map({ content: content, form: formElements });
        new FishStep6('#dg-overall-wrapper', map);
        resetScrollTop();
    };    
    
    // Fish Step 5 Page
    var FishStep5 = can.Control({
        init: function () {
            this.infocus = false;

            can.route(currentFeature+"/:page", { page: currentPage });

            // Directional
            var page = loadView(baseURL+'ejs/features/fish/fstep5.ejs', this.options);
            if(!page) {
                return;
            }
            pageSlider.slidePage(page, '#dg-fstep5-section', this.element, currentPage, forcedDirection);

            onInitComplete(this);

            this.inputs = [];
            
            addFormElement(this.inputs, 'licenceDate', 'date', 8, _s('D038'));
            addFormElement(this.inputs, 'licenceDate', 'dateCompare', 0, _s('D038'), '>=');
            addFormElement(this.inputs, 'duration', 'select', 1, _s('D039'));
            
            populateFormValues(this.element, this.inputs, formValues["page" + currentPage]);

            fixDateInput('licenceDate', this.element);
            
            if (!model.duration) {
                model.duration = "3 Days";
            }
            
            var control = this;
            setTimeout(function () {
                control.getCost(model.duration);
            }, TRANSITION_SPEED);
        },
        validateInputs: function () {
            return invalidateForm(this.inputs, null, showSplashError);
        },
        getCost: function( selected ) {
            this.infocus = false;
            var costTitle = this.element.find('#dg-cost-title');
            costTitle.html('');
            var costSubTitle = this.element.find('#dg-cost-subtitle');
            costSubTitle.html('');
            
            var spinnerNode = can.$('<span class="dg-square-spinner">&nbsp;</span>');
            spinnerNode.appendTo(costTitle);

            // Get Ajax Checking
            var priceNode;
            var durationData = this.options.form.attr('duration').attr('selections');
                        
            model.duration = selected;
            
            can.each(durationData, function( item, index) {
                var value = item.attr('value');
                if(value === selected || selected === index) {
                    model.totalAmountPayable = item.attr('data');
                    model.durationLabel = item.attr('label');
                    model.durationValue = item.attr('value');
                }
            });
            /*
            if (selected === 3) {
                model.totalAmountPayable = price;
                model.durationLabel = label;
            } else if (selected === 2) {
                model.totalAmountPayable = 35;
                model.durationLabel = "1 Year";
            } else if (selected === 1) {
                model.totalAmountPayable = 14;
                model.durationLabel = "1 Month";
            } else if (selected === 0) {
                model.totalAmountPayable = 7;
                model.durationLabel = "3 Days";
            }
            */
            var price = model.totalAmountPayable;
            priceNode = can.$('<span>' + formatCurrency(price) + '</span>');
            //priceNode.autoNumeric('init', { aSign: '$', pSign: 'p' });
            priceNode.hide();
            priceNode.appendTo(costTitle);
            var control = this;
            setTimeout(function () {
                fadeOut(spinnerNode, function () {
                    if (spinnerNode && can.isFunction(spinnerNode.remove)) {
                        spinnerNode.remove();
                    }
                    if (priceNode && can.isFunction(priceNode.show)) {
                        priceNode.show();
                        fadeIn(priceNode);
                    }

                    control.infocus = true;
                });
            }, 300);
        },
        "select[name='duration'] change": function (element, event) {
            var selected = element.val();
            this.getCost( selected );
        },
        'input[name=submit] click': function (element, event) {
            var form = this.element.find('form');
            var values = can.deparam(form.serialize());
            formValues["page" + currentPage] = values;

            if (this.validateInputs() && this.infocus) {
                this.infocus = false;

                this.submitButton = element;
                this.submitButtonClass = element.attr('class');
                this.submitButtonValue = element.val();

                can.extend(model, values);

                this.timer = showWaitOnSubmit(element, function(){
                    showFishStep6();
                }, WAIT_ON_SUBMIT_SPEED);
            }

            event.preventDefault();
            return false;
        },
        'a.dg-back-icon click': function (element, event) {
            if(this.infocus) {
                this.infocus = false;
                showFishStep4();
            }

            event.preventDefault();
        }
    });

    // Starts Fish Step 5 Page
    showFishStep5 = function () {
        removeSplashError();
        var content = {
            leftBtnString: _s('DBACK'),
            leftBtnClass: "backIcon",
            rightBtnString: "",
            rightBtnClass: "",
            hideLogo: false,
            logoTitle: _s('CSITENAME'),
            showTitle: true,
            title: _s('D023'),
            hideSuperTitle: false,
            superTitle: _s('D007'),
            fullSiteURL: fullSiteURL,
            cost: '...'
        };
        var today = moment.utc().toDate();
        var formElements = {
            licenceDate: {
                name: "licenceDate",
                label: _s('D032'),
                placeholder: _s('D033'),
                inputClass: "",
                inputType: "date",
                value: model["licenceDate"] || (today.getFullYear() + "-" + today.getMonthFormatted() + "-" + today.getDateFormatted())
            },
            duration: {
                name: "duration",
                label: _s('D028'),
                infoIcon: null,
                inputClass: "",
                selections: {
                    0: { value:"3 Days", label:"3 Days", data:7 },
                    1: { value:"1 Month", label:"1 Month", data:14 },
                    2: { value:"1 Year", label:"1 Year", data:35 },
                    3: { value:"3 Years", label:"3 Years", data:85 }
                },
                selected: "3 Days"
            },
            submit: {
                name: "submit",
                value: _s('DNEXT'),
                inputClass: "expand alert"
            }

        };
        currentPage = 'fstep5';
        console.log(currentFeature+" : "+currentPage);
        var map = new can.Map({ content: content, form: formElements });
        new FishStep5('#dg-overall-wrapper', map);
        resetScrollTop();
    };    

    // Fish Step 4 Page
    var FishStep4 = can.Control({
        init: function () {
            this.infocus = true;

            can.route(currentFeature+"/:page", { page: currentPage });

            // Directional
            var page = loadView(baseURL+'ejs/features/fish/fstep4.ejs', this.options);
            if(!page) {
                return;
            }
            pageSlider.slidePage(page, '#dg-fstep4-section', this.element, currentPage, forcedDirection);

            onInitComplete(this);

            this.inputs = [];
            
            this.autoAddressControl = _c('AutoAddressX').create('#dg-auto-address', { form: this.options.form, control: this });

            populateFormValues(this.element, this.inputs, formValues["page" + currentPage]);

            var control = this;
            setTimeout(function () {            
            }, TRANSITION_SPEED);
        },
        '#dg-address-search-icon click': function(element, event) {
            // Click events can not be doubled controlled
            this.autoAddressControl.setManualMode(false, true);

            event.preventDefault();
        },
        'input[name=reset] click': function(element, event) {
            // Click events can not be doubled controlled
            this.autoAddressControl.setManualMode(false, true);

            event.preventDefault();
        },
        validateInputs: function () {
            return invalidateForm(this.inputs, null, showSplashError);
        },
        validateAddress: function() {            
            // Check for all the custom address fields here
            var values = formValues["page" + currentPage];
            if(!can.isEmptyObject(values) && !isEmpty(values['addressLine1'])
                && !isEmpty(values['addressSuburb']) && !isEmpty(values['addressState'])
                && !isEmpty(values['addressPostcode'])) {
                return true;
            }

            return false;
        },
        'input[name=submit] click': function (element, event) {
            var form = this.element.find('form');
            var values = can.deparam(form.serialize());
            formValues["page" + currentPage] = values;

            if (this.validateInputs() && this.infocus && this.validateAddress() && this.autoAddressControl.manualMode) {
                this.infocus = false;

                this.submitButton = element;
                this.submitButtonClass = element.attr('class');
                this.submitButtonValue = element.val();
                
                can.extend(model, { address: values });

                this.timer = showWaitOnSubmit(element, function() {
                    showFishStep5();
                }, WAIT_ON_SUBMIT_SPEED);
            }

            event.preventDefault();
            return false;
        },
        'a.dg-back-icon click': function (element, event) {
            if(this.infocus) {
                this.infocus = false;
                showFishStep3();
            }

            event.preventDefault();
        }
    });

    // Starts Fish Step 4 Page
    showFishStep4 = function () {
        removeSplashError();
        var content = {
            leftBtnString: _s('DBACK'),
            leftBtnClass: "backIcon",
            rightBtnString: "",
            rightBtnClass: "",
            hideLogo: false,
            logoTitle: _s('CSITENAME'),
            showTitle: true,
            title: _s('D024'),
            hideSuperTitle: false,
            superTitle: _s('D007'),
            fullSiteURL: fullSiteURL
        };

        // This is standard naming for autoAddress Control and can not be changed
        var formElements = {
            fullAddress: {
                name: "fullAddress",
                label: _s('D016'),
                infoIcon: null,
                inputType: "text",
                value: model["fullAddress"],
                placeholder: "",
                inputClass: "",
                pattern: null
            },
            addressLine1: {
                name: "addressLine1",
                label: 'Address Line 1',
                id: "dg-address-search-icon",
                //infoIcon: "fi-magnifying-glass fi-size-medium",
                infoIconText: _s('DRESET'),
                infoIcon: "",
                inputType: "text",
                value: model["addressLine1"],
                placeholder: "",
                inputClass: "",
                pattern: null
            },
            addressLine2: {
                name: "addressLine2",
                label: 'Address Line 2',
                infoIcon: null,
                inputType: "text",
                value: model["addressLine2"],
                placeholder: "",
                inputClass: "",
                pattern: null
            },
            addressSuburb: {
                name: "addressSuburb",
                label: 'Suburb',
                infoIcon: null,
                inputType: "text",
                value: model["addressSuburb"],
                placeholder: "",
                inputClass: "",
                pattern: null
            },
            addressPostcode: {
                name: "addressPostcode",
                label: 'Postcode',
                infoIcon: null,
                inputType: "text",
                value: model["addressPostcode"],
                placeholder: "",
                inputClass: "",
                pattern: null
            },
            addressState: {
                name: "addressState",
                label: 'State',
                infoIcon: null,
                inputClass: "",
                selections: getAusStates(),
                selected: "NSW"
            },
            submit: {
                name: "submit",
                value: _s('DNEXT'),
                inputClass: "expand alert"
            },
            reset: {
                name: "reset",
                value: "Reset My Search",
                inputClass: "expand secondary"
            }
        };
        currentPage = 'fstep4';
        console.log(currentFeature+" : "+currentPage);
        var map = new can.Map({ content: content, form: formElements });
        new FishStep4('#dg-overall-wrapper', map);
        resetScrollTop();
    };  

    // Fish Step 3 Page
    var FishStep3 = can.Control({
        init: function () {
            this.infocus = true;

            can.route(currentFeature+"/:page", { page: currentPage });

            // Directional
            var page = loadView(baseURL+'ejs/features/fish/fstep3.ejs', this.options);
            if(!page) {
                return;
            }
            pageSlider.slidePage(page, '#dg-fstep3-section', this.element, currentPage, forcedDirection);

            onInitComplete(this);

            this.inputs = [];

            addFormElement(this.inputs, 'mobile', 'mobile', 1, _s('E006'), "==", null, this.element);
            addFormElement(this.inputs, 'email', 'email', 1, _s('E005'), null , null, this.element);

            populateFormValues(this.element, this.inputs, formValues["page" + currentPage]);

            formatMobileInput('mobile', this.element);
            
            var control = this;
            setTimeout(function () {

            }, TRANSITION_SPEED * 2);
        },
        validateInputs: function () {
            return invalidateForm(this.inputs, null, showSplashError);
        },
        'input[name=submit] click': function (element, event) {
            var form = this.element.find('form');
            var values = can.deparam(form.serialize());
            formValues["page" + currentPage] = values;

            if (this.validateInputs() && this.infocus) {
                this.infocus = false;

                this.submitButton = element;
                this.submitButtonClass = element.attr('class');
                this.submitButtonValue = element.val();
                
                can.extend(model, values);
                
                this.timer = showWaitOnSubmit(element, function(){
                    showFishStep4();
                }, WAIT_ON_SUBMIT_SPEED);
            }

            event.preventDefault();
            return false;
        },
        'a.dg-back-icon click': function (element, event) {
            if(this.infocus) {
                this.infocus = false;
                showFishStep2();
            }

            event.preventDefault();
        }
    });

    // Starts Fish Step 2 Page
    showFishStep3 = function () {
        removeSplashError();
        var content = {
            leftBtnString: _s('DBACK'),
            leftBtnClass: "backIcon",
            rightBtnString: "",
            rightBtnClass: "",
            hideLogo: false,
            logoTitle: _s('CSITENAME'),
            showTitle: true,
            title: _s('D023'),
            hideSuperTitle: false,
            superTitle: _s('D007'),
            fullSiteURL: fullSiteURL
        };
        var formElements = {
            mobile: {
                name: "mobile",
                label: _s('DMOBILE'),
                infoIcon: null,
                inputType: "text",
                value: model["mobile"] || userData['mobile'],
                placeholder: "",
                inputClass: "",
                pattern: null
            },
            email: {
                label: _s('DEMAIL'),
                name: "email",
                infoIcon: null,
                inputType: "email",
                value: model["email"] || userData['email'],
                placeholder: "",
                inputClass: "",
                pattern: null
            },
            submit: {
                name: "submit",
                value: _s('DNEXT'),
                inputClass: "expand alert"
            }

        };
        currentPage = 'fstep3';
        console.log(currentFeature+" : "+currentPage);
        var map = new can.Map({ content: content, form: formElements });
        new FishStep3('#dg-overall-wrapper', map);
        resetScrollTop();
    };    

    // Fish Step 2 Page
    var FishStep2 = can.Control({
        init: function () {
            this.infocus = true;

            can.route(currentFeature+"/:page", { page: currentPage });

            // Directional
            var page = loadView(baseURL+'ejs/features/fish/fstep2.ejs', this.options);
            if(!page) {
                return;
            }
            pageSlider.slidePage(page, '#dg-fstep2-section', this.element, currentPage, forcedDirection);

            onInitComplete(this);

            this.inputs = [];

            addFormElement(this.inputs, 'firstname', 'letter', 1, _s('E001'), ">=", null, this.element);
            addFormElement(this.inputs, 'lastname', 'letter', 1, _s('E002'), ">=", null, this.element);
            addFormElement(this.inputs, 'dob', 'date', 8, _s('E003'));
            addFormElement(this.inputs, 'dob', 'dateCompare', -365*18, _s('E004'), '<=');

            populateFormValues(this.element, this.inputs, formValues["page" + currentPage]);

            fixDateInput('dob', this.element);
            
            var control = this;
            setTimeout(function () {
                if(isLoggedIn()) {
                    control.element.find('.dg-guest-block').hide();
                }
            }, TRANSITION_SPEED * 2);
        },
        validateInputs: function () {
            return invalidateForm(this.inputs, null, showSplashError);
        },
        'input[name=submit] click': function (element, event) {
            var form = this.element.find('form');
            var values = can.deparam(form.serialize());
            formValues["page" + currentPage] = values;

            if (this.validateInputs() && this.infocus) {
                this.infocus = false;

                this.submitButton = element;
                this.submitButtonClass = element.attr('class');
                this.submitButtonValue = element.val();

                can.extend(model, values);

                this.timer = showWaitOnSubmit(element, function() {
                    showFishStep3();
                }, WAIT_ON_SUBMIT_SPEED);
            }

            event.preventDefault();
            return false;
        },
        '.dg-sign-button click': function (element, event) {
            if(this.infocus) {
                showWaitOnSubmit(element, function(){
                    // Force Direction
                    loadFeature(FEATURE_SETUP, { 
                        defaultPage: 'login', 
                        lastFeature: currentFeature, 
                        lastFeaturePage: 'fstep2',
                        nextFeature: currentFeature,
                        nextFeaturePage: 'fstep3'
                    });
                }, WAIT_ON_SUBMIT_SPEED);
            }

            event.preventDefault();
        },
        'a.dg-back-icon click': function (element, event) {
            if(this.infocus) {
                this.infocus = false;
                showFishStep1();
            }

            event.preventDefault();
        }
    });

    // Starts Fish Step 2 Page
    showFishStep2 = function () {
        removeSplashError();
        var content = {
            leftBtnString: (isLoggedIn()) ? '' : _s('DBACK'),
            leftBtnClass: (isLoggedIn()) ? '' : "backIcon",
            rightBtnString: "",
            rightBtnClass: "",
            hideLogo: false,
            logoTitle: _s('CSITENAME'),
            showTitle: true,
            title: _s('D017'),
            hideSuperTitle: false,
            superTitle: _s('D007'),
            fullSiteURL: fullSiteURL
        };
        var formElements = {
            firstname: {
                name: "firstname",
                label: "First Name",
                infoIcon: null,
                inputType: "text",
                value: model["firstname"] || userData['firstname'],
                placeholder: "",
                inputClass: "",
                pattern: null
            },
            lastname: {
                label: _s('D021'),
                name: "lastname",
                infoIcon: null,
                inputType: "text",
                value: model["lastname"] || userData['lastname'],
                placeholder: "",
                inputClass: "",
                pattern: null
            },
            dob: {
                name: "dob",
                label: _s('D022'),
                placeholder: _s('D033'),
                inputClass: "",
                inputType: "date",
                value: model["dob"] || userData['dob']
            },
            submit: {
                name: "submit",
                value: _s('DNEXT'),
                inputClass: "expand alert"
            },
            signin: {
                name: "signin",
                value: 'SIGN IN',
                inputClass: "expand",
                title: 'Existing One Gov Member Sign In'
            }
        };
        currentPage = 'fstep2';
        console.log(currentFeature+" : "+currentPage);
        var map = new can.Map({ content: content, form: formElements });
        new FishStep2('#dg-overall-wrapper', map);
        resetScrollTop();
    };

    // Fish Step 1B Page
    var FishStep1B = can.Control({
        init: function () {
            this.infocus = true;

            can.route(currentFeature+"/:page", { page: currentPage });

            // Directional
            var page = loadView(baseURL+'ejs/features/fish/fstep1b.ejs', this.options);
            if(!page) {
                return;
            }
            pageSlider.slidePage(page, '#dg-fstep1b-section', this.element, currentPage, forcedDirection);

            onInitComplete(this);
            
            var control = this;
            setTimeout(function () {
                control.proceed();
            }, TRANSITION_SPEED * 10);
        },
        proceed: function() {
            console.log('fish : step1b lets think about which step to jump to!');
            // Set some model information from userData and jump ...

            // IMPORTANT STEP HERE TO PULL DATA INTO FEATURE MODEL FOR MANIPULATION
            model["firstname"] = getUserDataByKey('firstname');
            model["lastname"] = getUserDataByKey('lastname');
            model["mobile"] = getUserDataByKey('mobile');
            model["email"] = getUserDataByKey('email');
            model["dob"] = getUserDataByKey('dob');
            model["address"] = getUserDataByKey('address');

            // Jump to 2 for now
            showFishStep2();
        }
    });

    // Starts Fish Step 1B Page
    showFishStep1B = function () {
        removeSplashError();
        var content = {
            leftBtnString: "",
            leftBtnClass: "",
            rightBtnString: "",
            rightBtnClass: "",
            hideLogo: false,
            logoTitle: _s('CSITENAME'),
            showTitle: true,
            title: 'Hello, '+getUserDataByKey('firstname'),
            hideSuperTitle: false,
            superTitle: _s('D007'),
            fullSiteURL: fullSiteURL
        };
        var formElements = {

        };
        currentPage = 'fstep1b';
        console.log(currentFeature+" : "+currentPage);
        var map = new can.Map({ content: content, form: formElements });
        new FishStep1B('#dg-overall-wrapper', map);
        resetScrollTop();
    };

    // Fish Step 1A Page
    var FishStep1A = can.Control({
        init: function () {
            this.infocus = true;

            can.route(currentFeature+"/:page", { page: currentPage });

            // Directional
            var page = loadView(baseURL+'ejs/features/fish/fstep1a.ejs', this.options);
            if(!page) {
                return;
            }
            pageSlider.slidePage(page, '#dg-fstep1a-section', this.element, currentPage, forcedDirection);

            onInitComplete(this);
            
            var control = this;
            setTimeout(function () {

            }, TRANSITION_SPEED);
        },
        '.dg-fish input[name=signin] click': function(element, event) {
            if(this.infocus) {
                showWaitOnSubmit(element, function(){
                    // Force Direction
                    loadFeature(FEATURE_SETUP, { 
                        defaultPage: 'login', 
                        lastFeature: currentFeature, 
                        lastFeaturePage: 'fstep1a',
                        nextFeature: currentFeature,
                        nextFeaturePage: 'fstep1b'
                    });
                }, WAIT_ON_SUBMIT_SPEED);
            }

            event.preventDefault();
        },
        '.dg-fish input[name=submit] click': function(element, event) {
            if(this.infocus) {
                this.infocus = false;
                //element.removeClass('alert');
                // Force Direction
                showWaitOnSubmit(element, function(){
                    showFishStep2();
                }, WAIT_ON_SUBMIT_SPEED);
            }

            //element.trigger('blur');

            event.preventDefault();
        },
        'a.dg-back-icon click': function (element, event) {
            if(this.infocus) {
                this.infocus = false;
                showFishStep1();
            }

            event.preventDefault();
        }
    });

    // Starts Fish Step 1A Page
    showFishStep1A = function () {
        removeSplashError();
        var content = {
            leftBtnString: _s('DBACK'),
            leftBtnClass: "backIcon",
            rightBtnString: "",
            rightBtnClass: "",
            hideLogo: false,
            logoTitle: _s('CSITENAME'),
            showTitle: true,
            title: 'ONE GOV SIGN IN',
            hideSuperTitle: false,
            superTitle: _s('D007'),
            fullSiteURL: fullSiteURL
        };
        var formElements = {
            signin: {
                name: "signin",
                value: 'ONE GOV SIGN IN',
                inputClass: "expand",
                title: 'Existing One Gov Member Sign In'
            },
            submit: {
                name: "submit",
                value: 'I\'M NOT SURE',
                inputClass: "expand alert",
                title: "I'm not sure."
            }
        };
        currentPage = 'fstep1a';
        console.log(currentFeature+" : "+currentPage);
        var map = new can.Map({ content: content, form: formElements });
        new FishStep1A('#dg-overall-wrapper', map);
        resetScrollTop();
    };

    // Fish Step 1 Page
    var FishStep1 = can.Control({
        init: function () {
            this.infocus = false;

            can.route(currentFeature+"/:page", { page: currentPage });

            // Directional
            var page = loadView(baseURL+'ejs/features/fish/fstep1.ejs', this.options);
            if(!page) {
                return;
            }
            pageSlider.slidePage(page, '#dg-fstep1-section', this.element, currentPage, forcedDirection);

            onInitComplete(this, true);

            this.getCreditCards();

            var control = this;
            setTimeout(function () {
            }, TRANSITION_SPEED);
        },
        validateInputs: function (values) {
            return invalidateForm(this.inputs, null, showSplashError);
        },
        getCreditCards: function () {
            this.infocus = false;
            var supportedSpan = this.element.find('#dg-supported-cards');
            supportedSpan.html('');
            var spinnerNode = $('<span class="dg-square-spinner">&nbsp;</span>');
            spinnerNode.appendTo(supportedSpan);

            // Data xls is just to by pass the call Ajax validation that data can not be empty
            // TODO Down
            //callAjax({ url: constructAPIURL("api", "Fish/CreditCards"), dataType: 'json', data: { xlr: 0 } }, this.onGetCreditCards, this.onGetCreditCardsFail, this);
            
            this.onGetCreditCards({
                mastercard: {creditCard:"Mastercard"},
                visa: {creditCard:"Visa"}
            });
            
        },
        onGetCreditCards: function(result) {

            clearInterval(this.timer);
            model['creditCards'] = result;

            var str = "";
            can.each(result, function (card, index) {
                str += can.trim(card.creditCard) + ", ";
            });

            str = str.slice(0, str.length - 2);
            //this.options.content.attr('SupportedCards', str);

            var supportedSpan = this.element.find('#dg-supported-cards');
            //var card_node = $('<span>' + str + '<br /> &nbsp; </span>');
            var cardHolder = $('<span></span>');

            // Added Credit Card Pictures
            var control = this;
            control.supportedCards = [];
            can.each(model.creditCards, function (card, index) {
                // Only show master and visa for now
                var cardName = String(card.creditCard).toLowerCase();
                control.supportedCards.push(cardName);
                if (cardName === 'mastercard' || cardName === 'visa' || cardName === 'amex' || cardName === 'diners') {
                    var cardSpan = can.$('<span class="' + cardName + '"></span>');
                    cardSpan.appendTo(cardHolder);
                    can.$('<span> </span>').appendTo(cardHolder);
                }
            });
            //var card_node = $('<span>' + str + '<br />' + _s('D011') +'</span>');
            var spinnerNode = supportedSpan.find('.dg-square-spinner');

            cardHolder.hide();
            cardHolder.appendTo(supportedSpan);

            var control = this;
            setTimeout(function () {
                control.hideSpinner( spinnerNode, cardHolder );
            }, 300);
        },
        hideSpinner: function( spinnerNode, cardHolder ) {
            var control = this;
            fadeOut(spinnerNode, function () {
                if (spinnerNode && can.isFunction(spinnerNode.remove)) {
                    spinnerNode.remove();
                }
                if (cardHolder && can.isFunction(cardHolder.show)) {
                    cardHolder.show();
                    fadeIn(cardHolder);

                    control.infocus = true;
                }
            });    
        },
        onGetCreditCardsFail: function (msg) {
            // handle errors
            showSplashError(msg);
            this.infocus = true;
            var supportedSpan = this.element.find('#dg-supported-cards');
            var spinnerNode = supportedSpan.find('.dg-square-spinner');
            if(spinnerNode) {
                this.hideSpinner( spinnerNode ); 
            }
            clearInterval(this.timer);
        },
        '.dg-fish input[name=submit] click': function (element, event) {
            if(this.infocus) {
                this.infocus = false;
                //element.removeClass('alert');
                // Force Direction
                showWaitOnSubmit(element, function(){
                    if(isLoggedIn()) {
                        // If Logged in goto 1b to do data pooling
                        showFishStep1B();
                    } else {
                        showFishStep2();
                    }
                }, WAIT_ON_SUBMIT_SPEED);
            }

            event.preventDefault();
        },
        'a.dg-back-icon click': function (element, event) {
            if(this.infocus) {
                this.infocus = false;

                if(!isEmpty(lastFeature) && !isEmpty(lastFeaturePage)) {
                    // Force Direction
                    loadFeature(lastFeature, { forcedDirection: 'left' , defaultPage:lastFeaturePage, model:model });
                } else {
                    // Force Direction
                    loadFeature(FEATURE_HOME, { forcedDirection: 'left' });
                }
            }
            event.preventDefault();
        }
    });

    // Starts Fish Step 1 Page
    showFishStep1 = function () {
        removeSplashError();
        var content = {
            leftBtnString: _s('DBACK'),
            leftBtnClass: "backIcon",
            rightBtnString: "",
            rightBtnClass: "",
            hideLogo: false,
            logoTitle: _s('CSITENAME'),
            showTitle: true,
            title: 'INFORMATION',
            hideSuperTitle: false,
            superTitle: _s('D007'),
            fullSiteURL: fullSiteURL
        };
        var formElements = {
            submit: {
                name: "submit",
                value: 'NEXT',
                inputClass: "expand alert",
                title: 'NEXT'
            }
        };
        currentPage = 'fstep1';
        console.log(currentFeature+" : "+currentPage);
        var map = new can.Map({ content: content, form: formElements });
        new FishStep1('#dg-overall-wrapper', map);
        resetScrollTop();
    };

    // Initialization ========================================================================

    // Get Transaction ID
    var onRequestSuccess = function ( data ) {
        model.requestID = data;
        setTransactionID(data, "Fishing Application");
    };

    var onRequestFail = function (data) {
        // RequestID Missing
    };

    callAjax({ url: constructAPIURL("api", "Fish/GetTransactionID"), dataType:"json", data: { xlr: 0 } }, onRequestSuccess, onRequestFail, {});

    // Creates a slider
    var pageOrder = ['fstep1', 'fstep1a', 'fstep1b', 'fstep2', 'fstep3', 'fstep4', 'fstep5', 'fstep6', 'fstep7', 'fstep8'];
    pageSlider = getPageSlider( pageOrder );
    
    // Setup route format
    can.route(currentFeature+"/:page", { page: "fstep1" });
    can.route.ready();
    
    // Checks Init Data
    if(!can.isEmptyObject(data)) {
        console.log(currentFeature+' : init data default=' + data.defaultPage);
        if(data.defaultPage === 'fstep1a') {
            showFishStep1A();
            return;
        } else if(data.defaultPage === 'fstep1b') {
            // Signed In and need to think about what to do
            showFishStep1B();
            return;
        } else if(data.defaultPage === 'fstep2') {
            showFishStep2();
            return;
        } else if(data.defaultPage === 'fstep3') {
            showFishStep3();
            return;
        } else if(data.defaultPage === 'fstep4') {
            showFishStep4();
            return;
        } else if(data.defaultPage === 'fstep5') {
            showFishStep5();
            return;
        } else if(data.defaultPage === 'fstep6') {
            showFishStep6();
            return;
        } else if(data.defaultPage === 'fstep7') {
            showFishStep7();
            return;
        } else if(data.defaultPage === 'fstep8') {
            showFishStep8();
            return;
        }
    }
    
    showFishStep1();
};

// Require define module
define(function(){
    return init;
});