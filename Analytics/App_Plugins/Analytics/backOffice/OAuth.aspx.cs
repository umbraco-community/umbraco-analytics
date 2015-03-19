using System;
using System.Collections.Specialized;
using System.Linq;
using System.Web;
using System.Web.Security;
using Skybrud.Social;
using Umbraco.Web.UI.Pages;
using umbraco;
using Umbraco.Core.Security;
using Umbraco.Web;

namespace Analytics.App_Plugins.Analytics.BackOffice {

    public partial class OAuth : UmbracoEnsuredPage {

        protected override void OnPreInit(EventArgs e) {

            base.OnPreInit(e);
            
            if (AnalyticsHelpers.UmbracoVersion != "7.2.2") return;

            // Handle authentication stuff to counteract bug in Umbraco 7.2.2 (see U4-6342)
            HttpContextWrapper http = new HttpContextWrapper(Context);
            FormsAuthenticationTicket ticket = http.GetUmbracoAuthTicket();
            http.AuthenticateCurrentRequest(ticket, true);
        
        }

        protected void Page_Load(object sender, EventArgs e) {

            //Get current user
            var currentUser = UmbracoContext.Current.Security.CurrentUser;

            //Check a user is logged into backoffice
            if (currentUser == null)
            {
                //Ouput an error message
                Content.Text += ui.Text("analytics", "noAccess");
                return;
            }

            //Check the user has access to the analytics section
            //Prevents anyone with this URL to page from just hitting it
            if (!currentUser.AllowedSections.Contains("analytics"))
            {
                //Ouput an error message
                Content.Text += ui.Text("analytics", "noAccess");
                return;
            }

            // The Analytics authentication site should redirect back to this URI
            string callback = Request.Url.AbsoluteUri.Replace("/OAuth.aspx", "/OAuthCallback.aspx");

            // Generate a random state
            string state = Guid.NewGuid().ToString();

            // Add the state to the session
            Session.Add("Analytics_" + state, "#h5yr");

            // The query string to send to the authentication site
            NameValueCollection nvc = new NameValueCollection {
                { "clientcallback", callback },
                { "clientstate", state },
                { "lang", UmbracoContext.Current.Security.CurrentUser.Language }
            };

            // Generate the URL for the authentication page
            string oAuthUrl = "http://analytics-oauth.azurewebsites.net/callback/OAuth.aspx?" + SocialUtils.NameValueCollectionToQueryString(nvc);

            // Now redirect the user
            Response.Redirect(oAuthUrl);

        }

    }

}