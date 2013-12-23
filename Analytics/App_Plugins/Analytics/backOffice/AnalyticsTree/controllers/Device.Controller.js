angular.module("umbraco").controller("Analytics.DeviceController",
    function ($scope, statsResource, settingsResource) {

        var profileID = "";

        //Get Profile
        settingsResource.getprofile().then(function(response) {
            $scope.profile = response.data;
            profileID = response.data.Id;

            //Get Browser via statsResource - does WebAPI GET call
            statsResource.getdevicetypes(profileID).then(function (response) {
                $scope.devicetypes = response.data;
            });

            //Get Browser specific via statsResource - does WebAPI GET call
            statsResource.getdevices(profileID).then(function (response) {
                $scope.devices = response.data;
            });

        });

    });