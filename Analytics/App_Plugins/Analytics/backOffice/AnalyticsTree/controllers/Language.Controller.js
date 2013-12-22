angular.module("umbraco").controller("Analytics.LanguageController",
    function ($scope, statsResource) {

        //Get language via statsResource - does WebAPI GET call
        statsResource.getlanguage().then(function (response) {
            $scope.data = response.data;
        });

    });