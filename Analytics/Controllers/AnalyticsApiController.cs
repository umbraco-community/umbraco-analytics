using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Google.Apis.Analytics.v3;
using Google.Apis.Analytics.v3.Data;
using Google.Apis.Auth.OAuth2.Mvc;
using Google.Apis.Services;
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
    }
}
