
angular.module("umbraco.resources")
    .factory("settingsResource", function ($http) {
        return {
            
            checkauth: function () {
                return $http.get("Analytics/SettingsApi/GetAuth");
            },

            getall: function () {
                return $http.get("Analytics/SettingsApi/GetSettings");
            },

            save: function (settings) {
                return $http.post("Analytics/SettingsApi/PostSettings", angular.toJson(settings));
            },

            getaccounts: function () {
                return $http.get("Analytics/AnalyticsApi/GetAccounts");
            },

            getprofiles: function (accountId) {
                return $http.get("Analytics/AnalyticsApi/GetProfilesFromAccount?accountId=" + accountId);
            }

        };
    });