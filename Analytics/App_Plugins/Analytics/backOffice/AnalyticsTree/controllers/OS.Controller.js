angular.module("umbraco").controller("Analytics.OSController",
    function ($scope, $location, statsResource, settingsResource) {

        var profileID = "";

        $scope.dateFilter = settingsResource.getDateFilter();

        $scope.$watch('dateFilter', function () {
            
            settingsResource.setDateFilter($scope.dateFilter.startDate, $scope.dateFilter.endDate);
            //Get Profile
            settingsResource.getprofile().then(function(response) {
                $scope.profile = response.data;
                profileID = response.data.Id;

                if (profileID == null || profileID == "") {
                    $location.path("/analytics/analyticsTree/edit/settings");
                    return;
                }
                
                //Get Browser via statsResource - does WebAPI GET call
                statsResource.getos(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.os = response.data.ApiResult;

                    var chartData = response.data.ChartData;

                    //Create Bar Chart
                    var ctx = document.getElementById("os").getContext("2d");
                    var osChart = new Chart(ctx).Bar(chartData);
                });

                //Get Browser via statsResource - does WebAPI GET call
                statsResource.getosversions(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.osVersions = response.data.ApiResult;
                });

            });
        });
    });