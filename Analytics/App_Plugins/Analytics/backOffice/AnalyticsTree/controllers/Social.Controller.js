angular.module("umbraco").controller("Analytics.SocialController",
    function ($scope, statsResource, settingsResource) {
        
        var profileID = "";

        //Get Profile
        settingsResource.getprofile().then(function(response) {
            $scope.profile = response.data;
            profileID = response.data.Id;

            //Get Browser via statsResource - does WebAPI GET call
            statsResource.getsocialnetworks(profileID).then(function (response) {
                $scope.social = response.data;
            });
        });

    });