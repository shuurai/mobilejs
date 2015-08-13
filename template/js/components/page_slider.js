/* 
 * MobileJS
 * MIT Licence
 * You can use this according to the MIT Licence.
 * 
 * Filename: page_slider.js
 * Version: 1.0
 * 
 * Description:
 * 
 * Slides page to page.
 * 
 */

// This component system is DG Web specific, it is not the same as the canJS component
_global['_components']['PageSlider'] = {
    id: 'PageSlider',
    instantiate: function () {
        this.Control = can.Control({
            init: function () {
                this.currentPage = null;
                this.currentPageCode = null;
            },
            setOptions: function( list ) {
                this.options = list;
            },
            // page is the new loaded ejs
            // id is the section block below top bars
            // control element is the inner-wrap div
            slidePage: function (page, id, controlElement, pageCode, forcedDirection) {
                // This element is mainContainer
                this.element.append(page);
                var pageBody = this.element.find(id);

                if (!this.currentPageCode) {
                    this.currentPageCode = pageCode.toString();
                    this.slidePageFrom(pageBody, controlElement, false);
                    return;
                }

                var indexOfBefore = this.options.stateHistory.indexOf(this.currentPageCode);
                var indexOfNew = this.options.stateHistory.indexOf(pageCode);

                if (!isEmpty(forcedDirection)) {
                    // Forced
                    console.log("pageslider : forced " + forcedDirection)
                    this.slidePageFrom(pageBody, controlElement, 'dg-transition-'+forcedDirection);
                } else if (indexOfNew === -1){
                    // A New Page
                    this.slidePageFrom(pageBody, controlElement, 'dg-transition-right');
                } else if (indexOfNew < indexOfBefore) {
                    this.slidePageFrom(pageBody, controlElement, 'dg-transition-left');
                } else if (indexOfNew > indexOfBefore) {
                    this.slidePageFrom(pageBody, controlElement, 'dg-transition-right');
                } 
        
                this.currentPageCode = pageCode.toString();
            },
            slidePageFrom: function (pageBody, controlElement, from) {
                if (!from) {
                    //page.hide();
                    //page.fadeIn();
                    pageBody.removeClass("dg-transition-page");
                    pageBody.addClass("dg-transition-center");
                    //pageBody.attr("class", "dg-transition-page t-center");
                    this.currentPage = pageBody;
                    return;
                }

                // Position the page at the starting position of the animation
                //pageBody.attr("class", "dg-transition-page" + from);
                pageBody.addClass("dg-transition-page " + from);

                this.currentPage.one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function (e) {
                    // All controls related are removed as well
                    var pageInMotion = can.$(e.target);
                    if (pageInMotion && can.isFunction(pageInMotion.remove)) {
                        pageInMotion.remove();
                    }
                });

                // Hack to fix some times transition end not firing problem
                var oldPage = this.currentPage;
                setTimeout(function () {
                    if (oldPage && can.isFunction(oldPage.remove)) {
                        oldPage.remove();
                    }
                }, TRANSITION_SPEED * 2);

                controlElement[0].offsetWidth;

                // Position the new page and the current page at the ending position of their animation with a transition class indicating the duration of the animation
                pageBody.removeClass("dg-transition-page dg-transition dg-transition-center dg-transition-left dg-transition-right");
                pageBody.addClass("dg-transition dg-transition-center");
                //pageBody.attr("class", "dg-transition-page t-transition t-center");
                this.currentPage.attr("class", "dg-transition-page dg-transition " + (from === "dg-transition-left" ? "dg-transition-right" : "dg-transition-left"));

                this.currentPage = pageBody;
            }
        });
    },
    create: function (id, list) {
        var instance = new this.Control(id, { stateHistory: list } );
        return instance;
    }
};
