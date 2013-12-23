angular.module("umbraco").controller("Analytics.LanguageController",
    function ($scope, statsResource, settingsResource) {

        var profileID = "";

        //Get Profile
        settingsResource.getprofile().then(function(response) {
            $scope.profile = response.data;
            profileID = response.data.Id;

            //Get language via statsResource - does WebAPI GET call
            statsResource.getlanguage(profileID).then(function (response) {
                $scope.data = response.data;
            });

        });

    });