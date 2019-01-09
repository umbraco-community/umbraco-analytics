using System;
using System.Linq;
using Analytics.Models;
using Skybrud.Social.Google.Analytics.Models.Accounts;
using Skybrud.Social.Google.Analytics.Models.Data;
using Skybrud.Social.Google.Analytics.Models.Dimensions;
using Skybrud.Social.Google.Analytics.Models.Metrics;
using Skybrud.Social.Google.Analytics.Models.Profiles;
using Skybrud.Social.Google.Analytics.Options.Data;
using Skybrud.Social.Google.Analytics.Options.Data.Sorting;
using Skybrud.Social.Google.Analytics.Options.Management;
using Skybrud.Social.Google.Common;
using Umbraco.Web.Mvc;
using Umbraco.Web.WebApi;

namespace Analytics.Controllers
{
    [PluginController("Analytics")]
    public class AnalyticsApiController : UmbracoAuthorizedApiController
    {  
        private GoogleService GetGoogleService() {
            return GoogleService.CreateFromRefreshToken(AnalyticsConfig.ClientId, AnalyticsConfig.ClientSecret, AnalyticsConfig.RefreshToken);
        }

        /// <summary>
        /// Get's Accounts on this authenticated user account
        /// </summary>
        /// <returns></returns>
        public AnalyticsAccount[] GetAccounts()
        {
            // Get the accounts from the Google Analytics API
            AnalyticsAccount[] accounts = GetGoogleService().Analytics.Management.GetAccounts().Body.Items;

            return accounts;
        }

        /// <summary>
        /// Get's Profiles on this authenticated user account
        /// </summary>
        /// <returns></returns>
        public AnalyticsProfile[] GetProfiles()
        {

            // Get the profiles from the Google Analytics API
            AnalyticsProfile[] profiles = GetGoogleService().Analytics.Management.GetProfiles().Body.Items;

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
            // Get the profiles from the Google Analytics API
            var profiles = GetGoogleService().Analytics.Management.GetProfiles().Body.Items.Where(x => x.AccountId == accountId).ToArray();

            // Return the profiles
            return profiles;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="profile"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        public ChartData GetVisitsOverTime(string profile, DateTime? startDate, DateTime? endDate)
        {
            if (!startDate.HasValue)
                startDate = DateTime.Now.Subtract(TimeSpan.FromDays(31));
            if (!endDate.HasValue)
                endDate = DateTime.Now;

            //Span of time
            TimeSpan span = endDate.Value - startDate.Value;

            //Dimensions that changes based on time period
            AnalyticsDimensionCollection dimensions;


            //If less than 60 days show days
            if (span.TotalDays < 60)
            {
                dimensions = AnalyticsDimensions.Year + AnalyticsDimensions.Month + AnalyticsDimensions.Day;
            }
            else
            {
                dimensions = AnalyticsDimensions.Year + AnalyticsDimensions.Month;
            }

            // Get the visits from the Google Analytics API
            AnalyticsDataCollection data = GetGoogleService().Analytics.Data.GetData(new AnalyticsGetDataOptions
            {
                ProfileId = profile,
                StartDate = startDate.Value,
                EndDate = endDate.Value,
                Metrics = AnalyticsMetrics.Sessions + AnalyticsMetrics.Pageviews,
                Dimensions = dimensions,
                Sorting = new AnalyticsDataSortOptions().AddDescending(AnalyticsDimensions.Year)
            }).Body;

            //Store API result in our new object along with chart data
            var visitsMonthResult = ChartHelper.GetLineChartData(data);   //Add chart data to device result via Helper

            // Return the data as JSON
            return visitsMonthResult;

        }

        /// <summary>
        /// Get Visits
        /// </summary>
        /// <param name="profile"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        public AnalyticsDataCollection GetVisits(string profile, DateTime? startDate, DateTime? endDate)
        {
            if (!startDate.HasValue)
                startDate = DateTime.Now.Subtract(TimeSpan.FromDays(31));
             if (!endDate.HasValue)
                 endDate = DateTime.Now;

            // Get the visits from the Google Analytics API
            AnalyticsDataCollection data = GetGoogleService().Analytics.Data.GetData(new AnalyticsGetDataOptions
            {
                ProfileId = profile,
                StartDate = startDate.Value,
                EndDate = endDate.Value,
                Metrics = AnalyticsMetrics.Sessions + AnalyticsMetrics.Pageviews,
                Dimensions = AnalyticsDimensions.PagePath,
                Sorting = new AnalyticsDataSortOptions().AddDescending(AnalyticsMetrics.Visits)
            }).Body;

            // Return the data as JSON
            return data;
        }

        /// <summary>
        /// Get Sources
        /// </summary>
        /// <param name="profile"></param>
        /// <returns></returns>
        public AnalyticsDataCollection GetSources(string profile, DateTime? startDate, DateTime? endDate)
        {
            if (!startDate.HasValue)
                startDate = DateTime.Now.Subtract(TimeSpan.FromDays(31));
            if (!endDate.HasValue)
                endDate = DateTime.Now;
            //Profile, Start Date, End Date, Metrics (Array), Dimensions (Array)

            AnalyticsDataCollection data = GetGoogleService().Analytics.Data.GetData(new AnalyticsGetDataOptions {
                ProfileId = profile,
                StartDate = startDate.Value,
                EndDate = endDate.Value,
                Metrics = AnalyticsMetrics.Sessions + AnalyticsMetrics.Pageviews,
                Dimensions = AnalyticsDimensions.Source,
                Sorting = new AnalyticsDataSortOptions().AddDescending(AnalyticsMetrics.Sessions)
            }).Body;            

            // Return the data as JSON
            return data;
        }

        /// <summary>
        /// Get Keywords
        /// </summary>
        /// <param name="profile"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        public StatsApiResult GetKeywords(string profile, DateTime? startDate, DateTime? endDate)
        {
            if (!startDate.HasValue)
                startDate = DateTime.Now.Subtract(TimeSpan.FromDays(31));
            if (!endDate.HasValue)
                endDate = DateTime.Now;

            //Profile, Start Date, End Date, Metrics (Array), Dimensions (Array)
            
            AnalyticsDataCollection data = GetGoogleService().Analytics.Data.GetData(new AnalyticsGetDataOptions
            {
                ProfileId = profile,
                StartDate = startDate.Value,
                EndDate = endDate.Value,
                Metrics = AnalyticsMetrics.Sessions + AnalyticsMetrics.Pageviews,
                Dimensions = AnalyticsDimensions.Keyword,
                Sorting = new AnalyticsDataSortOptions().AddDescending(AnalyticsMetrics.Sessions)
            }).Body;

            //Store API result in our new object along with chart data
            var keywordsResult          = new StatsApiResult();
            keywordsResult.ApiResult    = data;                             //The data back from Google's API
            keywordsResult.ChartData    = ChartHelper.GetChartData(data);   //Add chart data to device result via Helper

            // Return the data as JSON
            return keywordsResult;
        }

        /// <summary>
        /// Get Browser Vendors
        /// </summary>
        /// <param name="profile"></param>
        /// <returns></returns>
        public StatsApiResult GetBrowser(string profile, DateTime? startDate, DateTime? endDate)
        {
            if (!startDate.HasValue)
                startDate = DateTime.Now.Subtract(TimeSpan.FromDays(31));
            if (!endDate.HasValue)
                endDate = DateTime.Now;
            //Profile, Start Date, End Date, Metrics (Array), Dimensions (Array)

            AnalyticsDataCollection data = GetGoogleService().Analytics.Data.GetData(new AnalyticsGetDataOptions
            {
                ProfileId = profile,
                StartDate = startDate.Value,
                EndDate = endDate.Value,
                Metrics = AnalyticsMetrics.Sessions + AnalyticsMetrics.Pageviews,
                Dimensions = AnalyticsDimensions.Browser,
                Sorting = new AnalyticsDataSortOptions().AddDescending(AnalyticsMetrics.Sessions)
            }).Body;


            //Store API result in our new object along with chart data
            var browsersResult          = new StatsApiResult();
            browsersResult.ApiResult    = data;                             //The data back from Google's API
            browsersResult.ChartData    = ChartHelper.GetChartData(data);   //Add chart data to device result via Helper

            // Return the data as JSON
            return browsersResult;
        }

        /// <summary>
        /// Get Browser Specific Version
        /// </summary>
        /// <param name="profile"></param>
        /// <returns></returns>
        public StatsApiResult GetBrowserVersion(string profile, DateTime? startDate, DateTime? endDate)
        {
            if (!startDate.HasValue)
                startDate = DateTime.Now.Subtract(TimeSpan.FromDays(31));
            if (!endDate.HasValue)
                endDate = DateTime.Now;
            //Profile, Start Date, End Date, Metrics (Array), Dimensions (Array)

            AnalyticsDataCollection data = GetGoogleService().Analytics.Data.GetData(new AnalyticsGetDataOptions
            {
                ProfileId = profile,
                StartDate = startDate.Value,
                EndDate = endDate.Value,
                Metrics = AnalyticsMetrics.Sessions + AnalyticsMetrics.Pageviews,
                Dimensions = AnalyticsDimensions.Browser + AnalyticsDimensions.BrowserVersion,
                Sorting = new AnalyticsDataSortOptions().AddDescending(AnalyticsMetrics.Sessions)
            }).Body;

            //Store API result in our new object along with chart data
            var browserVersionsResult       = new StatsApiResult();
            browserVersionsResult.ApiResult = data;                             //The data back from Google's API
            browserVersionsResult.ChartData = ChartHelper.GetChartData(data);   //Add chart data to device result via Helper

            // Return the data as JSON
            return browserVersionsResult;
        }

        /// <summary>
        /// Get Device Types
        /// </summary>
        /// <param name="profile"></param>
        /// <returns></returns>
        public StatsApiResult GetDeviceTypes(string profile, DateTime? startDate, DateTime? endDate)
        {
            if (!startDate.HasValue)
                startDate = DateTime.Now.Subtract(TimeSpan.FromDays(31));
            if (!endDate.HasValue)
                endDate = DateTime.Now;
            //Profile, Start Date, End Date, Metrics (Array), Dimensions (Array)

            AnalyticsDataCollection data = GetGoogleService().Analytics.Data.GetData(new AnalyticsGetDataOptions
            {
                ProfileId = profile,
                StartDate = startDate.Value,
                EndDate = endDate.Value,
                Metrics = AnalyticsMetrics.Sessions + AnalyticsMetrics.Pageviews,
                Dimensions = AnalyticsDimensions.DeviceCategory,
                Sorting = new AnalyticsDataSortOptions().AddDescending(AnalyticsMetrics.Sessions)
            }).Body;

            //Store API result in our new object along with chart data
            var deviceResult        = new StatsApiResult();
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
        public StatsApiResult GetDevices(string profile, DateTime? startDate, DateTime? endDate)
        {
            if (!startDate.HasValue)
                startDate = DateTime.Now.Subtract(TimeSpan.FromDays(31));
            if (!endDate.HasValue)
                endDate = DateTime.Now;
            //Profile, Start Date, End Date, Metrics (Array), Dimensions (Array)
            
            AnalyticsDataCollection data = GetGoogleService().Analytics.Data.GetData(new AnalyticsGetDataOptions
            {
                ProfileId = profile,
                StartDate = startDate.Value,
                EndDate = endDate.Value,
                Metrics = AnalyticsMetrics.Sessions + AnalyticsMetrics.Pageviews,
                Dimensions = AnalyticsDimensions.MobileDeviceBranding + AnalyticsDimensions.MobileDeviceModel,
                Sorting = new AnalyticsDataSortOptions().AddDescending(AnalyticsMetrics.Sessions)
            }).Body;

            //Store API result in our new object along with chart data
            var devicesResult = new StatsApiResult();
            devicesResult.ApiResult = data;                             //The data back from Google's API
            devicesResult.ChartData = ChartHelper.GetChartData(data);   //Add chart data to device result via Helper

            // Return the data as JSON
            return devicesResult;
        }


        /// <summary>
        /// Get Social Network Sources
        /// </summary>
        /// <param name="profile"></param>
        /// <returns></returns>
        public StatsApiResult GetSocialNetworkSources(string profile, DateTime? startDate, DateTime? endDate)
        {
            if (!startDate.HasValue)
                startDate = DateTime.Now.Subtract(TimeSpan.FromDays(31));
            if (!endDate.HasValue)
                endDate = DateTime.Now;
            //Profile, Start Date, End Date, Metrics (Array), Dimensions (Array)

            AnalyticsDataCollection data = GetGoogleService().Analytics.Data.GetData(new AnalyticsGetDataOptions
            {
                ProfileId = profile,
                StartDate = startDate.Value,
                EndDate = endDate.Value,
                Metrics = AnalyticsMetrics.Sessions + AnalyticsMetrics.Pageviews,
                Dimensions = AnalyticsDimensions.SocialNetwork,
                Sorting = new AnalyticsDataSortOptions().AddDescending(AnalyticsMetrics.Sessions)
            }).Body;

            //Store API result in our new object along with chart data
            var socialResult       = new StatsApiResult();
            socialResult.ApiResult = data;                             //The data back from Google's API
            socialResult.ChartData = ChartHelper.GetChartData(data);   //Add chart data to device result via Helper

            // Return the data as JSON
            return socialResult;
        }

        /// <summary>
        /// Get Operating System Info
        /// </summary>
        /// <param name="profile"></param>
        /// <returns></returns>
        public StatsApiResult GetOperatingSystems(string profile, DateTime? startDate, DateTime? endDate)
        {
            if (!startDate.HasValue)
                startDate = DateTime.Now.Subtract(TimeSpan.FromDays(31));
            if (!endDate.HasValue)
                endDate = DateTime.Now;
            //Profile, Start Date, End Date, Metrics (Array), Dimensions (Array)

            AnalyticsDataCollection data = GetGoogleService().Analytics.Data.GetData(new AnalyticsGetDataOptions
            {
                ProfileId = profile,
                StartDate = startDate.Value,
                EndDate = endDate.Value,
                Metrics = AnalyticsMetrics.Sessions + AnalyticsMetrics.Pageviews,
                Dimensions = AnalyticsDimensions.OperatingSystem,
                Sorting = new AnalyticsDataSortOptions().AddDescending(AnalyticsMetrics.Sessions)
            }).Body;

            //Store API result in our new object along with chart data
            var osResult        = new StatsApiResult();
            osResult.ApiResult  = data;                             //The data back from Google's API
            osResult.ChartData  = ChartHelper.GetChartData(data);   //Add chart data to device result via Helper

            // Return the data as JSON
            return osResult;
        }

        /// <summary>
        /// Get Operating System Version Info
        /// </summary>
        /// <param name="profile"></param>
        /// <returns></returns>
        public StatsApiResult GetOperatingSystemVersions(string profile, DateTime? startDate, DateTime? endDate)
        {
            if (!startDate.HasValue)
                startDate = DateTime.Now.Subtract(TimeSpan.FromDays(31));
            if (!endDate.HasValue)
                endDate = DateTime.Now;
            //Profile, Start Date, End Date, Metrics (Array), Dimensions (Array)
            
            AnalyticsDataCollection data = GetGoogleService().Analytics.Data.GetData(new AnalyticsGetDataOptions
            {
                ProfileId = profile,
                StartDate = startDate.Value,
                EndDate = endDate.Value,
                Metrics = AnalyticsMetrics.Sessions + AnalyticsMetrics.Pageviews,
                Dimensions = AnalyticsDimensions.OperatingSystem + AnalyticsDimensions.OperatingSystemVersion,
                Sorting = new AnalyticsDataSortOptions().AddDescending(AnalyticsMetrics.Sessions)
            }).Body;

            //Store API result in our new object along with chart data
            var osVersionResult         = new StatsApiResult();
            osVersionResult.ApiResult   = data;                             //The data back from Google's API
            osVersionResult.ChartData   = ChartHelper.GetChartData(data);   //Add chart data to device result via Helper

            // Return the data as JSON
            return osVersionResult;
        }



        /// <summary>
        /// Get the screen resolutions
        /// </summary>
        /// <param name="profile"></param>
        /// <returns></returns>
        public AnalyticsDataCollection GetScreenRes(string profile, DateTime? startDate, DateTime? endDate)
        {
            if (!startDate.HasValue)
                startDate = DateTime.Now.Subtract(TimeSpan.FromDays(31));
            if (!endDate.HasValue)
                endDate = DateTime.Now;
            //Profile, Start Date, End Date, Metrics (Array), Dimensions (Array)
            
            AnalyticsDataCollection data = GetGoogleService().Analytics.Data.GetData(new AnalyticsGetDataOptions
            {
                ProfileId = profile,
                StartDate = startDate.Value,
                EndDate = endDate.Value,
                Metrics = AnalyticsMetrics.Sessions + AnalyticsMetrics.Pageviews,
                Dimensions = AnalyticsDimensions.ScreenResolution,
                Sorting = new AnalyticsDataSortOptions().AddDescending(AnalyticsMetrics.Sessions)
            }).Body;

            // Return the data as JSON
            return data;
        }

        /// <summary>
        /// Get the Countries
        /// </summary>
        /// <param name="profile"></param>
        /// <returns></returns>
        public StatsApiResult GetCountry(string profile, DateTime? startDate, DateTime? endDate)
        {
            if (!startDate.HasValue)
                startDate = DateTime.Now.Subtract(TimeSpan.FromDays(31));
            if (!endDate.HasValue)
                endDate = DateTime.Now;
            //Profile, Start Date, End Date, Metrics (Array), Dimensions (Array)

            AnalyticsDataCollection data = GetGoogleService().Analytics.Data.GetData(new AnalyticsGetDataOptions
            {
                ProfileId = profile,
                StartDate = startDate.Value,
                EndDate = endDate.Value,
                Metrics = AnalyticsMetrics.Sessions + AnalyticsMetrics.Pageviews,
                Dimensions = AnalyticsDimensions.Country,
                Sorting = new AnalyticsDataSortOptions().AddDescending(AnalyticsMetrics.Sessions)
            }).Body;

            //Store API result in our new object along with chart data
            var countryResult       = new StatsApiResult();
            countryResult.ApiResult = data;                                 //The data back from Google's API
            countryResult.ChartData = ChartHelper.GetGeoChartData(data);    //Add chart data to device result via Helper

            // Return the data as JSON
            return countryResult;
        }

        /// <summary>
        /// Get the Languages
        /// </summary>
        /// <param name="profile"></param>
        /// <returns></returns>
        public AnalyticsDataCollection GetLanguage(string profile, DateTime? startDate, DateTime? endDate)
        {
            if (!startDate.HasValue)
                startDate = DateTime.Now.Subtract(TimeSpan.FromDays(31));
            if (!endDate.HasValue)
                endDate = DateTime.Now;
            //Profile, Start Date, End Date, Metrics (Array), Dimensions (Array)
            
            AnalyticsDataCollection data = GetGoogleService().Analytics.Data.GetData(new AnalyticsGetDataOptions
            {
                ProfileId = profile,
                StartDate = startDate.Value,
                EndDate = endDate.Value,
                Metrics = AnalyticsMetrics.Sessions + AnalyticsMetrics.Pageviews,
                Dimensions = AnalyticsDimensions.Language,
                Sorting = new AnalyticsDataSortOptions().AddDescending(AnalyticsMetrics.Sessions)
            }).Body;

            // Return the data as JSON
            return data;
        }


        /// <summary>
        /// Get Transactions
        /// </summary>
        /// <param name="profile"></param>
        /// <returns></returns>
        public StatsApiResult GetTransactions(string profile, DateTime? startDate, DateTime? endDate)
        {
            if (!startDate.HasValue)
                startDate = DateTime.Now.Subtract(TimeSpan.FromDays(31));
            if (!endDate.HasValue)
                endDate = DateTime.Now;
            //Profile, Start Date, End Date, Metrics (Array), Dimensions (Array)
            
            AnalyticsDataCollection data = GetGoogleService().Analytics.Data.GetData(new AnalyticsGetDataOptions
            {
                ProfileId = profile,
                StartDate = startDate.Value,
                EndDate = endDate.Value,
                Metrics = AnalyticsMetrics.Transactions + AnalyticsMetrics.TransactionRevenue,
                Dimensions = AnalyticsDimensions.TransactionId,
                Sorting = new AnalyticsDataSortOptions().AddDescending(AnalyticsMetrics.Transactions)
            }).Body;

            //Store API result in our new object along with chart data
            var transactionsResult = new StatsApiResult();
            transactionsResult.ApiResult = data;                             //The data back from Google's API
            transactionsResult.ChartData = ChartHelper.GetChartData(data);   //Add chart data to device result via Helper

            // Return the data as JSON
            return transactionsResult;
        }


        /// <summary>
        /// Get Transactions over time
        /// </summary>
        /// <param name="profile"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        public ChartData GetTransactionsOverTime(string profile, DateTime? startDate, DateTime? endDate)
        {
            if (!startDate.HasValue)
                startDate = DateTime.Now.Subtract(TimeSpan.FromDays(31));
            if (!endDate.HasValue)
                endDate = DateTime.Now;

            //Span of time
            TimeSpan span = endDate.Value - startDate.Value;

            //Dimensions that changes based on time period
            AnalyticsDimensionCollection dimensions;


            //If less than 60 days show days
            if (span.TotalDays < 60)
            {
                dimensions = AnalyticsDimensions.Year + AnalyticsDimensions.Month + AnalyticsDimensions.Day;
            }
            else
            {
                dimensions = AnalyticsDimensions.Year + AnalyticsDimensions.Month;
            }



            // Get the visits from the Google Analytics API
            AnalyticsDataCollection data = GetGoogleService().Analytics.Data.GetData(new AnalyticsGetDataOptions
            {
                ProfileId = profile,
                StartDate = startDate.Value,
                EndDate = endDate.Value,
                Metrics = AnalyticsMetrics.Transactions,
                Dimensions = AnalyticsDimensions.TransactionId,
                Sorting = new AnalyticsDataSortOptions().AddDescending(AnalyticsDimensions.Year)
            }).Body;

            //Store API result in our new object along with chart data
            var transactionsResult = ChartHelper.GetLineChartData(data);   //Add chart data to device result via Helper

            // Return the data as JSON
            return transactionsResult;

        }

        /// <summary>
        /// Get Product Performance
        /// </summary>
        /// <param name="profile"></param>
        /// <returns></returns>
        public StatsApiResult GetProductPerformance(string profile, DateTime? startDate, DateTime? endDate)
        {
            if (!startDate.HasValue)
                startDate = DateTime.Now.Subtract(TimeSpan.FromDays(31));
            if (!endDate.HasValue)
                endDate = DateTime.Now;

            //Profile, Start Date, End Date, Metrics (Array), Dimensions (Array)
            AnalyticsDataCollection data = GetGoogleService().Analytics.Data.GetData(new AnalyticsGetDataOptions
            {
                ProfileId = profile,
                StartDate = startDate.Value,
                EndDate = endDate.Value,
                Metrics = AnalyticsMetrics.UniquePurchases + AnalyticsMetrics.ItemRevenue + AnalyticsMetrics.RevenuePerItem + AnalyticsMetrics.ItemsPerPurchase,
                Dimensions = AnalyticsDimensions.ProductSku + AnalyticsDimensions.ProductName,
                Sorting = new AnalyticsDataSortOptions().AddDescending(AnalyticsMetrics.ItemRevenue)
            }).Body;

            //Store API result in our new object along with chart data
            var productsResult = new StatsApiResult();
            productsResult.ApiResult = data;                             //The data back from Google's API
            productsResult.ChartData = ChartHelper.GetChartData(data);   //Add chart data to device result via Helper

            // Return the data as JSON
            return productsResult;
        }

        /// <summary>
        /// Get Product Performance Over Time
        /// </summary>
        /// <param name="profile"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        public ChartData GetProductPerformanceOverTime(string profile, DateTime? startDate, DateTime? endDate)
        {
            if (!startDate.HasValue)
                startDate = DateTime.Now.Subtract(TimeSpan.FromDays(31));
            if (!endDate.HasValue)
                endDate = DateTime.Now;

            //Span of time
            TimeSpan span = endDate.Value - startDate.Value;

            //Dimensions that changes based on time period
            AnalyticsDimensionCollection dimensions;

            //If less than 60 days show days
            if (span.TotalDays < 60)
            {
                dimensions = AnalyticsDimensions.Year + AnalyticsDimensions.Month + AnalyticsDimensions.Day;
            }
            else
            {
                dimensions = AnalyticsDimensions.Year + AnalyticsDimensions.Month;
            }
            
            // Get the visits from the Google Analytics API
            AnalyticsDataCollection data = GetGoogleService().Analytics.Data.GetData(new AnalyticsGetDataOptions
            {
                ProfileId = profile,
                StartDate = startDate.Value,
                EndDate = endDate.Value,
                Metrics = AnalyticsMetrics.UniquePurchases,
                Dimensions = AnalyticsDimensions.ProductSku + AnalyticsDimensions.ProductName,
                Sorting = new AnalyticsDataSortOptions().AddDescending(AnalyticsMetrics.UniquePurchases)
            }).Body;

            //Store API result in our new object along with chart data
            var transactionsResult = ChartHelper.GetLineChartData(data);   //Add chart data to device result via Helper

            // Return the data as JSON
            return transactionsResult;

        }

        /// <summary>
        /// Get Sales Performance
        /// </summary>
        /// <param name="profile"></param>
        /// <returns></returns>
        public StatsApiResult GetSalesPerformance(string profile, DateTime? startDate, DateTime? endDate)
        {
            if (!startDate.HasValue)
                startDate = DateTime.Now.Subtract(TimeSpan.FromDays(31));
            if (!endDate.HasValue)
                endDate = DateTime.Now;
            //Profile, Start Date, End Date, Metrics (Array), Dimensions (Array)
            
            AnalyticsDataCollection data = GetGoogleService().Analytics.Data.GetData(new AnalyticsGetDataOptions
            {
                ProfileId = profile,
                StartDate = startDate.Value,
                EndDate = endDate.Value,
                Metrics = AnalyticsMetrics.TransactionRevenue + AnalyticsMetrics.UniquePurchases,
                Dimensions = AnalyticsDimensions.Date,
                Sorting = new AnalyticsDataSortOptions().AddDescending(AnalyticsMetrics.TransactionRevenue)
            }).Body;

            //Store API result in our new object along with chart data
            var salesResult = new StatsApiResult();
            salesResult.ApiResult = data;                             //The data back from Google's API
            salesResult.ChartData = ChartHelper.GetChartData(data);   //Add chart data to device result via Helper

            // Return the data as JSON
            return salesResult;
        }

        /// <summary>
        /// Get Sales Performance Over Time
        /// </summary>
        /// <param name="profile"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        public ChartData GetSalesPerformanceOverTime(string profile, DateTime? startDate, DateTime? endDate)
        {
            if (!startDate.HasValue)
                startDate = DateTime.Now.Subtract(TimeSpan.FromDays(31));
            if (!endDate.HasValue)
                endDate = DateTime.Now;

            //Span of time
            TimeSpan span = endDate.Value - startDate.Value;

            //Dimensions that changes based on time period
            AnalyticsDimensionCollection dimensions;

            //If less than 60 days show days
            if (span.TotalDays < 60)
            {
                dimensions = AnalyticsDimensions.Year + AnalyticsDimensions.Month + AnalyticsDimensions.Day;
            }
            else
            {
                dimensions = AnalyticsDimensions.Year + AnalyticsDimensions.Month;
            }

            // Get the visits from the Google Analytics API
            AnalyticsDataCollection data = GetGoogleService().Analytics.Data.GetData(new AnalyticsGetDataOptions
            {
                ProfileId = profile,
                StartDate = startDate.Value,
                EndDate = endDate.Value,
                Metrics = AnalyticsMetrics.TransactionRevenue,
                Dimensions = dimensions,
                Sorting = new AnalyticsDataSortOptions().AddDescending(AnalyticsMetrics.TransactionRevenue)
            }).Body;

            //Store API result in our new object along with chart data
            var transactionsResult = ChartHelper.GetLineChartData(data);   //Add chart data to device result via Helper

            // Return the data as JSON
            return transactionsResult;

        }

        /// <summary>
        /// Get Store Details
        /// </summary>
        /// <param name="profile"></param>
        /// <returns></returns>
        public StatsApiResult GetStoreDetails(string profile, DateTime? startDate, DateTime? endDate)
        {
            if (!startDate.HasValue)
                startDate = DateTime.Now.Subtract(TimeSpan.FromDays(31));
            if (!endDate.HasValue)
                endDate = DateTime.Now;
            //Profile, Start Date, End Date, Metrics (Array), Dimensions (Array)

            AnalyticsDataCollection data = GetGoogleService().Analytics.Data.GetData(new AnalyticsGetDataOptions
            {
                ProfileId = profile,
                StartDate = startDate.Value,
                EndDate = endDate.Value,
                Metrics = AnalyticsMetrics.Transactions + AnalyticsMetrics.TransactionRevenue + AnalyticsMetrics.ItemsPerPurchase + AnalyticsMetrics.ItemQuantity + AnalyticsMetrics.TransactionsPerSession,
                Dimensions = null,
                Sorting = new AnalyticsDataSortOptions().AddDescending(AnalyticsMetrics.TransactionRevenue)
            }).Body;

            //Store API result in our new object along with chart data
            var productsResult = new StatsApiResult();
            productsResult.ApiResult = data;                             //The data back from Google's API
            productsResult.ChartData = ChartHelper.GetChartData(data);   //Add chart data to device result via Helper

            // Return the data as JSON
            return productsResult;
        }

        /// <summary>
        /// Get Best Sellers
        /// </summary>
        /// <param name="profile"></param>
        /// <returns></returns>
        public StatsApiResult GetBestSellers(string profile, DateTime? startDate, DateTime? endDate)
        {
            if (!startDate.HasValue)
                startDate = DateTime.Now.Subtract(TimeSpan.FromDays(31));
            if (!endDate.HasValue)
                endDate = DateTime.Now;
            //Profile, Start Date, End Date, Metrics (Array), Dimensions (Array)

            AnalyticsDataCollection data = GetGoogleService().Analytics.Data.GetData(new AnalyticsGetDataOptions
            {
                ProfileId = profile,
                StartDate = startDate.Value,
                EndDate = endDate.Value,
                Metrics = AnalyticsMetrics.UniquePurchases + AnalyticsMetrics.ItemRevenue,
                Dimensions = AnalyticsDimensions.ProductSku + AnalyticsDimensions.ProductName,
                Sorting = new AnalyticsDataSortOptions().AddDescending(AnalyticsMetrics.ItemRevenue)
            }).Body;

            //Store API result in our new object along with chart data
            var productsResult = new StatsApiResult();
            productsResult.ApiResult = data;                             //The data back from Google's API
            productsResult.ChartData = ChartHelper.GetChartData(data);   //Add chart data to device result via Helper

            // Return the data as JSON
            return productsResult;
        }

        /// <summary>
        /// Get Revenue Per Source
        /// </summary>
        /// <param name="profile"></param>
        /// <returns></returns>
        public StatsApiResult GetRevenuePerSource(string profile, DateTime? startDate, DateTime? endDate)
        {
            if (!startDate.HasValue)
                startDate = DateTime.Now.Subtract(TimeSpan.FromDays(31));
            if (!endDate.HasValue)
                endDate = DateTime.Now;
            //Profile, Start Date, End Date, Metrics (Array), Dimensions (Array)

            AnalyticsDataCollection data = GetGoogleService().Analytics.Data.GetData(new AnalyticsGetDataOptions
            {
                ProfileId = profile,
                StartDate = startDate.Value,
                EndDate = endDate.Value,
                Metrics = AnalyticsMetrics.Transactions + AnalyticsMetrics.TransactionRevenue,
                Dimensions = AnalyticsDimensions.Source + AnalyticsDimensions.Keyword,
                Sorting = new AnalyticsDataSortOptions().AddDescending(AnalyticsMetrics.TransactionRevenue)
            }).Body;

            //Store API result in our new object along with chart data
            var sourceResult = new StatsApiResult();
            sourceResult.ApiResult = data;                             //The data back from Google's API
            sourceResult.ChartData = ChartHelper.GetChartData(data);   //Add chart data to device result via Helper

            // Return the data as JSON
            return sourceResult;
        }
    }

}
