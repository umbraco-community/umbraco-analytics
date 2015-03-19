angular.module("umbraco").controller("Analytics.CountryController",
    function ($scope, $location, $routeParams, statsResource, settingsResource, assetsService, navigationService) {

        var profileID = "";

        // items list array
        $scope.items = [];

        $scope.loadingViews = true;

        assetsService.loadJs('http://www.google.com/jsapi')
            .then(function () {
                google.load("visualization", "1",
                {
                    callback: initChart,
                    packages: ['geochart']
                });
            });

        $scope.dateFilter = settingsResource.getDateFilter();

        $scope.$watch('dateFilter', function() {

            settingsResource.setDateFilter($scope.dateFilter.startDate, $scope.dateFilter.endDate);
            initChart();
        });
        
        function initChart() {
            $scope.loadingViews = true;
            //Get Profile
            settingsResource.getprofile().then(function(response) {
                $scope.profile  = response.data;
                profileID       = response.data.Id;

                if (profileID == null || profileID == "") {
                    $location.path("/analytics/analyticsTree/edit/settings");
                    return;
                }
                
                //Get Countires via statsResource - does WebAPI GET call
                statsResource.getcountries(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.data         = response.data.ApiResult;
                    $scope.loadingViews = false;

                    // clear existing items
                    $scope.items.length = 0;

                    // push objects to items array
                    angular.forEach($scope.data.Rows, function (item) {
                        $scope.items.push({
                            country: item.Cells[0].Value,
                            visits: parseInt(item.Cells[1].Value),
                            pageviews: parseInt(item.Cells[2].Value)
                        });
                    });

                    var chartData       = response.data.ChartData;
                    var chartMapData    = google.visualization.arrayToDataTable(chartData);

                    //Options for map (currently use defaults)
                    var options = {};

                    //Create the GeoChart with the countryChart DIV
                    var geochart = new google.visualization.GeoChart(document.getElementById('countryChart'));

                    //Draw the chart with the data & options
                    geochart.draw(chartMapData, options);
                });
            });
        };

        navigationService.syncTree({ tree: 'analyticsTree', path: ["-1", $routeParams.id], forceReload: false });
    });