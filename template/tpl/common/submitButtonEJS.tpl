<script type='text/ejs' id='submitButtonEJS'>
    <input type="button" name="<%= name %>" title="<%= (this.attr('title'))?this.attr('title'):value %>" class="<%= inputClass %> button" value="<%= value %>">
</script>