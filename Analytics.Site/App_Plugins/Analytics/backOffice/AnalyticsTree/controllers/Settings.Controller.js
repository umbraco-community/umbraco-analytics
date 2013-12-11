angular.module("umbraco").controller("Analytics.SettingsController",
    function ($scope, $http) {

        $http.get('/umbraco/Analytics/SettingsApi/GetSettings').success(function (data) {
            $scope.settings = data;
        });
        
    });