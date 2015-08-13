<script type='text/ejs' id='selectInputEJS'>
    <%== can.view.render('infoIconEJS', this); %>
    <label for="<%= name %>"><%= toUpper(label) %></label>
    <select class="<%= inputClass %>" title="<%= name %>" name="<%= name %>">
        <% if(!can.isEmptyObject( selections )) { %>
            <% list(selections, function( item, index ){ %>
                <option value="<%= item.attr('value') %>" <%= (item.attr('value') == selected) ? "selected":"" %>><%= item.attr('label') %></option>
            <% }); %>
        <% }; %>
    </select>
</script>