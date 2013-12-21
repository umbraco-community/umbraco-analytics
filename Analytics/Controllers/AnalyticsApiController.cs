using System;
using Skybrud.Social.Google;
using Skybrud.Social.Google.Analytics;
using Skybrud.Social.Google.Analytics.Objects;
using Skybrud.Social.Google.Analytics.Responses;
using Umbraco.Web.Mvc;
using Umbraco.Web.WebApi;

namespace Analytics.Controllers
{
    [PluginController("Analytics")]
    public class AnalyticsApiController : UmbracoAuthorizedApiController
    {  
        private GoogleService GetGoogleService() {
            return GoogleService.CreateFromRequestToken(AnalyticsConfig.ClientId, AnalyticsConfig.ClientSecret, AnalyticsConfig.RefreshToken);
        }

        /// <summary>
        /// Get's Accounts on this authenticated user account
        /// </summary>
        /// <returns></returns>
        public AnalyticsAccount[] GetAccounts()
        {
            // Get the accounts from the Google Analytics API
            AnalyticsAccount[] accounts = GetGoogleService().Analytics.GetAccounts().Items;

            return accounts;
        }

        /// <summary>
        /// Get's Profiles on this authenticated user account
        /// </summary>
        /// <returns></returns>
        public AnalyticsProfile[] GetProfiles()
        {

            // Get the profiles from the Google Analytics API
            AnalyticsProfile[] profiles = GetGoogleService().Analytics.GetProfiles().Items;

            // Return the profiles
            return profiles;
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="profile"></param>
        /// <returns></returns>
        public AnalyticsDataResponse GetVisits(string profile)
        {

            // Get the visits from the Google Analytics API
            AnalyticsDataResponse data = GetGoogleService().Analytics.GetData(
                profile,
                DateTime.Now.Subtract(TimeSpan.FromDays(31)),
                DateTime.Now,
                new [] { AnalyticsMetrics.Visits, AnalyticsMetrics.Pageviews },
                new[] { AnalyticsDimension.Date }
            );

            // Return the data as JSON
            return data;
        }
    
    }

}
