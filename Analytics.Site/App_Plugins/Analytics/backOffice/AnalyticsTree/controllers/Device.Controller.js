angular.module("umbraco").controller("Analytics.DeviceController",
    function ($scope, statsResource, settingsResource) {

        var profileID = "";

        //Get Profile
        settingsResource.getprofile().then(function(response) {
            $scope.profile = response.data;
            profileID = response.data.Id;

            //Get Browser via statsResource - does WebAPI GET call
            statsResource.getdevicetypes(profileID).then(function (response) {
                $scope.devicetypes = response.data.ApiResult;

                var chartData = response.data.ChartData;

                //Create Bar Chart
                var ctx = document.getElementById("deviceType").getContext("2d");
                var deviceTypeChart = new Chart(ctx).Bar(chartData);
            });

            //Get Browser specific via statsResource - does WebAPI GET call
            statsResource.getdevices(profileID).then(function (response) {
                $scope.devices = response.data;
            });

        });

    });