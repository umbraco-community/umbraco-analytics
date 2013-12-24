using System;
using Skybrud.Social.Google;
using Umbraco.Web.UI.Pages;

namespace Analytics.App_Plugins.Analytics.BackOffice {

    public partial class OAuthCalllback : UmbracoEnsuredPage {

        protected void Page_Load(object sender, EventArgs e) {

            // Get the state from the query string
            string state = Request.QueryString["state"];

            // Check whether the state is present
            if (String.IsNullOrWhiteSpace(state))
            {
                //Ouput an error message
                Content.Text += "No state specified.";
                return;
            }

            // Get the session value
            string session = Session["Analytics_" + state] as string;

            // Has the session expire?
            if (session == null)
            {
                //Ouput an error message
                Content.Text += "Sorry - your session has most likely expired.";
                return;
            }

            // Get the refresh token from the query string (kinda bad practice though)
            string refreshToken = Request.QueryString["token"];

            // Do we have a refresh token?
            if (String.IsNullOrWhiteSpace(refreshToken))
            {
                //Ouput an error message
                Content.Text += "Okay. Something went wrong.";
                return;
            }

            // Initalize a new instance of the GoogleService class
            GoogleService service = GoogleService.CreateFromRequestToken(AnalyticsConfig.ClientId, AnalyticsConfig.ClientSecret, refreshToken);

            try {

                //Get the authenticated user
                GoogleUserInfo user = service.GetUserInfo();

                //Set the refresh token in our config
                AnalyticsConfig.RefreshToken = refreshToken;

                //Ouput some info about the user
                Content.Text = "Hi there " + user.Name + ". We have saved your information to a config file, so Umbraco can pull stats from your Analytics account.";
            } 
            catch
            {
                //Ouput an error message
                Content.Text += "Okay. Something went wrong.";
            }

            // Clear the session state
            Session.Remove("Analytics_" + state);

        }

    }

}