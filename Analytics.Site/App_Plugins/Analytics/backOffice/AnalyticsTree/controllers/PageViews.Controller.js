angular.module("umbraco").controller("Analytics.PageViewsController",
    function ($scope, $location, statsResource, settingsResource, dateRangeService) {

        var profileID = "";

        $scope.dateFilter = settingsResource.getDateFilter();

        //$scope.$on('DateFilterChanged', function (event, x) {
        //    console.log("catch change");
        //    $scope.dateFilter = x;
        //});
        
        $scope.$watch('dateFilter', function () {
            
            settingsResource.setDateFilter($scope.dateFilter.startDate, $scope.dateFilter.endDate);
            //Get Profile
            settingsResource.getprofile().then(function (response) {
                $scope.profile = response.data;
                profileID = response.data.Id;

                if (profileID == null || profileID == "") {
                    $location.path("/analytics/analyticsTree/edit/settings");
                    return;
                }
                
                //Get chart data for monthly visit chart
                statsResource.getvisitcharts(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    var chartData = response.data;

                    //Create Line Chart
                    var ctx = document.getElementById("viewMonths").getContext("2d");
                    var viewMonthsChart = new Chart(ctx).Line(chartData);
                });

                //Get Browser via statsResource - does WebAPI GET call
                statsResource.getvisits(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.views = response.data;
                    $scope.loadingViews = false;

                });

                //Get Browser specific via statsResource - does WebAPI GET call
                statsResource.getsources(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.sources = response.data;
                });

            });
        });

    });