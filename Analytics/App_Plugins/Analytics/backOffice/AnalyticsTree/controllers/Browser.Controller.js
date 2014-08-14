angular.module("umbraco").controller("Analytics.BrowserController",
    function ($scope, $location, statsResource, settingsResource) {

        var profileID = "";

        // items list array
        $scope.items = [];
        $scope.itemSpecs = [];

        // change sort icons
        function iconSorting(tableId, field) {
            $('#' + tableId + ' th i').each(function () {
                $(this).removeClass().addClass('fa fa-sort'); //icon-sort  // reset sort icon for columns with existing icons
            });
            if ($scope.descending)
                $('#' + tableId + ' #' + field + ' i').removeClass().addClass('fa fa-sort-down'); //icon-caret-down
            else
                $('#' + tableId + ' #' + field + ' i').removeClass().addClass('fa fa-sort-up'); //icon-caret-up
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

                        // clear existing items
                        $scope.items.length = 0;
                        // push objects to items array
                        angular.forEach($scope.browsers.Rows, function (item) {
                            $scope.items.push({
                                browser: item.Cells[0],
                                visits: parseInt(item.Cells[1]),
                                pageviews: parseInt(item.Cells[2])
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

                        var chartData = response.data.ChartData;

                        //Create Bar Chart
                        var ctx = document.getElementById("browsers").getContext("2d");
                        var browsersChart = new Chart(ctx).Bar(chartData);
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
                                bs_browser: item.Cells[0],
                                bs_version: item.Cells[1],
                                bs_visits: parseInt(item.Cells[2]),
                                bs_pageviews: parseInt(item.Cells[3])
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