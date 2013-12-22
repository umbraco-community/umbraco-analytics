angular.module("umbraco").controller("Analytics.PageViewsController",
    function ($scope, statsResource) {

        //Get Browser via statsResource - does WebAPI GET call
        statsResource.getvisits().then(function (response) {
            $scope.views = response.data;
        });

        //Get Browser specific via statsResource - does WebAPI GET call
        statsResource.getsources().then(function (response) {
            $scope.sources = response.data;
        });

    });