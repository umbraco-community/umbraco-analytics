angular.module("umbraco").controller("Analytics.PageViewsController",
    function ($scope, statsResource, settingsResource) {

        var profileID = "";

        //Get Profile
        settingsResource.getprofile().then(function(response) {
            $scope.profile = response.data;
            profileID = response.data.Id;

            //Get Browser via statsResource - does WebAPI GET call
            statsResource.getvisits(profileID).then(function (response) {
                $scope.views = response.data;
            });

            //Get Browser specific via statsResource - does WebAPI GET call
            statsResource.getsources(profileID).then(function (response) {
                $scope.sources = response.data;
            });

        });

    });