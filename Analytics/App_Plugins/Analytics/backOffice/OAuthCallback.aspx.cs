using System;
using Skybrud.Social.Google;
using Umbraco.Web.UI.Pages;

namespace Analytics.App_Plugins.Analytics.BackOffice {

    public partial class OAuthCalllback : UmbracoEnsuredPage {

        protected void Page_Load(object sender, EventArgs e) {

            // Get the state from the query string
            string state = Request.QueryString["state"];

            // Check whether the state is present
            if (String.IsNullOrWhiteSpace(state)) {
                Content.Text += "No state specified.";
                return;
            }

            // Get the session value
            string session = Session["Analytics_" + state] as string;

            // Has the session expire?
            if (session == null) {
                Content.Text += "Sorry - your session has most likely expired.";
                return;
            }

            // Get the refresh token from the query string (kinda bad practice though)
            string refreshToken = Request.QueryString["token"];

            // Do we have a refresh token?
            if (String.IsNullOrWhiteSpace(refreshToken)) {
                Content.Text += "Okay. Something went wrong.";
                return;
            }

            // Initalize a new instance of the GoogleService class
            GoogleService service = GoogleService.CreateFromRequestToken(AnalyticsConfig.ClientId, AnalyticsConfig.ClientSecret, refreshToken);

            try {

                GoogleUserInfo user = service.GetUserInfo();

                AnalyticsConfig.RefreshToken = refreshToken;

                Content.Text = "Hi there " + user.Name + ". We have saved your information to a config file, so Umbraco can pull stats from your Analytics account.";

            } catch {
                
                Content.Text += "Okay. Something went wrong.";
            
            }
        
        }

    }

}