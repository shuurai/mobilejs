<script type='text/ejs' id='dobInputEJS'>
    <div class="row collapse">
    	<%== can.view.render('infoIconEJS', this); %>
        <label><%= toUpper(label) %></label>
        <div class="small-11 columns">
            <input class="<%= inputClass %>" placeholder="<%= placeholder %>" name="<%= name %>" value="<%= (this.attr('value') != null)?this.attr('value'):'' %>" type="date" autocomplete="off" min="1900-01-01">
        </div>
        <div class="small-1 columns">
            <span class="postfix"><i class="fi-calendar fi-size-medium"></i></span>
        </div>
    </div>
</script>