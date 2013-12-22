using System;
using System.Collections.Specialized;
using Skybrud.Social;
using Skybrud.Social.Google.Analytics;
using Skybrud.Social.Google.Analytics.Objects;
using Skybrud.Social.Google.Analytics.Responses;

namespace Analytics.SkybrudSocialExtensionMethods {

    public static class GoogleAnalyticsExtensionMethods {

        public static string GetData(this AnalyticsRawEndpoint endpoint, AnalyticsProfile profile, DateTime startDate, DateTime endDate, string[] metrics, string[] dimensions, string[] filters, string[] sort) {
            return GetData(endpoint, profile.Id, startDate, endDate, metrics, dimensions, filters, sort);
        }

        public static string GetData(this AnalyticsRawEndpoint endpoint, string profileId, DateTime startDate, DateTime endDate, string[] metrics, string[] dimensions, string[] filters, string[] sort) {

            // Initialize the query string
            NameValueCollection query = new NameValueCollection();
            query.Add("ids", "ga:" + profileId);
            query.Add("start-date", startDate.ToString("yyyy-MM-dd"));
            query.Add("end-date", endDate.ToString("yyyy-MM-dd"));
            query.Add("metrics", String.Join(",", metrics));
            query.Add("dimensions", String.Join(",", dimensions));
            if (filters != null && filters.Length > 0) query.Add("filters", String.Join(",", filters));
            if (sort != null && sort.Length > 0) query.Add("sort", String.Join(",", sort));
            query.Add("access_token", endpoint.Client.AccessToken);

            // Make the call to the API
            return SocialUtils.DoHttpGetRequestAndGetBodyAsString("https://www.googleapis.com/analytics/v3/data/ga", query);

        }

        public static AnalyticsDataResponse GetData(this AnalyticsEndpoint endpoint, AnalyticsProfile profile, DateTime startDate, DateTime endDate, string[] metrics, string[] dimensions, string[] filters, string[] sort) {
            return AnalyticsDataResponse.ParseJson(endpoint.Service.Client.Analytics.GetData(profile, startDate, endDate, metrics, dimensions, filters, sort));
        }

        public static AnalyticsDataResponse GetData(this AnalyticsEndpoint endpoint, string profileId, DateTime startDate, DateTime endDate, string[] metrics, string[] dimensions, string[] filters, string[] sort) {
            return AnalyticsDataResponse.ParseJson(endpoint.Service.Client.Analytics.GetData(profileId, startDate, endDate, metrics, dimensions, filters, sort));
        }

    }

}
