<script type='text/ejs' id='topbarGuestEJS'>  
    <!-- nav class="top-bar docs-bar hide-for-small" data-topbar="">
        <ul class="title-area">
            <li class="name">
                <h1><a href="#"><%= this.attr('logoTitle') %></a></h1>
            </li>
        </ul>
        <section class="top-bar-section">
            <ul class="right">
                <li class="divider"></li>
                <li class="has-dropdown not-click">
                    <a href="#" class="">GET STARTED</a>
                    <ul class="dropdown">
                        <li class="title back js-generated"><h5><a href="javascript:void(0)">Back</a></h5></li>
                        <li><a href="#"><%= toUpper(getStr('DREGISTER')) %></a></li>
                        <li><a href="#"><%= toUpper(getStr('DLOGIN')) %></a></li>
                        <li><a href="#">RENEW A LICENCE</a></li>
                        <li><a href="#">NEW FISHING LICENCE</a></li>
                        <li><a href="#">UPDATE LICENCE DETAILS</a></li>
                    </ul>
                </li>
                <li class="divider"></li>
                <li class="has-dropdown not-click">
                    <a href="#" class="">ABOUT</a>
                    <ul class="dropdown">
                        <li class="title back js-generated"><h5><a href="javascript:void(0)">Back</a></h5></li>

                        <li><a href="#"><%= toUpper(getStr('C017')) %></a></li>
                        <li><a href="#"><%= toUpper(getStr('C018')) %></a></li>
                        <li><a href="#"><%= toUpper(getStr('C019')) %></a></li>
                    </ul>
                </li>
                <li class="divider"></li>
                <li class="has-form">
                    <a href="#" class="small button"><%= toUpper(getStr('DLOGIN')) %></a>
                </li>
            </ul>
        </section>
    </nav -->
    <div class="dg-sticky-top">
        <nav class="tab-bar">
            <% if(leftBtnString !== '') { %>
                <section class="dg-left-small">
                    <a class="fi-arrow-left fi-size-medium dg-back-icon" href="#"><span></span></a>
                </section>
            <% } %>
            <% if(this.attr('hideLogo') === false) { %>
                <section class="middle tab-bar-section">
                    <h1 class="dg-topbar-logo"></h1>
                </section>    
            <% } else { %>
                <section class="middle tab-bar-section">
                    <h1 class="title"><%= this.attr('logoTitle') %></h1>
                </section>    
            <% } %>

            <% if(rightBtnClass === 'menuIcon') { %>
                <section class="right-small">
                    <a class="right-off-canvas-toggle menu-icon" href="#"><span><%= rightBtnString %></span></a>
                </section>
            <% } else if(rightBtnClass === 'homeIcon') { %>
                <section class="dg-right-small">
                    <a class="fi-home fi-size-medium dg-right-icon" href="#"><span><%= rightBtnString %></span></a>
                </section>
            <% } else if(rightBtnClass === 'unlinkIcon') { %>
                <section class="dg-right-small">
                    <a class="fi-unlink fi-size-medium dg-right-icon" href="#"><span><%= rightBtnString %></span></a>
                </section>
            <% } else if(rightBtnClass === 'exitIcon') { %>
                <section class="dg-right-small">
                    <a class="fi-power fi-size-medium dg-right-icon" href="#"><span><%= rightBtnString %></span></a>
                </section>
            <% } else if(rightBtnClass !== '') { %>
                <section class="dg-right-small">
                    <a class="<%== rightBtnClass %> fi-size-medium dg-right-icon" href="#"><span><%= rightBtnString %></span></a>
                </section>
            <% } %>
        </nav>
    </div>
</script>