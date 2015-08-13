/* 
 * MobileJS
 * MIT Licence
 * You can use this according to the MIT Licence.
 * 
 * Filename: auto_address_x.js
 * Version: 1.0
 * 
 * Description:
 * 
 * This is the full advanced version of auto address.
 * Public Interfaces
 * setManualMode ( true/false )
 * setFullAddress ( addressObject ) { addressLine1, addressLin2, suburb, postcode, state }
 *
 */

// This component system is DG Web specific, it is not the same as the canJS component

_global['_components']['AutoAddressX'] = {
    id: 'AutoAddressX',
    instantiate: function () {
        this.Control = can.Control({
            init: function () {
                this.element.html(can.view('autoAddressEJS', this.options));
                this.uniqueID = "NA";
                this.hasChanged = false;

                this.parentControl = this.options.control;

                if(!this.parentControl.inputs) {
                    alert("ERROR: `inputs` array from parent control must be defined in AutoAddressX's options.");
                }

                if(can.isEmptyObject(this.options.form.attr('fullAddress')) || can.isEmptyObject(this.options.form.attr('addressLine1'))
                    || can.isEmptyObject(this.options.form.attr('addressLine2')) || can.isEmptyObject(this.options.form.attr('addressSuburb'))
                        || can.isEmptyObject(this.options.form.attr('addressPostcode'))) {
                    alert("ERROR: `form` elements for auto address is not defined properly.");
                }

                this.setManualMode( this.parentControl.validateAddress() );
            },
            setFullAddress: function( address ) {
                this.element.find('input[name=addressLine1]').val(address['addressLine1']);
                this.element.find('input[name=addressLine2]').val(address['addressLine2']);
                this.element.find('input[name=addressSuburb]').val(address['suburb']);
                this.element.find('input[name=addressPostcode]').val(address['postcode']);
                this.element.find('select[name=addressState]').val(address['state']);

                console.log("auto_address_x : set full address " + JSON.stringify(address));
            },
            setManualMode: function( mode, reset ) {
                this.manualMode = mode;

                removeFormElement(this.parentControl.inputs, 'fullAddress');
                removeFormElement(this.parentControl.inputs, 'addressLine1');
                //removeFormElement(this.parentControl.inputs, 'addressLine2');
                removeFormElement(this.parentControl.inputs, 'addressSuburb');
                removeFormElement(this.parentControl.inputs, 'addressPostcode');
               
                this.inputBox = this.element.find('input[name=fullAddress]');
                
                if(mode) {
                    this.element.find('#dg-auto-block').hide();
                    this.element.find('#dg-manual-block').show();
                    fadeIn(this.element.find('#dg-manual-block'));

                    addFormElement(this.parentControl.inputs, 'addressLine1', 'text', 7, _s('CE009'), null, null, this.element);
                    addInputBehaviors('addressLine2', 'text', this.element);
                    addFormElement(this.parentControl.inputs, 'addressSuburb', 'text', 1, _s('CE001'), null, null, this.element);
                    addFormElement(this.parentControl.inputs, 'addressPostcode', 'number', 4, _s('CE002'), '===', null, this.element);
                    
                    this.off(this.inputBox, 'keydown', 'onInputKeyDown');
                    this.off(this.inputBox, 'keyup', 'onInputKeyUp');
                } else {
                    this.element.find('#dg-auto-block').show();
                    this.element.find('#dg-auto-block .dg-qas-dropdown').hide();
                    this.element.find('#dg-manual-block').hide();

                    addFormElement(this.parentControl.inputs, 'fullAddress', 'text', 7, _s('CE009'), null, null, this.element);

                    this.on(this.inputBox, 'keydown', 'onInputKeyDown');
                    this.on(this.inputBox, 'keyup', 'onInputKeyUp');

                    if(reset) {
                        this.inputBox.val('');
                    }
                }
            },
            showSpinner: function() {
                console.log("auto_address_x : showSpinner");
                var dropdownDiv = this.element.find('.dg-qas-dropdown');
                dropdownDiv.html('<span class="dg-square-spinner"></span>');

                dropdownDiv.show();
                fadeIn(dropdownDiv);
            },
            onInputKeyDown: function (element, event) {
                if (element.prop('name') === 'fullAddress') {
                    // event.preventDefault();
                    // Do nothing
                }
            },
            onInputKeyUp: function (element, event) {
                // Only if the length is larger than 5
                if (element.prop('name') === 'fullAddress' && element.val().length >= MIN_QAS_LENGTH) {
                    clearTimeout(this.timer);
                    var control = this;
                    this.timer = setTimeout(function () {
                        control.showSpinner();
                        control.queryQAS(element, event);
                    }, TYPING_THRESHOLD);
                }
            },
            getUniqueId: function() {
                // Returns unique id for auto mode
                return this.uniqueID;
            },
            getFullAddress: function (qid) {
                if(isEmpty(qid)) {
                    return;
                }
                this.showSpinner();

                var control = this;
                var onGetAddress = function (result) {
                    //alert(JSON.stringify(result));
                    if (isEmpty(result.postcode) && !isEmpty(result.postCode)) {
                        // Swaps the post code key due to casing
                        result.postcode = result.postCode;
                        delete result.postCode;
                    }

                    control.setFullAddress(result);
                    control.setManualMode( true );
                    control.hasChanged = true;
                };

                var onGetAddressFail = function (msg) {
                    showSplashError(msg);
                };

                callAjax({ url: constructAPIURL("api", "Address/GetFormattedAddress"), dataType:'json', data: { uniqueId: qid } }, onGetAddress, onGetAddressFail, this);
            },
            queryQAS: function (inputBox, event) {
                if (inputBox.prop('name') === 'fullAddress') {
                    //this.spinner.fadeIn();
                    var dropdownDiv = this.element.find('.dg-qas-dropdown');

                    var control = this;

                    var onGetAddress = function (result) {
                        var addressList = new can.List(result);
                        addressList.push({ displayText: _s('C006'), uniqueID: 'NA' });

                        if (addressList.attr('length') >= 0 && !this.manualMode) {
                            setTimeout(function(){
                                dropdownDiv.html(can.view('autoAddressDropDownEJS', { addressList: addressList }));

                                var qaslistDiv = control.element.find('#dg-qas-list');
                                fadeIn(qaslistDiv);

                                //control.element.find('.dropdown').fadeIn();
                                qaslistDiv.find("a").click(function (e) {
                                    if (can.$(e.target).html() === _s('C006')) {
                                        control.setManualMode(true);
                                        control.hasChanged = true;
                                    } else {
                                        inputBox.val(can.$(e.target).html());
                                        control.uniqueID = can.$(e.target).attr('name');

                                        control.getFullAddress(control.uniqueID);
                                    }
                                    dropdownDiv.html('').hide();
                                });
                            }, TRANSITION_SPEED);
                        }
                    };

                    var onGetAddressFail = function (msg) {
                        // Does nothing if address fails
                        dropdownDiv.html('<p>'+msg+'</p>')
                    };

                    var url = callAjax({
                        url: constructAPIURL("api", "Address/GetAddressSearch"),
                        dataType: "json",
                        data: {
                            searchstring: can.trim(inputBox.val())
                        }
                    }, onGetAddress, onGetAddressFail, this);
                }
            }
        });
    },
    create: function (id, options) {
        if (!options) {
            alert("AutoAddressX Need Options");
            return;
        }

        options.qasResult = [];

        var map = new can.Map(options);
        return new this.Control(id, map);
    }
};
