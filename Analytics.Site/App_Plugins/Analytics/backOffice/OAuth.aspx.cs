using System;
using System.Xml.Linq;
using Skybrud.Social.Google;
using Skybrud.Social.Google.Analytics.Responses;
using Skybrud.Social.Google.OAuth;
using Umbraco.Web.UI.Pages;

namespace Analytics.App_Plugins.Analytics.BackOffice {

    public partial class OAuth : UmbracoEnsuredPage {

        public string GetSetting(string key) {
            // TODO: This is just for POC - use Warren's logic instead
            XElement xAnalytics = XElement.Load(ConfigFilePath);
            XElement xSetting = xAnalytics.Element(key);
            return xSetting == null ? null : xSetting.Value;
        }
        
        public void SetSetting(string key, string value) {
            // TODO: This is just for POC - use Warren's logic instead
            XElement xAnalytics = XElement.Load(ConfigFilePath);
            XElement xSetting = xAnalytics.Element(key);
            if (xSetting == null) {
                xAnalytics.Add(new XElement(
                    key,
                    new XAttribute("label", key),
                    new XAttribute("description", ""),
                    value ?? ""
                ));
            } else {
                xSetting.Value = value;
            }
            xAnalytics.Save(ConfigFilePath);
        }

        #region Properties

        /// <summary>
        /// Gets the client ID from the config file.
        /// </summary>
        public string ConfigFilePath {
            get { return Server.MapPath("~/App_Plugins/Analytics/settings.config"); }
        }

        /// <summary>
        /// Gets the client ID from the config file.
        /// </summary>
        public string ClientId {
            get { return GetSetting("ClientId"); }
        }

        /// <summary>
        /// Gets the client secret from the config file.
        /// </summary>
        public string ClientSecret {
            get { return GetSetting("ClientSecret"); }
        }

        /// <summary>
        /// Get the redirect URI from the config file.
        /// </summary>
        public string RedirectUri {
            get { return GetSetting("RedirectUri"); }
        }

        /// <summary>
        /// The refresh token used to acquire new access tokens. This is sensitive information.
        /// </summary>
        public string RefreshToken {
            get { return GetSetting("RefreshToken"); }
            set { SetSetting("RefreshToken", value); }
        }

        /// <summary>
        /// Gets the current action from the query string.
        /// </summary>
        public string Action {
            get { return Request.QueryString["do"]; }
        }

        /// <summary>
        /// Gets the OAuth authorization code from the query string.
        /// </summary>
        public string Code {
            get { return Request.QueryString["code"]; }
        }

        /// <summary>
        /// Gets the OAuth error message from the query string.
        /// </summary>
        public new string Error {
            get { return Request.QueryString["error"]; }
        }

        #endregion

        protected void Page_Load(object sender, EventArgs e) {

            // We start with initializing the OAuth client with information from the config file
            GoogleOAuthClient client    = new GoogleOAuthClient {
                ClientId                = ClientId,
                ClientSecret            = ClientSecret,
                RedirectUri             = RedirectUri
            };

            // When requesting access to the Google API on behalf of a user, we must specify one or
            // more scopes. Most importantly we must request read access to the user's Analytics
            // information.
            string[] scope = new []
            {
                GoogleScope.OpenId,
                GoogleScope.Email,
                GoogleScope.Profile,
                GoogleScope.AnalyticsReadonly
            };

            if (Action == "login")
            {

                // Where should the user be redirected to after a successful login?
                string redirect = (Request.QueryString["redirect"] ?? "default");
                
                // Declare a state to protect against CSRF attacks
                string state = Guid.NewGuid().ToString();
                Session["Analytics_" + state] = redirect;

                // Generate the authorization URL (and make sure to request offline access)
                string url = client.GetAuthorizationUrl(state, String.Join(" ", scope), true);

                // Redirect the user
                Response.Redirect(url);

            } 
            else if (Error != null) {

                // Get the state from the query string
                string state = Request.QueryString["state"];

                // Remove the session
                if (state != null) Session.Remove("Analytics_" + state);

                // Print out the error
                Content.Text += "<div class=\"error\">" + Request.QueryString["error"] + "</div>";

            } 
            else if (Code != null) {

                // Get the state from the query string
                string state = Request.QueryString["state"];

                if (state == null) {
                    Content.Text += "<div class=\"error\">No <strong>state</strong> specified in the query string.</div>";
                    return;
                }

                // Get the session value
                string session = Session["Analytics_" + state] as string;

                // If the session value is null, the session has most likely expired
                if (session == null) {
                    Content.Text += "<div class=\"error\">Session expired?</div>";
                    return;
                }

                // After a successful login, the user is redirected back to this page, and an
                // authorization code is specified as part of the query string. This authorization
                // code can be used to acquire an access token (which has a lifetime of an hour),
                // and since we requsted offline access, we also get a refresh token that can be
                // used to acquire new access tokens.
                GoogleAccessTokenResponse info = client.GetAccessTokenFromAuthorizationCode(Code);

                // If we previously have received a refresh token, and then try to autenticate the
                // user again, the refresh token in the new response will be empty. Therefore the
                // user must deauthenticate our application before continueing.
                if (String.IsNullOrWhiteSpace(info.RefreshToken)) {
                    Content.Text += (
                        "<div class=\"error\">\n" +
                            "No refresh token specified in response from the Google API. If you\n" +
                            "have authenticated with this app before, try deauthorizing it HERE,\n" +
                            "and then try again\n" +
                        "</div>"
                    );
                    return;
                }

                // We're now ready to initialize an instance of the GoogleService class
                GoogleService service = GoogleService.CreateFromRequestToken(client.ClientId, client.ClientSecret, info.RefreshToken);

                // Get all accounts we have access to
                AnalyticsAccountsResponse accounts = service.Analytics.GetAccounts();

                // Write information to the user
                Content.Text = "<div class=\"error\">" + (accounts.Items.Length == 0 ? "Noes! Seems you don't have access to any accounts." : "Yay! You have access to <b>" + accounts.Items.Length + "</b> accounts.") + "</div>";

                Content.Text += "<p><b>Access Token</b> " + info.AccessToken + "</p>\n";
                Content.Text += "<p><b>Refresh Token</b> " + (String.IsNullOrWhiteSpace(info.RefreshToken) ? "<em>N/A</em>" : info.RefreshToken) + "</p>\n";

                RefreshToken = info.RefreshToken;

            } 
            else {
                Content.Text += "<a href=\"?do=login\" class=\"button\">Login with <b>Google Accounts</b> using <b>OAuth 2</b></a>";
            }
        }
    }
}