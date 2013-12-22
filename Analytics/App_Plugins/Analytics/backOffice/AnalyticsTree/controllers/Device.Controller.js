angular.module("umbraco").controller("Analytics.DeviceController",
    function ($scope, statsResource) {

        //Get Browser via statsResource - does WebAPI GET call
        statsResource.getdevicetypes().then(function (response) {
            $scope.devicetypes = response.data;
        });

        //Get Browser specific via statsResource - does WebAPI GET call
        statsResource.getdevices().then(function (response) {
            $scope.devices = response.data;
        });

    });