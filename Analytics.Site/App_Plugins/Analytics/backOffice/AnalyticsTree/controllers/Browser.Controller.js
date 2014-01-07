angular.module("umbraco").controller("Analytics.BrowserController",
    function ($scope, $location, statsResource, settingsResource) {

        var profileID = "";
        $scope.loadingViews = true;
        $scope.dateFilter = settingsResource.getDateFilter();

        $scope.$watch('dateFilter', function () {
            $scope.loadingViews = true;
            settingsResource.setDateFilter($scope.dateFilter.startDate, $scope.dateFilter.endDate);
            //Get Profile
            settingsResource.getprofile().then(function (response) {
                $scope.profile  = response.data;
                profileID = response.data.Id;

                if (profileID == null || profileID == "") {
                    $location.path("/analytics/analyticsTree/edit/settings");
                    return;
                } else {
                    
                
                    //Get Browser via statsResource - does WebAPI GET call
                    statsResource.getbrowsers(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                        $scope.browsers = response.data.ApiResult;

                        var chartData = response.data.ChartData;

                        //Create Bar Chart
                        var ctx = document.getElementById("browsers").getContext("2d");
                        var browsersChart = new Chart(ctx).Bar(chartData);
                    });

                    //Get Browser specific via statsResource - does WebAPI GET call
                    statsResource.getbrowserspecifics(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                        $scope.browserspecifics = response.data.ApiResult;
                    });
                    
                    $scope.loadingViews = false;
                }
            });
        });
    });