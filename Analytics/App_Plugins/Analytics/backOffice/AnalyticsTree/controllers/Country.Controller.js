angular.module("umbraco").controller("Analytics.CountryController",
    function ($scope, statsResource, settingsResource) {

        var profileID = "";

        //Get Profile
        settingsResource.getprofile().then(function(response) {
            $scope.profile = response.data;
            profileID = response.data.Id;

            //Get Countires via statsResource - does WebAPI GET call
            statsResource.getcountries(profileID).then(function (response) {
                $scope.data = response.data;
            });

        });

    });