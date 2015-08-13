/* 
 * MobileJS
 * MIT Licence
 * You can use this according to the MIT Licence.
 * 
 * Filename: auto_address.js
 * Version: 1.0
 * 
 * Description:
 * 
 * This is the auto address, auto completion widget built as an extended canJS Control. It is NOT
 * a canJS Component. We should probably name this as a widget so not to be confused with canJS components.
 * 
 */

// This component system is DG Web specific, it is not the same as the canJS component

_global['_components']['AutoAddress'] = {
    id: 'AutoAddress',
    instantiate: function () {
        this.Control = can.Control({
            init: function () {
                this.element.html(can.view('autoAddressInputEJS', this.options));
                this.element.find('.dropdown').hide();
                this.spinner = can.$(this.options.attr('spinnerId'));
                this.spinner.hide();

                var inputBox = this.element.find("input[name='" + this.options.attr('addressName') + "']");
                if (!isEmpty(this.options.attr('value'))) {
                    inputBox.val(this.options.attr('value'));
                }
                
                if (!this.options.attr('inputVisible')) {
                    this.element.hide();
                } else {
                    fadeIn(inputBox);
                }

                this.mainInputBox = inputBox;

                this.on(inputBox, 'keydown', 'onInputKeyDown');
                this.on(inputBox, 'keyup', 'onInputKeyUp');
                this.manualMode = false;

                this.inputs = [];
            },
            reset: function () {
                removeFormElement(this.options.parentControl.inputs, 'suburb');
                removeFormElement(this.options.parentControl.inputs, 'postCode');
            },
            showMoreFields: function () {
                this.manualMode = true;
                this.spinner.hide();

                var moreDiv = this.element.find('#moreFields');
                var inputBox = this.element.find("input[name='" + this.options.attr('addressName') + "']").attr('placeholder', _s('C001'));
                var inputLine = can.$('<span class="inputrow address_group_row"></span>');
                inputLine.appendTo(moreDiv);
                var clearButton = can.$('<a class="input_clear_button" href="#"></a>');
                clearButton.appendTo(inputLine);
                var inputBox = can.$('<input' +
                    ' name="' + this.options.attr('addressName') + '2" placeholder="' + _s('C002') + '" type="text" autocomplete="off"/>');
                inputBox.appendTo(inputLine);
                addClearButton(inputBox);

                inputLine = can.$('<span class="inputrow address_group_row"></span>');
                inputLine.appendTo(moreDiv);
                clearButton = can.$('<a class="input_clear_button" href="#"></a>');
                clearButton.appendTo(inputLine);
                inputBox = can.$('<input name="suburb" placeholder="' + _s('C003') + '" type="text" autocomplete="off"/>');
                inputBox.appendTo(inputLine);
                addClearButton(inputBox);

                inputLine = can.$('<span class="inputrow address_group_row"></span>');
                inputLine.appendTo(moreDiv);
                //clearButton = can.$('<a class="input_clear_button" href="#"></a>');
                //clearButton.appendTo(inputLine);
                //inputBox = can.$('<input name="state" placeholder="' + _s('C004') + '" type="text" autocomplete="off"/>');
                //inputBox.appendTo(inputLine);
                //addClearButton(inputBox);

                var stateData = new can.Map({
                    name: "state",
                    label: _s('C004'),
                    id: "selectState",
                    inputClass: "styled-select",
                    selections: {
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
                    },
                    selected: "ACT"
                });
                inputBox = can.view('selectInputGroupEJS', stateData);
                inputLine.append(inputBox);

                inputLine = can.$('<span class="inputrow address_group_row"></span>');
                inputLine.appendTo(moreDiv);
                clearButton = can.$('<a class="input_clear_button" href="#"></a>');
                clearButton.appendTo(inputLine);
                inputBox = can.$('<input name="postCode" placeholder="' + _s('C005') + '" type="number" autocomplete="off"/>');
                inputBox.appendTo(inputLine);
                addClearButton(inputBox);

                this.off(inputBox, 'keydown', 'onInputKeyDown');
                this.off(inputBox, 'keyup', 'onInputKeyUp');

                addFormElement(this.options.parentControl.inputs, 'suburb', 'text', 1, _s('CE001'), null, null, moreDiv);
                addFormElement(this.options.parentControl.inputs, 'postCode', 'number', 4, _s('CE002'), '===', null, moreDiv);
            },
            onInputKeyDown: function (inputBox, event) {
                if (inputBox.prop('name') === this.options.attr('addressName')) {
                    //event.preventDefault();
                }
            },
            onInputKeyUp: function (inputBox, event) {
                // Only if the length is larger than 5
                if (inputBox.prop('name') === this.options.attr('addressName') && inputBox.val().length >= MIN_QAS_LENGTH) {
                    clearTimeout(this.timer);
                    var control = this;
                    this.timer = setTimeout(function () {
                        if (!control.manualMode) {
                            // Prevents Spamming
                            control.spinner.show();
                            fadeIn(control.spinner);
                            control.queryQAS(inputBox, event);
                        }
                    }, TYPING_THRESHOLD);
                }
            },
            queryQAS: function (inputBox, event) {
                if (inputBox.prop('name') === this.options.attr('addressName')) {
                    //this.spinner.fadeIn();
                    var control = this;

                    var onGetAddress = function (result) {
                        var addressList = new can.List(result);
                        addressList.push({ DisplayText: _s('C006'), UniqueID: 'NA' });

                        if (addressList.attr('length') >= 0 && !this.manualMode) {
                            var dropdownDiv = control.element.find('.dropdown');
                            dropdownDiv.html(can.view('autoAddressDropDownEJS', { addressList: addressList }));
                            setTimeout(function () {
                                dropdownDiv.show();
                                fadeIn(dropdownDiv);
                            }, 100);

                            //control.element.find('.dropdown').fadeIn();
                            control.element.find(".dropdown a").click(function (e) {
                                if (can.$(e.target).html() === _s('C006')) {
                                    control.showMoreFields();
                                    inputBox.attr('data-unique-id', 'NA');
                                } else {
                                    inputBox.val(can.$(e.target).html());
                                    inputBox.attr('data-unique-id', can.$(e.target).attr('name'));
                                }

                                control.spinner.hide();
                                control.element.find(".dropdown").hide();
                            });
                        }
                    };

                    var onGetAddressFail = function (msg) {
                        // Does nothing if address fails
                        control.spinner.hide();
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
            alert("AutoAddress Need Options");
            return;
        }

        options.addressList = [];

        var map = new can.Map(options);
        return new this.Control(id, map);
    }
};
