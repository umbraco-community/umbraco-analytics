angular.module("umbraco").controller("Analytics.KeywordController",
    function ($scope, statsResource) {

        //Get Browser via statsResource - does WebAPI GET call
        statsResource.getkeywords().then(function (response) {
            $scope.keywords = response.data;
        });

    });