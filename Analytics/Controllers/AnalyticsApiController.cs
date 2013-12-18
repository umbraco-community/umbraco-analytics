using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Google.Apis.Analytics.v3;
using Google.Apis.Analytics.v3.Data;
using Google.Apis.Auth.OAuth2.Mvc;
using Google.Apis.Services;
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
        private const string ApiKey             = "AIzaSyCMMjf1SMS3I_W1ls7nupRpXNuOOeQDD8s";
        private const string ApplicationName    = "Analytics for Umbraco";
        private const string ClientID           = "206456221167-1cm2983v0d6i5emt132316ommn6hsv8j.apps.googleusercontent.com";

        private GoogleService GetGoogleService() {
            return GoogleService.CreateFromRequestToken(AnalyticsConfig.ClientId, AnalyticsConfig.ClientSecret, AnalyticsConfig.RefreshToken);
        }

        public async Task<RealtimeData> GetRealTimeStats(CancellationToken cancellationToken)
        {
            // Register the base client (auth, api key etc..)
            var baseClient              = new BaseClientService.Initializer();
            baseClient.ApiKey           = ApiKey;
            baseClient.ApplicationName  = ApplicationName;

            //Setup API object
            var AnalyticsApi = new AnalyticsService(baseClient);

            //Get RealTime active:visitors for profile
            var getRealTimeVisitors = AnalyticsApi.Data.Realtime.Get("ga:12345", "ga:activeVisitors");

            //Excute the API command we want Async
            var result = await getRealTimeVisitors.ExecuteAsync();

            // Display the results.
            if (result != null)
            {
                return result;
            }

            return null;
        }

        public HttpResponseMessage GetAccounts() {

            // Get the accounts from the Google Analytics API
            AnalyticsAccount[] accounts = GetGoogleService().Analytics.GetAccounts().Items;

            // Return the accounts as JSON
            return Request.CreateResponse(HttpStatusCode.OK, accounts, Configuration.Formatters.JsonFormatter);

        }

        public HttpResponseMessage GetProfiles() {

            // Get the profiles from the Google Analytics API
            AnalyticsProfile[] profiles = GetGoogleService().Analytics.GetProfiles().Items;

            // Return the profiles as JSON
            return Request.CreateResponse(HttpStatusCode.OK, profiles, Configuration.Formatters.JsonFormatter);

        }

        public HttpResponseMessage GetVisits(string profile) {

            // Get the visits from the Google Analytics API
            AnalyticsDataResponse data = GetGoogleService().Analytics.GetData(
                profile,
                DateTime.Now.Subtract(TimeSpan.FromDays(31)),
                DateTime.Now,
                new [] { AnalyticsMetrics.Visits, AnalyticsMetrics.Pageviews },
                new[] { AnalyticsDimension.Date }
            );

            // Return the data as JSON
            return Request.CreateResponse(HttpStatusCode.OK, data, Configuration.Formatters.JsonFormatter);

        }
    
    }

}
