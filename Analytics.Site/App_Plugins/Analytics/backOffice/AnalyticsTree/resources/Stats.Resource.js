
angular.module("umbraco.resources")
    .factory("statsResource", function ($http) {
        return {
            
            //TODO: Get Profile ID from saved profile in settings

            getlanguage: function (profileID) {
                return $http.get("Analytics/AnalyticsApi/GetLanguage?profile=" + profileID);
            },

            getcountries: function (profileID) {
                return $http.get("Analytics/AnalyticsApi/GetCountry?profile=" + profileID);
            },

            getbrowsers: function (profileID) {
                return $http.get("Analytics/AnalyticsApi/GetBrowser?profile=" + profileID);
            },

            getbrowserspecifics: function (profileID) {
                return $http.get("Analytics/AnalyticsApi/GetBrowserVersion?profile=" + profileID);
            },

            getdevicetypes: function (profileID) {
                return $http.get("Analytics/AnalyticsApi/GetDeviceTypes?profile=" + profileID);
            },

            getdevices: function (profileID) {
                return $http.get("Analytics/AnalyticsApi/GetDevices?profile=" + profileID);
            },

            getresolutions: function (profileID) {
                return $http.get("Analytics/AnalyticsApi/GetScreenRes?profile=" + profileID);
            },

            getos: function (profileID) {
                return $http.get("Analytics/AnalyticsApi/GetOperatingSystems?profile=" + profileID);
            },

            getosversions: function (profileID) {
                return $http.get("Analytics/AnalyticsApi/GetOperatingSystemVersions?profile=" + profileID);
            },

            getsocialnetworks: function (profileID) {
                return $http.get("Analytics/AnalyticsApi/GetSocialNetworkSources?profile=" + profileID);
            },

            getkeywords: function (profileID, startDate, endDate) {
                return $http.get("Analytics/AnalyticsApi/GetKeywords", { params: { profile: profileID, startDate: startDate, endDate: endDate } });
            },

            getvisits: function (profileID, startDate, endDate) {
                return $http.get("Analytics/AnalyticsApi/GetVisits", { params: { profile: profileID, startDate: startDate, endDate: endDate } });
            },

            getsources: function (profileID) {
                return $http.get("Analytics/AnalyticsApi/GetSources?profile=" + profileID);
            },

            getvisitcharts: function (profileID, startDate, endDate) {
                return $http.get("Analytics/AnalyticsApi/GetVisitsOverMonths", { params: { profile: profileID, startDate: startDate, endDate: endDate } });
            },

        };
    });