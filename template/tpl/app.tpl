<script type='text/ejs' id='dateWidgetEJS'>
    <div id="popup">
        <div class="canvas"></div>
        <div class="popup_content">
            <h1><img class="popup_header_icon" src="/Content/img/cal_icon.png" />Select a date</h1>
            <table class="styled_table">
                <tr>
                    <td class="selection_cell">
                        <a class="toggle_top_button" id="day_plus" href="#">+</a>
                        <div class="toggle_value" id="day_value"><%= this.selectedDate.attr('selectedDay') %></div>
                        <a class="toggle_bottom_button" id="day_minus" href="#">-</a>
                    </td>
                    <td class="selection_cell">
                        <a class="toggle_top_button" id="month_plus" href="#">+</a>
                        <div class="toggle_value" id="month_value"><%= this.selectedDate.attr('selectedMonth') %></div>
                        <a class="toggle_bottom_button" id="month_minus" href="#">-</a>
                    </td>
                    <td class="selection_cell">
                        <a class="toggle_top_button" id="year_plus" href="#">+</a>
                        <div class="toggle_value" id="year_value"><%= this.selectedDate.attr('selectedYear') %></div>
                        <a class="toggle_bottom_button" id="year_minus" href="#">-</a>
                    </td>
                </tr>
                <tr>
                    <td colspan=3 class="day_label_cell">&nbsp;</td>
                </tr>
            </table>
            <div class="half_left_button"><a name="cancel" href="#">CANCEL</a></div>
            <div class="half_right_button"><a name="accept" href="#">ACCEPT</a></div>
        </div>
    </div>
</script>

<!-- Form EJS Elements Start -->

<script type='text/ejs' id='radioEJS'>
    <div class="btn-radio-container">
        <% this.each(function( radioObj, key ) { %>
            <% if(!can.isEmptyObject( radioObj )) { %>
                <div class="btn-radio">
                    <input type="radio" name="<%= radioObj.attr('name') %>" value="<%= radioObj.attr('value') %>" id="<%= radioObj.attr('id') %>" class="<%= radioObj.attr('inputClass') %>" />
                    <label for="<%= radioObj.attr('id') %>"><%= radioObj.attr('label') %></label>
                </div>
            <% } %>
        <% }); %>
    </div>
</script>

<script type='text/ejs' id='selectInputGroupEJS'>
    <div class="ie-select">
        <select class="<%= inputClass %>" title="<%= name %>" id="<%= id %>" name="<%= name %>">
            <% if(!can.isEmptyObject( selections )) { %>
            <% list(selections, function( item, index ){ %>
            <option value="<%= item.attr('value') %>"<%= (item.attr('value') == selected) ? "selected":"" %>><%= item.attr('label') %></option>
            <% }); %>
            <% }; %>
        </select>
    </div>
</script>

<!-- Form EJS Elements End -->