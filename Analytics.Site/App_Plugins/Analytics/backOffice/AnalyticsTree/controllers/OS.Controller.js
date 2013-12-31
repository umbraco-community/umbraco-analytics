angular.module("umbraco").controller("Analytics.OSController",
    function ($scope, statsResource, settingsResource) {

        var profileID = "";

        //Get Profile
        settingsResource.getprofile().then(function(response) {
            $scope.profile = response.data;
            profileID = response.data.Id;

            //Get Browser via statsResource - does WebAPI GET call
            statsResource.getos(profileID).then(function (response) {
                $scope.os = response.data.ApiResult;

                var chartData = response.data.ChartData;

                //Create Bar Chart
                var ctx = document.getElementById("os").getContext("2d");
                var osChart = new Chart(ctx).Bar(chartData);
            });

            //Get Browser via statsResource - does WebAPI GET call
            statsResource.getosversions(profileID).then(function (response) {
                $scope.osVersions = response.data.ApiResult;
            });

        });

    });