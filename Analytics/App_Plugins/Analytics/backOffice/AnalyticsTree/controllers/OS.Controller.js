angular.module("umbraco").controller("Analytics.OSController",
    function ($scope, $location, $routeParams, statsResource, settingsResource, localizationService, navigationService) {

        var profileID = "";

        // items list array
        $scope.items = [];
        $scope.itemsVersions = [];

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

                    var canvasId = "os";
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

                    // Draw the chart / Create Bar Chart
                    var ctx = $('#' + canvasId).get(0).getContext("2d");
                    var osChart = new Chart(ctx).Bar(chartData, options);

                    // Create legend
                    var legendHolder = document.createElement('div');
                    legendHolder.className = "chart-legend-holder";
                    legendHolder.innerHTML = osChart.generateLegend();

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
                    osChart.chart.canvas.parentNode.appendChild(legendHolder);

                    // clear existing items
                    $scope.items.length = 0;

                    // push objects to items array
                    angular.forEach($scope.os.Rows, function (item) {
                        $scope.items.push({
                            operatingsystem: item.Cells[0].Value,
                            visits: parseInt(item.Cells[1].Value),
                            pageviews: parseInt(item.Cells[2].Value)
                        });
                    });

                });

                //Get Browser via statsResource - does WebAPI GET call
                statsResource.getosversions(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.osVersions = response.data.ApiResult;

                    // clear existing items
                    $scope.itemsVersions.length = 0;

                    // push objects to items array
                    angular.forEach($scope.osVersions.Rows, function (item) {
                        $scope.itemsVersions.push({
                            v_operatingsystem: item.Cells[0].Value,
                            v_version: item.Cells[1].Value,
                            v_visits: parseInt(item.Cells[2].Value),
                            v_pageviews: parseInt(item.Cells[3].Value)
                        });
                    });

                });

            });
        });

        navigationService.syncTree({ tree: 'analyticsTree', path: ["-1", $routeParams.id], forceReload: false });
    });