angular.module("umbraco").controller("Analytics.KeywordController",
    function ($scope, statsResource, settingsResource) {

        var profileID = "";

        $scope.dateFilter = settingsResource.getDateFilter();

        $scope.$watch('dateFilter', function () {
            
            settingsResource.setDateFilter($scope.dateFilter.startDate, $scope.dateFilter.endDate);
            //Get Profile
            settingsResource.getprofile().then(function(response) {
                $scope.profile = response.data;
                profileID = response.data.Id;

                //Get Browser via statsResource - does WebAPI GET call
                statsResource.getkeywords(profileID,$scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.keywords = response.data.ApiResult;

                    //var chartData = response.data.ChartData;

                    ////Create Bar Chart
                    //var ctx = document.getElementById("keywords").getContext("2d");
                    //var keywordsChart = new Chart(ctx).Bar(chartData);
                });

            });
        });

    });