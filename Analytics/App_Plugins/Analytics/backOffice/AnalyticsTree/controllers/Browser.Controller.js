angular.module("umbraco").controller("Analytics.BrowserController",
    function ($scope, statsResource) {

        //Get Browser via statsResource - does WebAPI GET call
        statsResource.getbrowsers().then(function (response) {
            $scope.browsers = response.data;
        });

        //Get Browser specific via statsResource - does WebAPI GET call
        statsResource.getbrowserspecifics().then(function (response) {
            $scope.browserspecifics = response.data;
        });

    });