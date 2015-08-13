<script type='text/ejs' id='infoIconEJS'>
	<% if(this.attr('infoIcon')) { %>
	    <a href="#" class="dg-info-icon" id="<%= this.attr('id') %>"><i class="<%= infoIcon %>"></i> <%= (this.attr('infoIconText'))?this.attr('infoIconText'):"" %></a>
	<% } else if(this.attr('infoIconText')) { %>
	    <a href="#" class="dg-info-text" id="<%= this.attr('id') %>"><%= (this.attr('infoIconText'))?this.attr('infoIconText'):"" %></a>
	<% } %>
</script>