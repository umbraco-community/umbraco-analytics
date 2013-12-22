angular.module("umbraco").controller("Analytics.OSController",
    function ($scope, statsResource) {

        //Get Browser via statsResource - does WebAPI GET call
        statsResource.getos().then(function (response) {
            $scope.os = response.data;
        });

    });