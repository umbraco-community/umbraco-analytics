angular.module("umbraco").controller("Analytics.BrowserController",
    function ($scope, $location, statsResource, settingsResource) {

        var profileID = "";

        // items list array
        $scope.items = [];
        $scope.itemSpecs = [];

        // change sort icons
        function iconSorting(tableId, field) {
            $('#' + tableId + ' th i').each(function () {
                $(this).removeClass().addClass('icon'); // reset sort icon for columns with existing icons
            });
            if ($scope.descending)
                $('#' + tableId + ' #' + field + ' i').removeClass().addClass('icon-navigation-down');
            else
                $('#' + tableId + ' #' + field + ' i').removeClass().addClass('icon-navigation-up');
        }

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

                        var canvasId = "browsers";
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
                        var browsersChart = new Chart(ctx).Bar(chartData, options);

                        // Create legend
                        var legendHolder = document.createElement('div');
                        legendHolder.className = "chart-legend-holder";
                        legendHolder.innerHTML = browsersChart.generateLegend();

                        var helpers = Chart.helpers;
                        helpers.each(legendHolder.firstChild.childNodes, function (legendNode, index) {

                            if (index == 0) {
                                var t = document.createTextNode("Visits");
                                legendNode.appendChild(t);
                                legendNode.className = "first";
                            }
                            else if (index == 1) {
                                var t = document.createTextNode("Page Views");
                                legendNode.appendChild(t);
                                legendNode.className = "second";
                            }
                        });

                        // ensure legend not gets added multiple times
                        $(".chart-legend-holder").remove();
                        browsersChart.chart.canvas.parentNode.appendChild(legendHolder);

                        // clear existing items
                        $scope.items.length = 0;
                        // push objects to items array
                        angular.forEach($scope.browsers.Rows, function (item) {
                            $scope.items.push({
                                browser: item.Cells[0].Value,
                                visits: parseInt(item.Cells[1].Value),
                                pageviews: parseInt(item.Cells[2].Value)
                            });
                        });

                        $scope.sort = function (newSortField) {
                            if ($scope.sortField == newSortField)
                                $scope.descending = !$scope.descending;

                            // sort by new field and change sort icons
                            $scope.sortField = newSortField;
                            iconSorting("tbl-browsers", newSortField);
                        };

                        var defaultSort = "pageviews"; // default sorting
                        $scope.sortField = defaultSort;
                        $scope.descending = true; // most pageviews first

                        // change sort icons
                        iconSorting("tbl-browsers", defaultSort);
                    });

                    //Get Browser specific via statsResource - does WebAPI GET call
                    statsResource.getbrowserspecifics(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                        $scope.browserspecifics = response.data.ApiResult;
                        $scope.loadingViews = false;

                        // clear existing items
                        $scope.itemSpecs.length = 0;
                        // push objects to items array
                        angular.forEach($scope.browserspecifics.Rows, function (item) {
                            $scope.itemSpecs.push({
                                bs_browser: item.Cells[0].Value,
                                bs_version: item.Cells[1].Value,
                                bs_visits: parseInt(item.Cells[2].Value),
                                bs_pageviews: parseInt(item.Cells[3].Value)
                            });
                        });

                        $scope.sort = function (newSortField) {
                            if ($scope.sortField == newSortField)
                                $scope.descending = !$scope.descending;

                            // sort by new field and change sort icons
                            $scope.sortField = newSortField;
                            iconSorting("tbl-browserspecifics", newSortField);
                        };

                        var defaultSort = "pageviews"; // default sorting
                        $scope.sortField = defaultSort;
                        $scope.descending = true; // most pageviews first
                    });
                }
            });
        });
    });