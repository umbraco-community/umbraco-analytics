angular.module("umbraco").controller("Analytics.SocialController",
    function ($scope, statsResource) {

        //Get Browser via statsResource - does WebAPI GET call
        statsResource.getsocialnetworks().then(function (response) {
            $scope.social = response.data;
        });

    });