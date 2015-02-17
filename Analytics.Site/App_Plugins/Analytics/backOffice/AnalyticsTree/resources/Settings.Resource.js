
angular.module("umbraco.resources")
    .factory("settingsResource", function ($http, $cookieStore) {
        return {
            
            checkauth: function () {
                return $http.get(this.getApiPath()+"Analytics/SettingsApi/GetAuth");
            },

            getall: function () {
                return $http.get(this.getApiPath() + "Analytics/SettingsApi/GetSettings");
            },

            save: function (settings) {
                return $http.post(this.getApiPath() + "Analytics/SettingsApi/PostSettings", angular.toJson(settings));
            },

            getaccounts: function () {
                return $http.get(this.getApiPath() + "Analytics/AnalyticsApi/GetAccounts");
            },

            getprofiles: function (accountId) {
                return $http.get(this.getApiPath() + "Analytics/AnalyticsApi/GetProfilesFromAccount?accountId=" + accountId);
            },

            saveAccount: function (accountData) {
                return $http.post(this.getApiPath() + "Analytics/SettingsApi/PostAccount", angular.toJson(accountData));
            },

            saveProfile: function (profileData) {
                return $http.post(this.getApiPath() + "Analytics/SettingsApi/PostProfile", angular.toJson(profileData));
            },

            getaccount: function () {
                return $http.get(this.getApiPath() + "Analytics/SettingsApi/GetAccount");
            },

            getprofile: function () {
                return $http.get(this.getApiPath() + "Analytics/SettingsApi/GetProfile");
            },
            
            getApiPath: function() {
                var path = $cookieStore.get("analyticsUmbracoVersion");
                if (path == null) {
                    try {
                        var version = $http.get("backoffice/Analytics/SettingsApi/GetUmbracoVersion");
                        path = "backoffice/";
                    } catch (err) {
                        path = "";
                    }
                    
                }
                return path;
            },
            
            setDateFilter: function (startDate, endDate) {
                $cookieStore.put("analyticsStartDate", startDate);
                $cookieStore.put("analyticsEndDate", endDate);

            },
            getDateFilter: function() {
                var dateFilter = {};
                dateFilter.startDate = $cookieStore.get("analyticsStartDate");
                dateFilter.endDate = $cookieStore.get("analyticsEndDate");
                
                if (dateFilter.startDate == null) {
                    dateFilter.startDate = moment().subtract('days', 29).format('YYYY-MM-DD');
                    dateFilter.endDate = moment().format('YYYY-MM-DD');
                    $cookieStore.put("analyticsStartDate", dateFilter.startDate);
                    $cookieStore.put("analyticsEndDate", dateFilter.endDate);
                }
                
                return dateFilter;
            }

        };
    });