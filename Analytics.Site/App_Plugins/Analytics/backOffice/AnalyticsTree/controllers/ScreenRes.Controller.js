angular.module("umbraco").controller("Analytics.ScreenResController",
    function ($scope, statsResource) {

        //Get Browser via statsResource - does WebAPI GET call
        statsResource.getresolutions().then(function (response) {
            $scope.resolutions = response.data;
        });

    });