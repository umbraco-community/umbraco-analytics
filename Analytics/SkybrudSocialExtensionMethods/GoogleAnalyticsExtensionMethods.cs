using System;
using System.Collections.Specialized;
using Skybrud.Social;
using Skybrud.Social.Google.Analytics.Endpoints;
using Skybrud.Social.Google.Analytics.Endpoints.Raw;
using Skybrud.Social.Google.Analytics.Models.Profiles;
using Skybrud.Social.Google.Analytics.Responses.Data;
using Skybrud.Social.Http;

namespace Analytics.SkybrudSocialExtensionMethods
{

    public static class GoogleAnalyticsExtensionMethods {

        public static SocialHttpResponse GetData(this AnalyticsDataRawEndpoint endpoint, AnalyticsProfile profile, DateTime startDate, DateTime endDate, string[] metrics, string[] dimensions, string[] filters, string[] sort) {
            return GetData(endpoint, profile.Id, startDate, endDate, metrics, dimensions, filters, sort);
        }

        public static SocialHttpResponse GetData(this AnalyticsDataRawEndpoint endpoint, string profileId, DateTime startDate, DateTime endDate, string[] metrics, string[] dimensions, string[] filters, string[] sort) {

            // Initialize the query string
            SocialHttpQueryString query = new SocialHttpQueryString();
            query.Add("ids", "ga:" + profileId);
            query.Add("start-date", startDate.ToString("yyyy-MM-dd"));
            query.Add("end-date", endDate.ToString("yyyy-MM-dd"));
            query.Add("metrics", string.Join(",", metrics));
            query.Add("dimensions", string.Join(",", dimensions));
            if (filters != null && filters.Length > 0) query.Add("filters", string.Join(",", filters));
            if (sort != null && sort.Length > 0) query.Add("sort", string.Join(",", sort));
            query.Add("access_token", endpoint.Client.AccessToken);

            // Make the call to the API
            return SocialUtils.Http.DoHttpGetRequest("https://www.googleapis.com/analytics/v3/data/ga", query);

        }

        public static AnalyticsGetDataResponse GetData(this AnalyticsEndpoint endpoint, AnalyticsProfile profile, DateTime startDate, DateTime endDate, string[] metrics, string[] dimensions, string[] filters, string[] sort) {
            return AnalyticsGetDataResponse.ParseResponse(endpoint.Service.Client.Analytics.Data.GetData(profile, startDate, endDate, metrics, dimensions, filters, sort));
        }

        public static AnalyticsGetDataResponse GetData(this AnalyticsEndpoint endpoint, string profileId, DateTime startDate, DateTime endDate, string[] metrics, string[] dimensions, string[] filters, string[] sort) {
            return AnalyticsGetDataResponse.ParseResponse(endpoint.Service.Client.Analytics.Data.GetData(profileId, startDate, endDate, metrics, dimensions, filters, sort));
        }

    }

}
