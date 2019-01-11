<%@ Page Title="" Language="C#" AutoEventWireup="true" CodeBehind="OAuthCalllback.aspx.cs" Inherits="Analytics.App_Plugins.Analytics.BackOffice.OAuthCalllback" %>
<%@ Import Namespace="Umbraco.Core" %>
<%@ Import Namespace="Umbraco.Web" %>
<%@ Import Namespace="Umbraco.Web.UI" %>
<%@ Register TagPrefix="cc1" Namespace="umbraco.uicontrols" Assembly="controls" %>

<html>
    <head>
        <title><%= umbraco.ui.Text("analytics", "analyticsForUmbraco") %> oAuth</title>
        <link rel="stylesheet" href="/umbraco/assets/css/umbraco.css" />
        
        <style>
            .authcontainer {
                padding: 20px;
            }
            h1 {
                margin: 0 0 25px 0;
            }
            a:link {
                color: #08c;
            }
        </style>
    </head>
    <body>
        <script type="text/javascript">
            //When this is closed - run function refreshParent()
            window.onunload = refreshParent;

            function refreshParent() {
                //Reload parent - so we see the value in the refreshToken box
                window.opener.location.reload();
            }
        </script>
         
        <div class="authcontainer">
            <h1><span class="icon-pulse"></span><%= umbraco.ui.Text("analytics", "analyticsForUmbraco") %></h1>
            
            <asp:Literal runat="server" ID="Content" />
        </div>       
    </body>
</html>
