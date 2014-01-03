
angular.module("umbraco.resources")
    .factory("statsResource", function ($http) {
        return {
            
            //TODO: Get Profile ID from saved profile in settings

            getlanguage: function (profileID, startDate, endDate) {
              
                return $http.get("Analytics/AnalyticsApi/GetLanguage", { params: { profile: profileID, startDate: startDate, endDate: endDate } });
            },

            getcountries: function (profileID, startDate, endDate) {
              
                return $http.get("Analytics/AnalyticsApi/GetCountry", { params: { profile: profileID, startDate: startDate, endDate: endDate } });
            },

            getbrowsers: function (profileID, startDate, endDate) {
              
                return $http.get("Analytics/AnalyticsApi/GetBrowser", { params: { profile: profileID, startDate: startDate, endDate: endDate } });
            },

            getbrowserspecifics: function (profileID, startDate, endDate) {
                
                return $http.get("Analytics/AnalyticsApi/GetBrowserVersion", { params: { profile: profileID, startDate: startDate, endDate: endDate } });
            },

            getdevicetypes: function (profileID, startDate, endDate) {
               
                return $http.get("Analytics/AnalyticsApi/GetDeviceTypes", { params: { profile: profileID, startDate: startDate, endDate: endDate } });
            },

            getdevices: function (profileID, startDate, endDate) {
               
                return $http.get("Analytics/AnalyticsApi/GetDevices", { params: { profile: profileID, startDate: startDate, endDate: endDate } });
            },

            getresolutions: function (profileID, startDate, endDate) {
              
                return $http.get("Analytics/AnalyticsApi/GetScreenRes", { params: { profile: profileID, startDate: startDate, endDate: endDate } });
            },

            getos: function (profileID, startDate, endDate) {
               
                return $http.get("Analytics/AnalyticsApi/GetOperatingSystems", { params: { profile: profileID, startDate: startDate, endDate: endDate } });
            },

            getosversions: function (profileID, startDate, endDate) {
               
                return $http.get("Analytics/AnalyticsApi//GetOperatingSystemVersions", { params: { profile: profileID, startDate: startDate, endDate: endDate } });
            },

            getsocialnetworks: function (profileID, startDate, endDate) {
               
                return $http.get("Analytics/AnalyticsApi/GetSocialNetworkSources", { params: { profile: profileID, startDate: startDate, endDate: endDate } });
            },

            getkeywords: function (profileID, startDate, endDate) {
                return $http.get("Analytics/AnalyticsApi/GetKeywords", { params: { profile: profileID, startDate: startDate, endDate: endDate } });
            },

            getvisits: function (profileID, startDate, endDate) {
                return $http.get("Analytics/AnalyticsApi/GetVisits", { params: { profile: profileID, startDate: startDate, endDate: endDate } });
            },

            getsources: function (profileID, startDate, endDate) {
               
                return $http.get("Analytics/AnalyticsApi/GetSources", { params: { profile: profileID, startDate: startDate, endDate: endDate } });
            },

            getvisitcharts: function (profileID, startDate, endDate) {
                return $http.get("Analytics/AnalyticsApi/GetVisitsOverMonths", { params: { profile: profileID, startDate: startDate, endDate: endDate } });
            },

        };
    });