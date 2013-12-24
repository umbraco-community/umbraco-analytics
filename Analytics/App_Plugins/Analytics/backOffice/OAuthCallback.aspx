<%@ Page Title="" Language="C#" AutoEventWireup="true" CodeBehind="OAuthCalllback.aspx.cs" Inherits="Analytics.App_Plugins.Analytics.BackOffice.OAuthCalllback" %>

<html>
    <head>
        <title>Analytics for Umbraco oAuth</title>
        <link rel="stylesheet" href="/umbraco/assets/css/umbraco.css" />
        
        <style>
            .authcontainer {
                padding: 20px;
            }

            h1 {
                margin: 0 0 25px 0;
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
            <h1>
                <span class="icon-pulse"></span>
                Analytics for Umbraco
            </h1>
            
            <asp:Literal runat="server" ID="Content" />
        </div>
        
    </body>
</html>
