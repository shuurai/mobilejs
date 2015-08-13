<script type='text/ejs' id='autoAddressDropDownEJS'>
    <div id="dg-qas-list">
        <% if(!can.isEmptyObject( addressList )) { %>
            <% list(addressList, function( addressObj ){ %>
                <strong><a href="#" name="<%= addressObj.attr('uniqueID') %>"><%= addressObj.attr('displayText') %></a></strong><br/>
            <% }); %>
        <% }; %>
    </div>
</script>

<script type='text/ejs' id='autoAddressInputEJS'>
    <%== can.view.render('infoIconEJS', this); %>
	<label><%= toUpper(label) %></label>

	<div class="dg-input-clear-button" href="#"><i class="fi-x fi-size-large"></i></div><input class="<%= inputClass %>" placeholder="<%= placeholder %>" name="<%= name %>" value="<%= (this.attr('value') != null)?this.attr('value'):'' %>" type="text" autocomplete="off">

    <p class="panel dg-qas-dropdown"></p>
</script>

<script type='text/ejs' id='autoAddressEJS'>
    <div class="row" id="dg-auto-block">
        <div class="columns">
            <%== can.view.render('autoAddressInputEJS', this.form.attr('fullAddress') ); %>
        </div>
    </div>
    <div class="row" id="dg-manual-block">
        <div class="large-12 columns">
            <%== can.view.render('textInputEJS', this.form.attr('addressLine1') ); %>
        </div>
        <div class="large-12 columns">
            <%== can.view.render('textInputEJS', this.form.attr('addressLine2') ); %>
        </div>
        <div class="large-6 columns">
            <%== can.view.render('textInputEJS', this.form.attr('addressSuburb') ); %>
        </div>
        <div class="large-6 columns">
            <%== can.view.render('textInputEJS', this.form.attr('addressPostcode') ); %>
        </div>
        <div class="large-12 columns">
            <%== can.view.render('selectInputEJS', this.form.attr('addressState') ); %>
        </div>
        <div class="large-12 columns">
            <%== can.view.render('submitButtonEJS', this.form.attr('reset') ); %>
        </div>
    </div>
</script>