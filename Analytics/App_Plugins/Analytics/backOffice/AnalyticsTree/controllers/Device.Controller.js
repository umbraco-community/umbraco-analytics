angular.module("umbraco").controller("Analytics.DeviceController",
    function ($scope, $location, $routeParams, statsResource, settingsResource, localizationService, navigationService) {

        var profileID = "";

        // items list array
        $scope.types = [];
        $scope.items = [];

        $scope.dateFilter = settingsResource.getDateFilter();
        $scope.loadingViews = true;
        
        $scope.$watch('dateFilter', function () {
            $scope.loadingViews = true;
            settingsResource.setDateFilter($scope.dateFilter.startDate, $scope.dateFilter.endDate);

            //Get Profile
            settingsResource.getprofile().then(function(response) {
                $scope.profile = response.data;
                profileID = response.data.Id;
                
                if (profileID == null || profileID == "") {
                    $location.path("/analytics/analyticsTree/edit/settings");
                    return;
                }
                $scope.loadingViews = false;
                //Get Browser via statsResource - does WebAPI GET call
                statsResource.getdevicetypes(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.devicetypes = response.data.ApiResult;

                    var chartData = response.data.ChartData;

                    var canvasId = "deviceType";
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
                    var devicetypeChart = new Chart(ctx).Bar(chartData, options);

                    // Create legend
                    var legendHolder = document.createElement('div');
                    legendHolder.className = "chart-legend-holder";
                    legendHolder.innerHTML = devicetypeChart.generateLegend();

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
                    devicetypeChart.chart.canvas.parentNode.appendChild(legendHolder);

                    // clear existing items
                    $scope.types.length = 0;

                    // push objects to items array
                    angular.forEach($scope.devicetypes.Rows, function (item) {
                        $scope.types.push({
                            dt_devicetype: item.Cells[0].Value,
                            dt_visits: parseInt(item.Cells[1].Value),
                            dt_pageviews: parseInt(item.Cells[2].Value)
                        });
                    });

                });

                //Get Browser specific via statsResource - does WebAPI GET call
                statsResource.getdevices(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.devices = response.data.ApiResult;

                    // clear existing items
                    $scope.items.length = 0;

                    // push objects to items array
                    angular.forEach($scope.devices.Rows, function (item) {
                        $scope.items.push({
                            device: item.Cells[0].Value,
                            model: item.Cells[1].Value,
                            visits: parseInt(item.Cells[2].Value),
                            pageviews: parseInt(item.Cells[3].Value)
                        });
                    });

                });

            });
        });

        navigationService.syncTree({ tree: 'analyticsTree', path: ["-1", $routeParams.id], forceReload: false });
    });