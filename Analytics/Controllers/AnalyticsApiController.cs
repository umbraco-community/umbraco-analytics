using System;
using System.Linq;
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
        /// Get Profiles from a specific Account ID
        /// </summary>
        /// <param name="accountId"></param>
        /// <returns></returns>
        public AnalyticsProfile[] GetProfilesFromAccount(string accountId)
        {
            //Get Account
            var account = GetGoogleService().Analytics.GetAccounts().Items.SingleOrDefault(x => x.Id == accountId);

            // Get the profiles from the Google Analytics API
            var profiles = GetGoogleService().Analytics.GetProfiles(account).Items;

            // Return the profiles
            return profiles;
        }



        /// <summary>
        /// Get Visits
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
                new[] { AnalyticsDimension.PagePath }
            );

            // Return the data as JSON
            return data;
        }

        /// <summary>
        /// Get Browser Vendors
        /// </summary>
        /// <param name="profile"></param>
        /// <returns></returns>
        public AnalyticsDataResponse GetBrowser(string profile)
        {
            //Profile, Start Date, End Date, Metrics (Array), Dimensions (Array)

            AnalyticsDataResponse data = GetGoogleService().Analytics.GetData(
                profile,
                DateTime.Now.Subtract(TimeSpan.FromDays(31)),
                DateTime.Now,
                new[] {AnalyticsMetrics.Visits, AnalyticsMetrics.Pageviews },
                new[] {AnalyticsDimension.Browser }
            );

            // Return the data as JSON
            return data;
        }

        /// <summary>
        /// Get Browser Specific Version
        /// </summary>
        /// <param name="profile"></param>
        /// <returns></returns>
        public AnalyticsDataResponse GetBrowserVersion(string profile)
        {
            //Profile, Start Date, End Date, Metrics (Array), Dimensions (Array)

            AnalyticsDataResponse data = GetGoogleService().Analytics.GetData(
                profile,
                DateTime.Now.Subtract(TimeSpan.FromDays(31)),
                DateTime.Now,
                new[] { AnalyticsMetrics.Visits, AnalyticsMetrics.Pageviews },
                new[] { AnalyticsDimension.Browser, AnalyticsDimension.BrowserVersion }
            );

            // Return the data as JSON
            return data;
        }

        /// <summary>
        /// Get Device Types
        /// </summary>
        /// <param name="profile"></param>
        /// <returns></returns>
        public AnalyticsDataResponse GetDeviceTypes(string profile)
        {
            //Profile, Start Date, End Date, Metrics (Array), Dimensions (Array)

            AnalyticsDataResponse data = GetGoogleService().Analytics.GetData(
                profile,
                DateTime.Now.Subtract(TimeSpan.FromDays(31)),
                DateTime.Now,
                new[] { AnalyticsMetrics.Visits, AnalyticsMetrics.Pageviews },
                new[] { AnalyticsDimension.DeviceCategory }
            );

            // Return the data as JSON
            return data;
        }

        /// <summary>
        /// Get Devices
        /// </summary>
        /// <param name="profile"></param>
        /// <returns></returns>
        public AnalyticsDataResponse GetDevices(string profile)
        {
            //Profile, Start Date, End Date, Metrics (Array), Dimensions (Array)

            AnalyticsDataResponse data = GetGoogleService().Analytics.GetData(
                profile,
                DateTime.Now.Subtract(TimeSpan.FromDays(31)),
                DateTime.Now,
                new[] { AnalyticsMetrics.Visits, AnalyticsMetrics.Pageviews },
                new[] { AnalyticsDimension.MobileDeviceBranding, AnalyticsDimension.MobileDeviceModel }
            );

            // Return the data as JSON
            return data;
        }

        /// <summary>
        /// Get Keywords
        /// </summary>
        /// <param name="profile"></param>
        /// <returns></returns>
        public AnalyticsDataResponse GetKeywords(string profile)
        {
            //Profile, Start Date, End Date, Metrics (Array), Dimensions (Array)

            AnalyticsDataResponse data = GetGoogleService().Analytics.GetData(
                profile,
                DateTime.Now.Subtract(TimeSpan.FromDays(31)),
                DateTime.Now,
                new[] { AnalyticsMetrics.Visits, AnalyticsMetrics.Pageviews },
                new[] { AnalyticsDimension.Keyword }
            );

            // Return the data as JSON
            return data;
        }

        /// <summary>
        /// Get Social Network Sources
        /// </summary>
        /// <param name="profile"></param>
        /// <returns></returns>
        public AnalyticsDataResponse GetSocialNetworkSources(string profile)
        {
            //Profile, Start Date, End Date, Metrics (Array), Dimensions (Array)

            AnalyticsDataResponse data = GetGoogleService().Analytics.GetData(
                profile,
                DateTime.Now.Subtract(TimeSpan.FromDays(31)),
                DateTime.Now,
                new[] { AnalyticsMetrics.Visits, AnalyticsMetrics.Pageviews },
                new[] { AnalyticsDimension.SocialNetwork }
            );

            // Return the data as JSON
            return data;
        }

        /// <summary>
        /// Get Sources
        /// </summary>
        /// <param name="profile"></param>
        /// <returns></returns>
        public AnalyticsDataResponse GetSources(string profile)
        {
            //Profile, Start Date, End Date, Metrics (Array), Dimensions (Array)

            AnalyticsDataResponse data = GetGoogleService().Analytics.GetData(
                profile,
                DateTime.Now.Subtract(TimeSpan.FromDays(31)),
                DateTime.Now,
                new[] { AnalyticsMetrics.Visits, AnalyticsMetrics.Pageviews },
                new[] { AnalyticsDimension.Source }
            );

            // Return the data as JSON
            return data;
        }

        /// <summary>
        /// Get the screen resolutions
        /// </summary>
        /// <param name="profile"></param>
        /// <returns></returns>
        public AnalyticsDataResponse GetScreenRes(string profile)
        {
            //Profile, Start Date, End Date, Metrics (Array), Dimensions (Array)

            AnalyticsDataResponse data = GetGoogleService().Analytics.GetData(
                profile,
                DateTime.Now.Subtract(TimeSpan.FromDays(31)),
                DateTime.Now,
                new[] { AnalyticsMetrics.Visits, AnalyticsMetrics.Pageviews },
                new[] { AnalyticsDimension.ScreenResolution }
            );

            // Return the data as JSON
            return data;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="profile"></param>
        /// <returns></returns>
        public AnalyticsDataResponse GetCountry(string profile)
        {
            //Profile, Start Date, End Date, Metrics (Array), Dimensions (Array)

            AnalyticsDataResponse data = GetGoogleService().Analytics.GetData(
                profile,
                DateTime.Now.Subtract(TimeSpan.FromDays(31)),
                DateTime.Now,
                new[] { AnalyticsMetrics.Visits, AnalyticsMetrics.Pageviews },
                new[] { AnalyticsDimension.Country }
            );

            // Return the data as JSON
            return data;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="profile"></param>
        /// <returns></returns>
        public AnalyticsDataResponse GetLanguage(string profile)
        {
            //Profile, Start Date, End Date, Metrics (Array), Dimensions (Array)

            AnalyticsDataResponse data = GetGoogleService().Analytics.GetData(
                profile,
                DateTime.Now.Subtract(TimeSpan.FromDays(31)),
                DateTime.Now,
                new[] { AnalyticsMetrics.Visits, AnalyticsMetrics.Pageviews },
                new[] { AnalyticsDimension.Language }
            );

            // Return the data as JSON
            return data;
        }
        
    }

}
