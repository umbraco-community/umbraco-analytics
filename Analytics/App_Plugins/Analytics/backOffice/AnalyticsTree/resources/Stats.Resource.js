
angular.module("umbraco.resources")
    .factory("statsResource", function ($http) {
        return {
            
            //TODO: Get Profile ID from saved profile in settings

            getlanguage: function () {
                return $http.get("Analytics/AnalyticsApi/GetLanguage?profile=95037");
            },

            getcountries: function () {
                return $http.get("Analytics/AnalyticsApi/GetCountry?profile=95037");
            },

            getbrowsers: function () {
                return $http.get("Analytics/AnalyticsApi/GetBrowser?profile=95037");
            },

            getbrowserspecifics: function () {
                return $http.get("Analytics/AnalyticsApi/GetBrowserVersion?profile=95037");
            },

            getdevicetypes: function () {
                return $http.get("Analytics/AnalyticsApi/GetDeviceTypes?profile=95037");
            },

            getdevices: function () {
                return $http.get("Analytics/AnalyticsApi/GetDevices?profile=95037");
            },

            getresolutions: function () {
                return $http.get("Analytics/AnalyticsApi/GetScreenRes?profile=95037");
            },

            getos: function () {
                return $http.get("Analytics/AnalyticsApi/GetOperatingSystems?profile=95037");
            },

            getsocialnetworks: function () {
                return $http.get("Analytics/AnalyticsApi/GetSocialNetworkSources?profile=95037");
            },

            getkeywords: function () {
                return $http.get("Analytics/AnalyticsApi/GetKeywords?profile=95037");
            },

            getvisits: function () {
                return $http.get("Analytics/AnalyticsApi/GetVisits?profile=95037");
            },

            getsources: function () {
                return $http.get("Analytics/AnalyticsApi/GetSources?profile=95037");
            },

        };
    });