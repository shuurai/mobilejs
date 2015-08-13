<script type='text/ejs' id='pagetitleEJS'>
    <div class="dg-pagetitle">
        <% if(this.attr('hideSuperTitle') === false) { %>
            <h4 class="dg-subtitle"><%= this.attr('superTitle') %></h4>
        <% } %>
        <% if(this.attr('showTitle') === true) { %>
            <h2 class="dg-maintitle"><%= toUpper(this.attr('title')) %></h2>
        <% } %>
        <% if(this.attr('showAgency') == true) { %>
            <a class="agency_icon" href="#" id="agency_info"></a>
        <% } %>
    </div>
</script>