<script type='text/ejs' id='textInputEJS'>
    <%== can.view.render('infoIconEJS', this); %>
	<label><%= toUpper(label) %></label>

	<div class="dg-input-clear-button" href="#"><i class="fi-x fi-size-large"></i></div><input class="<%= inputClass %>" placeholder="<%= placeholder %>" name="<%= name %>" value="<%= (this.attr('value') != null)?this.attr('value'):'' %>" type="<%= (this.attr('inputType') != null)?this.attr('inputType'):'text' %>" <%= (this.attr('pattern') != null)?'pattern="'+this.attr('pattern')+'"':'' %> autocomplete="off">
</script>