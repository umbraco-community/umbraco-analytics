angular.module("umbraco").controller("Analytics.KeywordController",
    function ($scope, statsResource, settingsResource) {

        var profileID = "";

        //Get Profile
        settingsResource.getprofile().then(function(response) {
            $scope.profile = response.data;
            profileID = response.data.Id;

            //Get Browser via statsResource - does WebAPI GET call
            statsResource.getkeywords(profileID).then(function (response) {
                $scope.keywords = response.data;
            });

        });

    });