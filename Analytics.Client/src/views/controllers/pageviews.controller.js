angular.module("umbraco").controller("Analytics.PageViewsController",
    function ($scope, $location, $routeParams, statsResource, settingsResource, dateRangeService, localizationService, navigationService) {

        var profileID = "";

        // items list array
        $scope.items = [];
        $scope.itemSources = [];

        $scope.dateFilter = settingsResource.getDateFilter();

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

                    var canvasId = "viewMonths";
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
                            + "</ul>"
                    };

                    // Draw the chart / Create Line Chart
                    var ctx = $('#' + canvasId).get(0).getContext("2d");
                    var viewMonthsChart = new Chart(ctx).Line(chartData, options);

                    // Create legend
                    var legendHolder = document.createElement('div');
                    legendHolder.className = "chart-legend-holder";
                    legendHolder.innerHTML = viewMonthsChart.generateLegend();

                    var helpers = Chart.helpers;
                    helpers.each(legendHolder.firstChild.childNodes, function (legendNode, index) {
                        if (index == 0) {
                            localizationService.localize("analytics_visits").then(function (value) {
                                var text = value != null ? value : "Visits";
                                var t = document.createTextNode(text);
                                legendNode.appendChild(t);
                                legendNode.className = "first";
                            });
                        }
                        else if (index == 1) {
                            localizationService.localize("analytics_pageViews").then(function (value) {
                                var text = value != null ? value : "Page Views";
                                var t = document.createTextNode(text);
                                legendNode.appendChild(t);
                                legendNode.className = "second";
                            });
                        }
                    });

                    // ensure legend not gets added multiple times
                    $(".chart-legend-holder").remove();
                    viewMonthsChart.chart.canvas.parentNode.appendChild(legendHolder);
                });

                //Get Browser via statsResource - does WebAPI GET call
                statsResource.getvisits(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.views = response.data;
                    $scope.loadingViews = false;

                    // clear existing items
                    $scope.items.length = 0;
                    // push objects to items array
                    angular.forEach($scope.views.Rows, function (item) {
                        $scope.items.push({
                            pagepath: item.Cells[0].Value,
                            visits: parseInt(item.Cells[1].Value),
                            pageviews: parseInt(item.Cells[2].Value)
                        });
                    });

                });

                //Get Browser specific via statsResource - does WebAPI GET call
                statsResource.getsources(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.sources = response.data;

                    // clear existing items
                    $scope.itemSources.length = 0;
                    // push objects to items array
                    angular.forEach($scope.sources.Rows, function (item) {
                        $scope.itemSources.push({
                            s_source: item.Cells[0].Value,
                            s_visits: parseInt(item.Cells[1].Value),
                            s_pageviews: parseInt(item.Cells[2].Value)
                        });
                    });

                });

            });
        });

        navigationService.syncTree({ tree: 'analyticsTree', path: ["-1", $routeParams.id], forceReload: false });
    });