angular.module("umbraco").controller("Analytics.BrowserController",
    function ($scope, statsResource, settingsResource) {

        var profileID = "";

        //Get Profile
        settingsResource.getprofile().then(function (response) {
            $scope.profile  = response.data;
            profileID = response.data.Id;

            //Get Browser via statsResource - does WebAPI GET call
            statsResource.getbrowsers(profileID).then(function (response) {
                $scope.browsers = response.data.ApiResult;

                var chartData = response.data.ChartData;

                //Create Bar Chart
                var ctx = document.getElementById("browsers").getContext("2d");
                var browsersChart = new Chart(ctx).Bar(chartData);
            });

            //Get Browser specific via statsResource - does WebAPI GET call
            statsResource.getbrowserspecifics(profileID).then(function (response) {
                $scope.browserspecifics = response.data.ApiResult;
            });

        });

    });