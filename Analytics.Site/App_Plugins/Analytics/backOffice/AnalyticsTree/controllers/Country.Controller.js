angular.module("umbraco").controller("Analytics.CountryController",
    function ($scope, statsResource) {

        //Get Countires via statsResource - does WebAPI GET call
        statsResource.getcountries().then(function (response) {
            $scope.data = response.data;
        });

    });