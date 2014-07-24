angular.module("umbraco").controller("Analytics.TransactionController",
    function ($scope, $location, statsResource, settingsResource, assetsService) {

        var profileID = "";

        // items list array
        $scope.itemTransactions = [];

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
                statsResource.gettransactionscharts(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    var chartData = response.data;

                    //Create Line Chart
                    var ctx = document.getElementById("viewTransactions").getContext("2d");
                    var viewTransactionsChart = new Chart(ctx).Line(chartData, {
                        bezierCurve: false,
                        scaleBeginAtZero: true
                    });
                });

                //Get Browser specific via statsResource - does WebAPI GET call
                statsResource.gettransactions(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.transactions = response.data.ApiResult;

                    // clear existing items
                    $scope.itemTransactions.length = 0;
                    // push objects to items array
                    angular.forEach($scope.transactions.Rows, function (item) {
                        $scope.itemTransactions.push({
                            transactionId: item.Cells[0],
                            quantity: parseInt(item.Cells[1]),
                            revenue: parseFloat(item.Cells[2])
                        });
                    });

                    $scope.sort = function (newSortField) {
                        if ($scope.sortField == newSortField)
                            $scope.descending = !$scope.descending;

                        // sort by new field and change sort icons
                        $scope.sortField = newSortField;
                        iconSorting("tbl-transactions", newSortField);
                    };

                    var defaultSort = "transactionId"; // default sorting
                    $scope.sortField = defaultSort;
                    $scope.descending = true; // most pageviews first

                    // change sort icons
                    iconSorting("tbl-transactions", defaultSort);
                });

            });
        });

        //load the seperat css for the editor to avoid it blocking our js loading
        assetsService.loadCss("/umbraco/assets/css/umbraco.css");
        assetsService.loadCss("/App_Plugins/Analytics/backOffice/AnalyticsTree/icons/css/font-awesome.css");
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
            format = "%s%v";
        } else {
            thousand = ".";
            decimal = ",";
            format = "%s%v";
        };
        return accounting.formatMoney(number, currency[currencyCode], 2, thousand, decimal, format);
    };
});