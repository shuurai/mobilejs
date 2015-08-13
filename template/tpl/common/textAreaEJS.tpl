<script type='text/ejs' id='textAreaEJS'>
    <%== can.view.render('infoIconEJS', this); %>
	<label for="<%= name %>"><%= toUpper(label) %></label>
	<textarea rows="<%= rows %>" cols="<%= cols %>" name="<%= name %>" type="text"></textarea>
</script>