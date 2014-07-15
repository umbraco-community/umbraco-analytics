angular.module("umbraco").controller("Analytics.DashboardController",
    function($scope, $location, statsResource, settingsResource) {

        var profileID = "";

        $scope.dateFilter = {};
        $scope.dateFilter.startDate = moment().subtract('days', 6).format('YYYY-MM-DD');
        $scope.dateFilter.endDate = moment().format('YYYY-MM-DD');
        
        settingsResource.getprofile().then(function(response) {
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
            
            //Keywords
            statsResource.getkeywords(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                $scope.keywords = response.data.ApiResult;

              
            });
        });
        

});