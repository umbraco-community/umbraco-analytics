
angular.module("umbraco.resources")
    .factory("settingsResource", function ($http) {
        return {
            
            getall: function () {
                return $http.get("Analytics/SettingsApi/GetSettings");
            },

            save: function (settings) {
                return $http.post("Analytics/SettingsApi/PostSettings", angular.toJson(settings));
            }
        };
    });