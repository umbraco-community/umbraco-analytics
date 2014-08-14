angular.module("umbraco").controller("Analytics.OSController",
    function ($scope, $location, statsResource, settingsResource) {

        var profileID = "";

        // items list array
        $scope.items = [];
        $scope.itemsVersions = [];

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

                    // clear existing items
                    $scope.items.length = 0;
                    // push objects to items array
                    angular.forEach($scope.os.Rows, function (item) {
                        $scope.items.push({
                            operatingsystem: item.Cells[0],
                            visits: parseInt(item.Cells[1]),
                            pageviews: parseInt(item.Cells[2])
                        });
                    });

                    $scope.sort = function (newSortField) {
                        if ($scope.sortField == newSortField)
                            $scope.descending = !$scope.descending;

                        // sort by new field and change sort icons
                        $scope.sortField = newSortField;
                        iconSorting("tbl-os", newSortField);
                    };

                    var defaultSort = "pageviews"; // default sorting
                    $scope.sortField = defaultSort;
                    $scope.descending = true; // most pageviews first

                    // change sort icons
                    iconSorting("tbl-os", defaultSort);

                    var chartData = response.data.ChartData;

                    //Create Bar Chart
                    var ctx = document.getElementById("os").getContext("2d");
                    var osChart = new Chart(ctx).Bar(chartData);
                });

                //Get Browser via statsResource - does WebAPI GET call
                statsResource.getosversions(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.osVersions = response.data.ApiResult;

                    // clear existing items
                    $scope.itemsVersions.length = 0;
                    // push objects to items array
                    angular.forEach($scope.osVersions.Rows, function (item) {
                        $scope.itemsVersions.push({
                            v_operatingsystem: item.Cells[0],
                            v_version: item.Cells[1],
                            v_visits: parseInt(item.Cells[2]),
                            v_pageviews: parseInt(item.Cells[3])
                        });
                    });

                    $scope.sortVersion = function (newSortField) {
                        if ($scope.sortField == newSortField)
                            $scope.descending = !$scope.descending;

                        // sort by new field and change sort icons
                        $scope.sortField = newSortField;
                        iconSorting("tbl-osversions", newSortField);
                    };

                    var defaultSort = "v_pageviews"; // default sorting
                    $scope.sortField = defaultSort;
                    $scope.descending = true; // most pageviews first

                    // change sort icons
                    iconSorting("tbl-osversions", defaultSort);
                });

            });
        });
    });