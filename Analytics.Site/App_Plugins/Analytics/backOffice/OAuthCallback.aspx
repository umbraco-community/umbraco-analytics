<%@ Page Title="" Language="C#" AutoEventWireup="true" CodeBehind="OAuthCalllback.aspx.cs" Inherits="Analytics.App_Plugins.Analytics.BackOffice.OAuthCalllback" %>

<script type="text/javascript">
    //When this is closed - run function refreshParent()
    window.onunload = refreshParent;


    function refreshParent() {
        //Reload parent - so we see the value in the refreshToken box
        window.opener.location.reload();
    }
</script>

<asp:Literal runat="server" ID="Content" />