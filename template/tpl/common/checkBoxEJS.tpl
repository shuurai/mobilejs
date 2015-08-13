<script type='text/ejs' id='checkBoxEJS'>
    <%== can.view.render('infoIconEJS', this); %>
    <% if(this.attr('labelTop')) { %>
        <label><%== labelTop %></label>
    <% } %>
    <input type='checkbox' name='<%= name %>' value="<%= value %>" id="<%= id %>" class="<%= inputClass %>" <%== checked %> />
    <label class="dg-check-label" for="<%= id %>"><%== label %></label>
</script>