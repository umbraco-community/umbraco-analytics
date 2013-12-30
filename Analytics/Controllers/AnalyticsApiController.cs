using System;
using System.Collections.Generic;
using System.Linq;
using Analytics.Models;
using Skybrud.Social.Google;
using Skybrud.Social.Google.Analytics;
using Skybrud.Social.Google.Analytics.Objects;
using Skybrud.Social.Google.Analytics.Responses;
using Umbraco.Web.Mvc;
using Umbraco.Web.WebApi;
using Analytics.SkybrudSocialExtensionMethods;

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
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        public AnalyticsDataResponse GetVisits(string profile, DateTime? startDate, DateTime? endDate)
        {
            if (!startDate.HasValue)
                startDate = DateTime.Now.Subtract(TimeSpan.FromDays(31));
             if (!endDate.HasValue)
                 endDate = DateTime.Now;

            // Get the visits from the Google Analytics API
            AnalyticsDataResponse data = GetGoogleService().Analytics.GetData(
                profile,
                startDate.Value,
                endDate.Value,
                new [] { AnalyticsMetrics.Visits, AnalyticsMetrics.Pageviews },
                new[] { AnalyticsDimension.PagePath },
                null,
                new[] { "-" + AnalyticsMetrics.Visits }
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
                new[] { AnalyticsDimension.Source },
                null,
                new[] { "-" + AnalyticsMetrics.Visits }
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
                new[] { AnalyticsDimension.Keyword },
                null,
                new[] { "-" + AnalyticsMetrics.Visits }
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
                new[] {AnalyticsDimension.Browser },
                null,
                new []{ "-" + AnalyticsMetrics.Visits }
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
                new[] { AnalyticsDimension.Browser, AnalyticsDimension.BrowserVersion },
                null,
                new[] { "-" + AnalyticsMetrics.Visits }
            );

            // Return the data as JSON
            return data;
        }

        /// <summary>
        /// Get Device Types
        /// </summary>
        /// <param name="profile"></param>
        /// <returns></returns>
        public DeviceTypeResult GetDeviceTypes(string profile)
        {
            //Profile, Start Date, End Date, Metrics (Array), Dimensions (Array)

            AnalyticsDataResponse data = GetGoogleService().Analytics.GetData(
                profile,
                DateTime.Now.Subtract(TimeSpan.FromDays(31)),
                DateTime.Now,
                new[] { AnalyticsMetrics.Visits, AnalyticsMetrics.Pageviews },
                new[] { AnalyticsDimension.DeviceCategory },
                null,
                new[] { "-" + AnalyticsMetrics.Visits }
            );

            //Store API result in our new object along with chart data
            var deviceResult        = new DeviceTypeResult();
            deviceResult.ApiResult  = data;                             //The data back from Google's API
            deviceResult.ChartData  = ChartHelper.GetChartData(data);   //Add chart data to device result via Helper
            
            // Return the data as JSON
            return deviceResult;
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
                new[] { AnalyticsDimension.MobileDeviceBranding, AnalyticsDimension.MobileDeviceModel },
                null,
                new[] { "-" + AnalyticsMetrics.Visits }
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
                new[] { AnalyticsDimension.SocialNetwork },
                null,
                new[] { "-" + AnalyticsMetrics.Visits }
            );

            // Return the data as JSON
            return data;
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="profile"></param>
        /// <returns></returns>
        public AnalyticsDataResponse GetOperatingSystems(string profile)
        {
            //Profile, Start Date, End Date, Metrics (Array), Dimensions (Array)

            AnalyticsDataResponse data = GetGoogleService().Analytics.GetData(
                profile,
                DateTime.Now.Subtract(TimeSpan.FromDays(31)),
                DateTime.Now,
                new[] { AnalyticsMetrics.Visits, AnalyticsMetrics.Pageviews },
                new[] { AnalyticsDimension.OperatingSystem, AnalyticsDimension.OperatingSystemVersion },
                null,
                new[] { "-" + AnalyticsMetrics.Visits }
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
                new[] { AnalyticsDimension.ScreenResolution },
                null,
                new[] { "-" + AnalyticsMetrics.Visits }
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
                new[] { AnalyticsDimension.Country },
                null,
                new[] { "-" + AnalyticsMetrics.Visits }
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
                new[] { AnalyticsDimension.Language },
                null,
                new[] { "-" + AnalyticsMetrics.Visits }
            );

            // Return the data as JSON
            return data;
        }
        
    }

}
