using Skybrud.Social.Google.Analytics.Responses;

namespace Analytics.Models
{
    public class StatsApiResult
    {
        public AnalyticsDataResponse ApiResult { get; set; }

        public dynamic ChartData { get; set; }
    }
}
