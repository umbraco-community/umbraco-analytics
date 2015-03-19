using System;
using System.Linq;
using System.Web;
using System.Web.Security;
using Skybrud.Social.Google;
using Umbraco.Web.UI.Pages;
using umbraco.BusinessLogic;
using Umbraco.Core.Security;
using Umbraco.Web;
using umbraco;

namespace Analytics.App_Plugins.Analytics.BackOffice {

    public partial class OAuthCalllback : UmbracoEnsuredPage {

        protected override void OnPreInit(EventArgs e) {

            base.OnPreInit(e);
            
            if (AnalyticsHelpers.UmbracoVersion != "7.2.2") return;

            // Handle authentication stuff to counteract bug in Umbraco 7.2.2 (see U4-6342)
            HttpContextWrapper http = new HttpContextWrapper(Context);
            FormsAuthenticationTicket ticket = http.GetUmbracoAuthTicket();
            http.AuthenticateCurrentRequest(ticket, true);
        
        }

        protected void Page_Load(object sender, EventArgs e)
        {
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

            // Get the state from the query string
            string state = Request.QueryString["state"];

            // Check whether the state is present
            if (String.IsNullOrWhiteSpace(state))
            {
                //Ouput an error message
                Content.Text += ui.Text("analytics", "noStateSpecified");
                return;
            }

            // Get the session value
            string session = Session["Analytics_" + state] as string;

            // Has the session expire?
            if (session == null)
            {
                //Ouput an error message
                Content.Text += ui.Text("analytics", "sorrySessionExpired");
                return;
            }

            // Get the refresh token from the query string (kinda bad practice though)
            string refreshToken = Request.QueryString["token"];

            // Do we have a refresh token?
            if (String.IsNullOrWhiteSpace(refreshToken))
            {
                //Ouput an error message
                Content.Text += ui.Text("analytics", "somethingWentWrong");
                return;
            }

            // Initalize a new instance of the GoogleService class
            GoogleService service = GoogleService.CreateFromRefreshToken(AnalyticsConfig.ClientId, AnalyticsConfig.ClientSecret, refreshToken);

            try {

                //Get the authenticated user
                GoogleUserInfo user = service.GetUserInfo();

                //Set the refresh token in our config
                AnalyticsConfig.RefreshToken = refreshToken;
                

                //Ouput some info about the user
                //Using UmbracoUser (obsolete) - somehow it fails to compile when using Security.CurrentUser
                //ui.text requires OLD BusinessLogic User object type not shiny new one
                //Can we use another helper/library to get the translation text?
                var umbUser = new User(currentUser.Id);
                Content.Text = ui.Text("analytics", "informationSavedMessage", user.Name, umbUser);
            } 
            catch
            {
                //Ouput an error message
                Content.Text += ui.Text("analytics", "somethingWentWrong");
            }

            // Clear the session state
            Session.Remove("Analytics_" + state);
        }

    }

}