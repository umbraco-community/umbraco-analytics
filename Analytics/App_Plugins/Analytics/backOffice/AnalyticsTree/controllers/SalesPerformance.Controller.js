angular.module("umbraco").controller("Analytics.SalesPerformanceController",
    function ($scope, $location, $routeParams, statsResource, settingsResource, localizationService, navigationService) {

        var profileID = "";

        // items list array
        $scope.itemSales = [];

        $scope.dateFilter = settingsResource.getDateFilter();
        $scope.loadingViews = true;

        $scope.$watch('dateFilter', function () {
            $scope.loadingViews = true;
            settingsResource.setDateFilter($scope.dateFilter.startDate, $scope.dateFilter.endDate);

            //Get Profile
            settingsResource.getprofile().then(function (response) {
                $scope.profile = response.data;
                profileID = response.data.Id;
                $scope.currencyCode = $scope.profile.Currency;

                if (profileID == null || profileID == "") {
                    $location.path("/analytics/analyticsTree/edit/settings");
                    return;
                }
                $scope.loadingViews = false;

                //Get chart data for monthly visit chart
                statsResource.getsalesperformancecharts(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    var chartData = response.data;

                    var canvasId = "viewSalesPerformance";
                    var canvas = document.getElementById(canvasId),
                        canvasWidth = canvas.clientWidth,
                        canvasHeight = canvas.clientHeight;

                    // Replace the chart canvas element
                    $('#' + canvasId).replaceWith('<canvas id="' + canvasId + '" width="' + canvasWidth + '" height="' + canvasHeight + '"></canvas>');

                    var options = {
                        labelTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\">"
                            + "<% for (var i=0; i<datasets.length; i++){%>"
                            + "<li><span style=\"background-color:<%=datasets[i].fillColor%>;border-color:<%=datasets[i].strokeColor%>\"></span>"
                            + "<%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%>"
                            + "</ul>",
                        bezierCurve: false,
                        scaleBeginAtZero: true
                    };

                    // Draw the chart / Create Line Chart
                    var ctx = $('#' + canvasId).get(0).getContext("2d");
                    var viewSalesPerformanceChart = new Chart(ctx).Line(chartData, options);

                    // Create legend
                    var legendHolder = document.createElement('div');
                    legendHolder.className = "chart-legend-holder";
                    legendHolder.innerHTML = viewSalesPerformanceChart.generateLegend();

                    var helpers = Chart.helpers;
                    helpers.each(legendHolder.firstChild.childNodes, function (legendNode, index) {
                        if (index == 0) {
                            localizationService.localize("analytics_revenue").then(function (value) {
                                var text = value != null ? value : "Revenue";
                                var t = document.createTextNode(text);
                                legendNode.appendChild(t);
                                legendNode.className = "first";
                            });
                        }
                    });

                    // ensure legend not gets added multiple times
                    $(".chart-legend-holder").remove();
                    viewSalesPerformanceChart.chart.canvas.parentNode.appendChild(legendHolder);
                });

                //Get Browser specific via statsResource - does WebAPI GET call
                statsResource.getsalesperformance(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.salesperformance = response.data.ApiResult;

                    // clear existing items
                    $scope.itemSales.length = 0;

                    // push objects to items array
                    angular.forEach($scope.salesperformance.Rows, function (item) {
                        var year = item.Cells[0].Value.slice(0, 4);
                        var month = item.Cells[0].Value.slice(4, 6);
                        var day = item.Cells[0].Value.slice(6, 8);
                        $scope.itemSales.push({
                            date: new Date(year, month, day), // yyyyMMdd --> yyyy-MM-dd
                            uniquePurchases: parseInt(item.Cells[2].Value),
                            revenue: parseFloat(item.Cells[1].Value)
                        });
                    });

                });

            });
        });

        // todo: possible to find "ecommerce" alias dynamic? "ecommerce" is parent tree alias
        navigationService.syncTree({ tree: 'analyticsTree', path: ["-1", "ecommerce", $routeParams.id], forceReload: false });
    });