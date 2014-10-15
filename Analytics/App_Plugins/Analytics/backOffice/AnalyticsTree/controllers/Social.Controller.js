angular.module("umbraco").controller("Analytics.SocialController",
    function ($scope, $location, statsResource, settingsResource) {
        
        var profileID = "";

        // items list array
        $scope.items = [];

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

        $scope.sort = function (newSortField) {
            if ($scope.sortField == newSortField)
                $scope.descending = !$scope.descending;

            // sort by new field and change sort icons
            $scope.sortField = newSortField;
            iconSorting("tbl-social", newSortField);
        };

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
                statsResource.getsocialnetworks(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.social = response.data.ApiResult;

                    var chartData = response.data.ChartData;

                    var canvasId = "social";
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
                    var socialChart = new Chart(ctx).Bar(chartData, options);

                    // Create legend
                    var legendHolder = document.createElement('div');
                    legendHolder.className = "chart-legend-holder";
                    legendHolder.innerHTML = socialChart.generateLegend();

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
                    socialChart.chart.canvas.parentNode.appendChild(legendHolder);

                    // clear existing items
                    $scope.items.length = 0;
                    // push objects to items array
                    angular.forEach($scope.social.Rows, function (item) {
                        $scope.items.push({
                            socialnetwork: item.Cells[0],
                            visits: parseInt(item.Cells[1]),
                            pageviews: parseInt(item.Cells[2])
                        });
                    });

                    var defaultSort = "pageviews"; // default sorting
                    $scope.sortField = defaultSort;
                    $scope.descending = true; // most pageviews first

                    // change sort icons
                    iconSorting("tbl-social", defaultSort);
                });
            });
        });
    });