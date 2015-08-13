/* 
 * MobileJS
 * MIT Licence
 * You can use this according to the MIT Licence.
 * 
 * Filename: date_picker.js
 * Version: 1.0
 * 
 * Description:
 * 
 */

// This component system is DG Web specific, it is not the same as the canJS component
_global['_components']['DatePicker'] = {
    id: 'DatePicker',
    instantiate: function () {
        this.Control = can.Control({
            init: function () {
                var dateWidget = can.view('dateWidgetEJS', this.options);
                this.element.prepend(dateWidget);

                var defaultDate = this.options.defaultDate;
                this.day = defaultDate.getDate();
                this.month = defaultDate.getMonth();
                this.year = defaultDate.getFullYear();
                this.today = new Date(Date.UTC(this.year, this.month, this.day, 0, 0, 0));
                this.selected = new Date(Date.UTC(this.year, this.month, this.day, 0, 0, 0));

                //this.updatePosition(can.$(window));
                this.popup = this.element.find('#popup');
                this.popup.show();
                fadeIn(this.popup);
            },
            '#day_plus click': function (element, event) {
                this.day++;
                if (this.day > 31) {
                    this.day = 1;
                }

                this.selected = new Date(Date.UTC(this.year, this.month, this.day, 0, 0, 0));
                this.options.selectedDate.attr('selectedDay', this.selected.getDateFormatted());
            },
            '#day_minus click': function (element, event) {
                this.day--;
                if (this.day < 1) {
                    this.day = 31;
                }

                this.selected = new Date(Date.UTC(this.year, this.month, this.day, 0, 0, 0));
                this.options.selectedDate.attr('selectedDay', this.selected.getDateFormatted());
            },
            '#month_plus click': function (element, event) {
                this.month++;
                if (this.month > 11) {
                    this.month = 0;
                }

                this.selected = new Date(Date.UTC(this.year, this.month, this.day, 0, 0, 0));
                this.options.selectedDate.attr('selectedMonth', this.selected.getMonthFormatted());
            },
            '#month_minus click': function (element, event) {
                this.month--;
                if (this.month < 0) {
                    this.month = 11;
                }

                this.selected = new Date(Date.UTC(this.year, this.month, this.day, 0, 0, 0));
                this.options.selectedDate.attr('selectedMonth', this.selected.getMonthFormatted());
            },
            '#year_plus click': function (element, event) {
                if (this.year < this.options.maxYear) {
                    this.year++;
                }

                this.selected = new Date(Date.UTC(this.year, this.month, this.day, 0, 0, 0));
                this.options.selectedDate.attr('selectedYear', this.year);
            },
            '#year_minus click': function (element, event) {
                if (this.year > this.options.minYear) {
                    this.year--;
                }

                this.selected = new Date(Date.UTC(this.year, this.month, this.day, 0, 0, 0));
                this.options.selectedDate.attr('selectedYear', this.year);
            },
            clean: function () {
                var control = this;
                fadeOut(this.popup, function () {
                    control.popup.remove();
                    control.destroy();
                    dateWidgetControl = null;
                });
            },
            'a[name="accept"] click': function (element, event) {
                if (can.isFunction(this.options.onCallBack)) {
                    this.options.onCallBack(this.selected);
                }
                this.clean();
            },
            'a[name="cancel"] click': function (element, event) {
                this.clean();
            }
        });
    },
    create: function (date, minY, maxY, callBack) {
        var map = new can.Map({ defaultDate: date, maxYear: maxY, minYear: minY, selectedDate: { selectedDay: date.getDateFormatted(), selectedMonth: date.getMonthFormatted(), selectedYear: date.getFullYear() }, onCallBack: callBack });
        return new this.Control('body', map);
    }
};
