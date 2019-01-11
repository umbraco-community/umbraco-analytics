
angular.module("umbraco.resources")
    .factory("settingsResource", function ($http, $cookies) {
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
                var path = $cookies.get("analyticsUmbracoVersion");
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
                $cookies.put("analyticsStartDate", startDate);
                $cookies.put("analyticsEndDate", endDate);

            },
            getDateFilter: function() {
                var dateFilter = {};
                dateFilter.startDate = $cookieStore.get("analyticsStartDate");
                dateFilter.endDate = $cookieStore.get("analyticsEndDate");
                
                if (dateFilter.startDate == null) {
                    dateFilter.startDate = moment().subtract('days', 29).format('YYYY-MM-DD');
                    dateFilter.endDate = moment().format('YYYY-MM-DD');
                    $cookies.put("analyticsStartDate", dateFilter.startDate);
                    $cookies.put("analyticsEndDate", dateFilter.endDate);
                }
                
                return dateFilter;
            }

        };
    });

angular.module("umbraco.resources")
    .factory("statsResource", function ($http, settingsResource) {
        return {
            
            //TODO: Get Profile ID from saved profile in settings

            getlanguage: function (profileID, startDate, endDate) {
              
                return $http.get(settingsResource.getApiPath() + "Analytics/AnalyticsApi/GetLanguage", { params: { profile: profileID, startDate: startDate, endDate: endDate } });
            },

            getcountries: function (profileID, startDate, endDate) {
              
                return $http.get(settingsResource.getApiPath() + "Analytics/AnalyticsApi/GetCountry", { params: { profile: profileID, startDate: startDate, endDate: endDate } });
            },

            getbrowsers: function (profileID, startDate, endDate) {
              
                return $http.get(settingsResource.getApiPath() + "Analytics/AnalyticsApi/GetBrowser", { params: { profile: profileID, startDate: startDate, endDate: endDate } });
            },

            getbrowserspecifics: function (profileID, startDate, endDate) {
                
                return $http.get(settingsResource.getApiPath() + "Analytics/AnalyticsApi/GetBrowserVersion", { params: { profile: profileID, startDate: startDate, endDate: endDate } });
            },

            getdevicetypes: function (profileID, startDate, endDate) {
               
                return $http.get(settingsResource.getApiPath() + "Analytics/AnalyticsApi/GetDeviceTypes", { params: { profile: profileID, startDate: startDate, endDate: endDate } });
            },

            getdevices: function (profileID, startDate, endDate) {
               
                return $http.get(settingsResource.getApiPath() + "Analytics/AnalyticsApi/GetDevices", { params: { profile: profileID, startDate: startDate, endDate: endDate } });
            },

            getresolutions: function (profileID, startDate, endDate) {
              
                return $http.get(settingsResource.getApiPath() + "Analytics/AnalyticsApi/GetScreenRes", { params: { profile: profileID, startDate: startDate, endDate: endDate } });
            },

            getos: function (profileID, startDate, endDate) {
               
                return $http.get(settingsResource.getApiPath() + "Analytics/AnalyticsApi/GetOperatingSystems", { params: { profile: profileID, startDate: startDate, endDate: endDate } });
            },

            getosversions: function (profileID, startDate, endDate) {
               
                return $http.get(settingsResource.getApiPath() + "Analytics/AnalyticsApi//GetOperatingSystemVersions", { params: { profile: profileID, startDate: startDate, endDate: endDate } });
            },

            getsocialnetworks: function (profileID, startDate, endDate) {
               
                return $http.get(settingsResource.getApiPath() + "Analytics/AnalyticsApi/GetSocialNetworkSources", { params: { profile: profileID, startDate: startDate, endDate: endDate } });
            },

            getkeywords: function (profileID, startDate, endDate) {
                return $http.get(settingsResource.getApiPath() + "Analytics/AnalyticsApi/GetKeywords", { params: { profile: profileID, startDate: startDate, endDate: endDate } });
            },

            getvisits: function (profileID, startDate, endDate) {
                return $http.get(settingsResource.getApiPath() + "Analytics/AnalyticsApi/GetVisits", { params: { profile: profileID, startDate: startDate, endDate: endDate } });
            },

            getsources: function (profileID, startDate, endDate) {
               
                return $http.get(settingsResource.getApiPath() + "Analytics/AnalyticsApi/GetSources", { params: { profile: profileID, startDate: startDate, endDate: endDate } });
            },

            getvisitcharts: function (profileID, startDate, endDate) {
                return $http.get(settingsResource.getApiPath() + "Analytics/AnalyticsApi/GetVisitsOverTime", { params: { profile: profileID, startDate: startDate, endDate: endDate } });
            },

            gettransactions: function (profileID, startDate, endDate) {
                return $http.get(settingsResource.getApiPath() + "Analytics/AnalyticsApi/GetTransactions", { params: { profile: profileID, startDate: startDate, endDate: endDate } });
            },

            gettransactionscharts: function (profileID, startDate, endDate) {
                return $http.get(settingsResource.getApiPath() + "Analytics/AnalyticsApi/GetTransactionsOverTime", { params: { profile: profileID, startDate: startDate, endDate: endDate } });
            },

            getproductperformance: function (profileID, startDate, endDate) {
                return $http.get(settingsResource.getApiPath() + "Analytics/AnalyticsApi/GetProductPerformance", { params: { profile: profileID, startDate: startDate, endDate: endDate } });
            },

            getproductperformancecharts: function (profileID, startDate, endDate) {
                return $http.get(settingsResource.getApiPath() + "Analytics/AnalyticsApi/GetProductPerformanceOverTime", { params: { profile: profileID, startDate: startDate, endDate: endDate } });
            },

            getsalesperformance: function (profileID, startDate, endDate) {
                return $http.get(settingsResource.getApiPath() + "Analytics/AnalyticsApi/GetSalesPerformance", { params: { profile: profileID, startDate: startDate, endDate: endDate } });
            },

            getsalesperformancecharts: function (profileID, startDate, endDate) {
                return $http.get(settingsResource.getApiPath() + "Analytics/AnalyticsApi/GetSalesPerformanceOverTime", { params: { profile: profileID, startDate: startDate, endDate: endDate } });
            },

            getstoredetails: function (profileID, startDate, endDate) {
                return $http.get(settingsResource.getApiPath() + "Analytics/AnalyticsApi/GetStoreDetails", { params: { profile: profileID, startDate: startDate, endDate: endDate } });
            },

            getbestsellers: function (profileID, startDate, endDate) {
                return $http.get(settingsResource.getApiPath() + "Analytics/AnalyticsApi/GetBestSellers", { params: { profile: profileID, startDate: startDate, endDate: endDate } });
            },

            getrevenuepersource: function (profileID, startDate, endDate) {
                return $http.get(settingsResource.getApiPath() + "Analytics/AnalyticsApi/GetRevenuePerSource", { params: { profile: profileID, startDate: startDate, endDate: endDate } });
            }
        };
    });