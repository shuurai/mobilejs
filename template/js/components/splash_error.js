/* 
 * MobileJS
 * MIT Licence
 * You can use this according to the MIT Licence.
 * 
 * Filename: splash_error.js
 * Version: 1.0
 * 
 * Description:
 * 
 * Creates a splash error (alert box) that sticks on the top.
 * EJS is part of the `app.tpl`
 * 
 */

// This component system is DG Web specific, it is not the same as the canJS component
_global['_components']['SplashError'] = {
    id: 'SplashError',
    instantiate: function () {
        this.Control = can.Control({
            init: function () {
                var splashNode = can.view('splashErrorEJS', this.options);
                this.element.append(splashNode);

                this.splashElement = this.element.find('.dg-splash-error');

                //this.splashElement.hide();
                //this.splashElement.fadeIn();
                this.splashElement.show();
                fadeIn(this.splashElement);

                //this.updatePosition(can.$(window));
            },
            remove: function(element, event) {
                var control = this;
                fadeOut(this.splashElement, function () {
                    control.splashElement.remove();
                    control.destroy();
                    splashErrorControl = null;
                });
            },
            '.dg-splash-error click': function (element, event) {
                this.remove(element, event);
            }
        });
    },
    create: function (str, element) {
        return new this.Control(element, { errorMessage: str });
    }
};
