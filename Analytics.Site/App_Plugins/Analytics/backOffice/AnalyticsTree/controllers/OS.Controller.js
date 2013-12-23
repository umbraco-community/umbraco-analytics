angular.module("umbraco").controller("Analytics.OSController",
    function ($scope, statsResource, settingsResource) {

        var profileID = "";

        //Get Profile
        settingsResource.getprofile().then(function(response) {
            $scope.profile = response.data;
            profileID = response.data.Id;

            //Get Browser via statsResource - does WebAPI GET call
            statsResource.getos(profileID).then(function (response) {
                $scope.os = response.data;
            });

        });

    });