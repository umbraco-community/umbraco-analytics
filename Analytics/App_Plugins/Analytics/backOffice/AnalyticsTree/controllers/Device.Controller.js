angular.module("umbraco").controller("Analytics.DeviceController",
    function ($scope, $location, statsResource, settingsResource) {

        var profileID = "";

        // items list array
        $scope.types = [];
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

                    // clear existing items
                    $scope.types.length = 0;
                    // push objects to items array
                    angular.forEach($scope.devicetypes.Rows, function (item) {
                        $scope.types.push({
                            dt_devicetype: item.Cells[0],
                            dt_visits: parseInt(item.Cells[1]),
                            dt_pageviews: parseInt(item.Cells[2])
                        });
                    });

                    $scope.sort = function (newSortField) {
                        if ($scope.sortField == newSortField)
                            $scope.descending = !$scope.descending;

                        // sort by new field and change sort icons
                        $scope.sortField = newSortField;
                        iconSorting("tbl-devicetypes", newSortField);
                    };

                    var defaultSort = "dt_pageviews"; // default sorting
                    $scope.sortField = defaultSort;
                    $scope.descending = true; // most pageviews first

                    // change sort icons
                    iconSorting("tbl-devicetypes", defaultSort);

                    var chartData = response.data.ChartData;

                    //Create Bar Chart
                    var ctx = document.getElementById("deviceType").getContext("2d");
                    var deviceTypeChart = new Chart(ctx).Bar(chartData);
                });

                //Get Browser specific via statsResource - does WebAPI GET call
                statsResource.getdevices(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.devices = response.data.ApiResult;

                    // clear existing items
                    $scope.items.length = 0;
                    // push objects to items array
                    angular.forEach($scope.devices.Rows, function (item) {
                        $scope.items.push({
                            device: item.Cells[0],
                            model: item.Cells[1],
                            visits: parseInt(item.Cells[2]),
                            pageviews: parseInt(item.Cells[3])
                        });
                    });

                    $scope.sort = function (newSortField) {
                        if ($scope.sortField == newSortField)
                            $scope.descending = !$scope.descending;

                        // sort by new field and change sort icons
                        $scope.sortField = newSortField;
                        iconSorting("tbl-devices", newSortField);
                    };

                    var defaultSort = "pageviews"; // default sorting
                    $scope.sortField = defaultSort;
                    $scope.descending = true; // most pageviews first

                    // change sort icons
                    iconSorting("tbl-devices", defaultSort);
                });

            });
        });
    });