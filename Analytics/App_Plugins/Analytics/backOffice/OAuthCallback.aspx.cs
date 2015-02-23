using System;
using Skybrud.Social.Google;
using Umbraco.Web.UI.Pages;
using umbraco;

namespace Analytics.App_Plugins.Analytics.BackOffice {

    public partial class OAuthCalllback : UmbracoEnsuredPage {

        protected void Page_Load(object sender, EventArgs e) {

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
                Content.Text = ui.Text("analytics", "informationSavedMessage", user.Name, UmbracoUser);
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