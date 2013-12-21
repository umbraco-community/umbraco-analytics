
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
            },

            saveAccount: function (accountData, profileData) {

                //Merge the two JSON objects into one
                var postData = jQuery.extend(accountData, profileData);
                console.log("Values in saveAccount resource before POST");
                console.log(accountData);
                console.log(profileData);
                console.log(postData);
                
                return $http.post("Analytics/SettingsApi/PostAccountProfile", angular.toJson(postData));
            }

        };
    });