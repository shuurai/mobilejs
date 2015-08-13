/* 
 * MobileJS
 * MIT Licence
 * You can use this according to the MIT Licence.
 * 
 * Filename: popup.js
 * Version: 1.0
 * 
 * Description:
 * 
 * This is a single instance modal popup that is built on top of foundation's modal.
 * There will only be one popup shown at a time.
 *
 * Please note that close button is treated as the "right button" (right function if assigned)
 * 
 */

// This component system is DG Web specific, it is not the same as the canJS component
_global['_components']['Popup'] = {
    id: 'Popup',
    instance: null,
    instantiate: function () {
        // Initializes any strings if neccessary
        initDictionary(popupStrEN);

        this.Control = can.Control({
            init: function () {
                var titleString = this.options.attr('titleString');
                var bodyString = this.options.attr('bodyString');
                var leftString = this.options.attr('leftString');
                var rightString = this.options.attr('rightString');
                var hideCloseButton = this.options.attr('hideCloseButton');

                if(hideCloseButton) {
                    this.hideCloseButton();
                }

                if (isEmpty(titleString) === null) {
                    titleString = _s('POP001');
                }

                if (isEmpty(bodyString) === null) {
                    bodyString = "ERROR";
                }

                if (bodyString.indexOf('<p>') === -1) {
                    bodyString = '<h3>' +  bodyString + '</h3><br/>';
                }

                if (isEmpty(leftString)) {
                    leftString = _s('POP002');
                }

                this.element.find('h2').html(titleString);
                var bodyArea = this.element.find('section');
                bodyArea.html(bodyString);

                //var fullButton, rightButton, leftButton;

                if (!isEmpty(leftString) && isEmpty(rightString)) {
                    this.fullButton = can.$('<a class="button expand" href="#">' + leftString + '</a>');
                    this.fullButton.appendTo(bodyArea);

                    this.on(this.fullButton, 'click', 'onLeftFunction');
                } else {
                    
                    var rowBlock = can.$('<div class="row"></div>');
                    this.buttonRowBlock = rowBlock;

                    var rightColumn = can.$('<div class="small-12 medium-6 large-6 dg-popup-button-left"></div>');
                    rightColumn.appendTo(rowBlock);
                    leftButton = can.$('<a class="button expand" href="#">' + leftString + '</a>');
                    leftButton.appendTo(rightColumn);

                    var leftColumn = can.$('<div class="small-12 medium-6 large-6 dg-popup-button-right"></div>');
                    leftColumn.appendTo(rowBlock);
                    rightButton = can.$('<a class="button expand secondary" href="#">' + rightString + '</a>');
                    rightButton.appendTo(leftColumn);

                    rowBlock.appendTo(bodyArea);

                    this.on(leftButton, 'click', 'onLeftFunction');
                    this.on(rightButton, 'click', 'onRightFunction');
                }

                var control = this;
                control.onClosed = function() {
                    control.onRemoved();
                };

                can.$(document).on('closed', '[data-reveal]', control.onClosed);

                /*
                var content = this.element.find('.dg-popup-wrapper');

                var contentY = 0;
                var upperPadding = can.$(window).height() / 2 - content.height() / 2;
                //If content is higher then find scroll index
                var scrollOffset = can.$('body').scrollTop();
                var realContentHeight = (can.$('#dg-overall-wrapper').prop('scrollHeight'));
                //alert(scrollOffset);
                if (can.$(window).height() > content.height()) {
                    // Quarter way up
                    contentY = upperPadding / 2 + scrollOffset;
                } else {
                    contentY = 10 + scrollOffset;
                }

                content.css('top', contentY);
                */

                var control = this;
                setTimeout(function () {
                    control.element.foundation('reveal', 'open');
                }, TRANSITION_SPEED/3);
            },
            updateHeading: function( title ) {
                var popupHeading = this.element.find('#dg-popup-heading');
                popupHeading.html(title);
            },
            updateContent: function( content ) {
                var popupSection = this.element.find('#dg-popup-content');
                popupSection.html(content);
            },
            hideControls: function() {
                this.hideCloseButton();
                if(this.fullButton) {
                    this.fullButton.hide();
                }
                if(this.buttonRowBlock) {
                    this.buttonRowBlock.hide();
                }
            },
            hideCloseButton: function() {
                this.element.find('.close-reveal-modal').hide();
            },
            onLeftFunction: function(element, event) {
                var leftFunction = this.options.attr('leftFunction');

                var caller = this.options.attr('caller');
                if (!caller) {
                    caller = this;
                }

                if (can.isFunction(leftFunction)) {
                    setTimeout(function(){
                        leftFunction.call(caller);
                    }, TRANSITION_SPEED);
                }
                
                // Reset Right so it will not be called in onRemoved event
                this.options.attr('rightFunction', null);

                var removeOnButton = this.options.attr('removeOnButton');
                if(removeOnButton) {
                    this.removePopup();
                }
                event.preventDefault();
            },
            onRightFunction: function(element, event) {
                var rightFunction = this.options.attr('rightFunction');
                var caller = this.options.attr('caller');
                if (!caller) {
                    caller = this;
                }

                if (can.isFunction(rightFunction)) {
                    rightFunction.call(caller);
                    this.options.attr('rightFunction', null);
                }
                
                var removeOnButton = this.options.attr('removeOnButton');
                if(removeOnButton) {
                    this.removePopup( true );
                }

                event.preventDefault();
            },
            onRemoved: function() {
                can.$(document).off('closed', '[data-reveal]', this.onClosed);

                var rightFunction = this.options.attr('rightFunction');
                var caller = this.options.attr('caller');
                if (!caller) {
                    caller = this;
                }

                if (can.isFunction(rightFunction)) {
                    rightFunction.call(caller);
                    // Set null to prevent it being called twice. CanJS Bug?
                    this.options.attr('rightFunction', null);
                }
            },
            removePopup: function( resetRight ) {
                console.log("popup : removePopup");

                if(resetRight) {
                    this.options.attr('rightFunction', null);
                }

                this.element.foundation('reveal', 'close');
            },
            resetOptions: function( options ) {
                can.$(document).off('closed', '[data-reveal]', this.onClosed);
                this.onClosed = null;

                this.options = options;
                this.init();
            }
        });
    },
    create: function (titleString, bodyString, leftString, rightString, leftFunction, rightFunction, caller, removeOnButton, hideCloseButton) {
        var modalId = 'modal-'+Math.floor((Math.random() * 10) + 1);
        //alert(removeOnButton);
        if(removeOnButton === null || removeOnButton === undefined) {
            removeOnButton = true;
        }

        var map = new can.Map({
            titleString: titleString,
            bodyString: bodyString,
            leftString: leftString,
            rightString: rightString,
            leftFunction: leftFunction,
            rightFunction: rightFunction,
            caller: caller,
            removeOnButton: removeOnButton,
            hideCloseButton: hideCloseButton
        });

        if(this.instance === null) {
            this.instance = new this.Control('#dg-global-modal', map);
        } else {
            this.instance.resetOptions( map );
        }

        return this.instance;
    }
};
