angular.module("umbraco").controller("Analytics.ProductPerformanceController",
    function ($scope, $location, statsResource, settingsResource) {

        var profileID = "";

        // items list array
        $scope.itemProducts = [];

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
            settingsResource.getprofile().then(function (response) {
                $scope.profile = response.data;
                profileID = response.data.Id;

                if (profileID == null || profileID == "") {
                    $location.path("/analytics/analyticsTree/edit/settings");
                    return;
                }
                $scope.loadingViews = false;

                //Get chart data for monthly visit chart
                statsResource.getproductperformancecharts(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    var chartData = response.data;

                    //Create Line Chart
                    var ctx = document.getElementById("viewProductPerformance").getContext("2d");
                    var viewProductPerformanceChart = new Chart(ctx).Line(chartData, {
                        bezierCurve: false,
                        scaleBeginAtZero: true
                    });
                });

                //Get Browser specific via statsResource - does WebAPI GET call
                statsResource.getproductperformance(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.productperformance = response.data.ApiResult;

                    // clear existing items
                    $scope.itemProducts.length = 0;
                    // push objects to items array
                    angular.forEach($scope.productperformance.Rows, function (item) {
                        $scope.itemProducts.push({
                            productSku: item.Cells[0],
                            productName: item.Cells[1],
                            uniquePurchases: parseInt(item.Cells[2]),
                            revenue: parseFloat(item.Cells[3]),
                            revenuePerItem: parseFloat(item.Cells[4]),
                            itemsPerPurchase: parseFloat(item.Cells[5])
                        });
                    });

                    $scope.sort = function (newSortField) {
                        if ($scope.sortField == newSortField)
                            $scope.descending = !$scope.descending;

                        // sort by new field and change sort icons
                        $scope.sortField = newSortField;
                        iconSorting("tbl-productperformance", newSortField);
                    };

                    var defaultSort = "revenue"; // default sorting
                    $scope.sortField = defaultSort;
                    $scope.descending = true; // most pageviews first

                    // change sort icons
                    iconSorting("tbl-productperformance", defaultSort);
                });

            });
        });
    });