<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="PostInstall.ascx.cs" Inherits="Analytics.Installer.PostInstall" %>

<h1><span class="icon-pulse"></span> Analytics for Umbraco</h1>
<h3>Thank You!</h3>
<p>
    The Analytics for Umbraco team, would like to thank you for installing this package. We hope you enjoy using it and find 
    it useful to get a quick glance & overview of your statistics for your website, directy inside Umbraco.
</p>
<p>
    So to get started click the button below and visit the newly installed section inside your install and visit the 
    Settings page to Authorize Analyttics to view you statistics with Google oAuth.
</p>

<p>
    <button onclick="window.parent.location.href = '/umbraco/#/analytics/analyticsTree/edit/settings'; return false;" class="btn btn-primary">Open Analytics For Umbraco</button>
</p>