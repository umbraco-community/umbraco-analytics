<%@ Page Title="" Language="C#" AutoEventWireup="true" CodeBehind="OAuthCalllback.aspx.cs" Inherits="Analytics.App_Plugins.Analytics.BackOffice.OAuthCalllback" %>

<html>
    <head>
        <title>Analytics for Umbraco oAuth</title>
        <link rel="stylesheet" href="/umbraco/assets/css/umbraco.css" />
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
        
        <div class="container">
            <div class="row">
                <div class="span10">
                    <h1>Analytics for Umbraco</h1>
                    <asp:Literal runat="server" ID="Content" />
                </div>
            </div>
        </div>
        
    </body>
</html>
