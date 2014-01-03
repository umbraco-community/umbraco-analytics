angular.module("umbraco").controller("Analytics.PageViewsController",
    function ($scope, statsResource, settingsResource, assetsService) {

        var profileID = "";


        $scope.loadingViews = true;
        
        assetsService.load(
                ["/App_Plugins/Analytics/lib/momentjs/moment.min.js"])
            .then(function () {

                var dateFilter = settingsResource.getDateFilter();
                if (dateFilter.startDate == null) {
                    dateFilter.startDate = moment().subtract('days', 29).format('YYYY-MM-DD');
                    dateFilter.endDate = moment().format('YYYY-MM-DD');
                    settingsResource.setDateFilter(dateFilter.startDate, dateFilter.endDate);
                }
                
                $scope.dateFilter = dateFilter;



                //Get Profile
                settingsResource.getprofile().then(function (response) {
                    $scope.profile = response.data;
                    profileID = response.data.Id;

                    //Get chart data for monthly visit chart
                    statsResource.getvisitcharts(profileID).then(function (response) {
                        var chartData = response.data;

                        //Create Line Chart
                        var ctx = document.getElementById("viewMonths").getContext("2d");
                        var viewMonthsChart = new Chart(ctx).Line(chartData);
                    });

                    //Get Browser via statsResource - does WebAPI GET call
                    statsResource.getvisits(profileID, $scope.startDate, $scope.endDate).then(function (response) {
                        $scope.views        = response.data;
                        $scope.loadingViews = false;

                    });

                    //Get Browser specific via statsResource - does WebAPI GET call
                    statsResource.getsources(profileID).then(function (response) {
                        $scope.sources = response.data;
                    });

                });



            });


    });