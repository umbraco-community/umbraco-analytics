<%@ Page Title="" Language="C#" AutoEventWireup="true" CodeBehind="OAuth.aspx.cs" Inherits="Analytics.App_Plugins.Analytics.BackOffice.OAuth" %>
<html>
    <head>
        <title></title>
        <script type="text/javascript">
            function init() {                                
                window.opener.postMessage("", "*");
                window.close();
            }
        </script>
    </head>
    <body onload="init();">
        
    </body>
</html>
