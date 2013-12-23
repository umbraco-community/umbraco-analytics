angular.module("umbraco").controller("Analytics.ScreenResController",
    function ($scope, statsResource, settingsResource) {

        var profileID = "";

        //Get Profile
        settingsResource.getprofile().then(function(response) {
            $scope.profile = response.data;
            profileID = response.data.Id;

            //Get Browser via statsResource - does WebAPI GET call
            statsResource.getresolutions(profileID).then(function (response) {
                $scope.resolutions = response.data;
            });
        });

    });