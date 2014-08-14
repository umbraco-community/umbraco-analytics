angular.module("umbraco").controller("Analytics.SalesPerformanceController",
    function ($scope, $location, statsResource, settingsResource) {

        var profileID = "";

        // items list array
        $scope.itemSales = [];

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
                statsResource.getsalesperformancecharts(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    var chartData = response.data;

                    //Create Line Chart
                    var ctx = document.getElementById("viewSalesPerformance").getContext("2d");
                    var viewSalesPerformanceChart = new Chart(ctx).Line(chartData, {
                        bezierCurve: false,
                        scaleBeginAtZero: true
                    });
                });

                //Get Browser specific via statsResource - does WebAPI GET call
                statsResource.getsalesperformance(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.salesperformance = response.data.ApiResult;

                    // clear existing items
                    $scope.itemSales.length = 0;
                    // push objects to items array
                    angular.forEach($scope.salesperformance.Rows, function (item) {
                        var year = item.Cells[0].slice(0, 4);
                        var month = item.Cells[0].slice(4, 6);
                        var day = item.Cells[0].slice(6, 8);
                        $scope.itemSales.push({
                            date: new Date(year, month, day), // yyyyMMdd --> yyyy-MM-dd
                            uniquePurchases: parseInt(item.Cells[2]),
                            revenue: parseFloat(item.Cells[1])
                        });
                    });

                    $scope.sort = function (newSortField) {
                        if ($scope.sortField == newSortField)
                            $scope.descending = !$scope.descending;

                        // sort by new field and change sort icons
                        $scope.sortField = newSortField;
                        iconSorting("tbl-salesperformance", newSortField);
                    };

                    var defaultSort = "date"; // default sorting
                    $scope.sortField = defaultSort;
                    $scope.descending = true; // most pageviews first

                    // change sort icons
                    iconSorting("tbl-salesperformance", defaultSort);
                });

            });
        });
    });

// sample use {{ value | currency:"USD" }}
angular.module('filters', []).filter('currency', function () {
    return function (number, currencyCode) {
        var currency = {
            USD: "$",
            GBP: "£",
            AUD: "$",
            EUR: "€",
            CAD: "$",
            MIXED: "~"
        },
        thousand, decimal, format;
        if ($.inArray(currencyCode, ["USD", "AUD", "CAD", "MIXED"]) >= 0) {
            thousand = ",";
            decimal = ".";
            format = "%s %v";
        } else {
            thousand = ".";
            decimal = ",";
            format = "%s %v";
        };
        return accounting.formatMoney(number, currency[currencyCode], 2, thousand, decimal, format);
    };
});