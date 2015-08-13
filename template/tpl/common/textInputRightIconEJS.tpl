<script type='text/ejs' id='textInputRightIconEJS'>
    <div class="row collapse">
        <%== can.view.render('infoIconEJS', this); %>
        <label><%= toUpper(label) %></label>
        <div class="small-11 columns">
            <div class="dg-input-clear-button dg-input-clear-button-columned" href="#"><i class="fi-x fi-size-large"></i></div><input class="<%= inputClass %>" placeholder="<%= placeholder %>" name="<%= name %>" value="<%= (this.attr('value') != null)?this.attr('value'):'' %>" type="<%= (this.attr('inputType') != null)?this.attr('inputType'):'text' %>" <%= (this.attr('pattern') != null)?'pattern="'+this.attr('pattern')+'"':'' %> autocomplete="off">
        </div>
        <div class="small-1 columns">
            <span class="postfix"><i class="<%= iconClass %>"></i></span>
        </div>
    </div>
</script>