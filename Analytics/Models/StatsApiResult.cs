using Skybrud.Social.Google.Analytics.Models.Data;

namespace Analytics.Models
{
    public class StatsApiResult
    {
        public AnalyticsDataCollection ApiResult { get; set; }

        public dynamic ChartData { get; set; }
    }
}
