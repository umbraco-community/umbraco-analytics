using System;
using System.Xml.Linq;
using Umbraco.Web.UI.Pages;

using Google.Apis.Auth;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Analytics.v3;
using System.Threading;

namespace Analytics.App_Plugins.Analytics.BackOffice
{

    public partial class OAuth : UmbracoEnsuredPage
    {

        public string GetSetting(string key)
        {
            // TODO: This is just for POC - use Warren's logic instead
            XElement xAnalytics = XElement.Load(ConfigFilePath);
            XElement xSetting = xAnalytics.Element(key);
            return xSetting == null ? null : xSetting.Value;
        }

        public void SetSetting(string key, string value)
        {
            // TODO: This is just for POC - use Warren's logic instead
            XElement xAnalytics = XElement.Load(ConfigFilePath);
            XElement xSetting = xAnalytics.Element(key);
            if (xSetting == null)
            {
                xAnalytics.Add(new XElement(
                    key,
                    new XAttribute("label", key),
                    new XAttribute("description", ""),
                    value ?? ""
                ));
            }
            else
            {
                xSetting.Value = value;
            }
            xAnalytics.Save(ConfigFilePath);
        }

        #region Properties

        /// <summary>
        /// Gets the client ID from the config file.
        /// </summary>
        public string ConfigFilePath
        {
            get { return Server.MapPath("~/App_Plugins/Analytics/settings.config"); }
        }

        /// <summary>
        /// Gets the client ID from the config file.
        /// </summary>
        public string ClientId
        {
            get { return GetSetting("ClientId"); }
        }

        /// <summary>
        /// Gets the client secret from the config file.
        /// </summary>
        public string ClientSecret
        {
            get { return GetSetting("ClientSecret"); }
        }

        /// <summary>
        /// Get the redirect URI from the config file.
        /// </summary>
        public string RedirectUri
        {
            get { return GetSetting("RedirectUri"); }
        }

        /// <summary>
        /// The refresh token used to acquire new access tokens. This is sensitive information.
        /// </summary>
        public string RefreshToken
        {
            get { return GetSetting("RefreshToken"); }
            set { SetSetting("RefreshToken", value); }
        }

        /// <summary>
        /// Gets the OAuth authorization code from the query string.
        /// </summary>
        public string Code
        {
            get { return Request.QueryString["code"]; }
        }

        /// <summary>
        /// Gets the OAuth error message from the query string.
        /// </summary>
        public new string Error
        {
            get { return Request.QueryString["error"]; }
        }

        #endregion

        private const string UserId = "user-id";

        protected void Page_Load(object sender, EventArgs e)
        {
            if (Code != null)
            {
                GoogleAuthorizationCodeFlow flow;

                flow = new GoogleAuthorizationCodeFlow(new GoogleAuthorizationCodeFlow.Initializer
                {
                    ClientSecrets = new ClientSecrets
                    {
                        ClientId = ClientId,
                        ClientSecret = ClientSecret
                    },
                    Scopes = new[] { AnalyticsService.Scope.AnalyticsReadonly },
                    

                });

                var uri = Request.Url.ToString();
                var token = flow.ExchangeCodeForTokenAsync(UserId, Code, uri.Substring(0, uri.IndexOf("?")), CancellationToken.None).Result;
                
                RefreshToken = token.RefreshToken;
            }
        }
    }
}