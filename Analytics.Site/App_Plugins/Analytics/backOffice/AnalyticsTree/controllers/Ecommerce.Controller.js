angular.module("umbraco").controller("Analytics.EcommerceController",
    function ($scope, $location, statsResource, settingsResource) {

        var profileID = "";

        // items list array
        $scope.itemProducts = [];
        $scope.itemRevenuePerSource = [];

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
                $scope.currencyCode = $scope.profile.Currency;

                if (profileID == null || profileID == "") {
                    $location.path("/analytics/analyticsTree/edit/settings");
                    return;
                }
                $scope.loadingViews = false;

                //Get Bestsellers via statsResource - does WebAPI GET call
                statsResource.getbestsellers(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.products = response.data.ApiResult;

                    // clear existing items
                    $scope.itemProducts.length = 0;
                    // push objects to items array
                    angular.forEach($scope.products.Rows, function (item) {
                        $scope.itemProducts.push({
                            productSku: item.Cells[0],
                            productName: item.Cells[1],
                            quantity: parseInt(item.Cells[2]),
                            revenue: parseFloat(item.Cells[3])
                        });
                    });

                    $scope.sort = function (newSortField) {
                        if ($scope.sortField == newSortField)
                            $scope.descending = !$scope.descending;

                        // sort by new field and change sort icons
                        $scope.sortField = newSortField;
                        iconSorting("tbl-bestsellers", newSortField);
                    };

                    var defaultSort = "quantity"; // default sorting
                    $scope.sortField = defaultSort;
                    $scope.descending = true; // most amount first

                    // change sort icons
                    iconSorting("tbl-bestsellers", defaultSort);
                });

                //Get Revenue Per Source via statsResource - does WebAPI GET call
                statsResource.getrevenuepersource(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.revenuepersource = response.data.ApiResult;

                    // clear existing items
                    $scope.itemRevenuePerSource.length = 0;
                    // push objects to items array
                    angular.forEach($scope.revenuepersource.Rows, function (item) {
                        // only where there have been a transaction
                        if (parseInt(item.Cells[2]) > 0) {
                            $scope.itemRevenuePerSource.push({
                                r_source: item.Cells[0],
                                r_keyword: item.Cells[1],
                                r_transactions: parseInt(item.Cells[2]),
                                r_revenue: parseFloat(item.Cells[3])
                            });
                        }
                    });

                    $scope.sort = function (newSortField) {
                        if ($scope.sortField == newSortField)
                            $scope.descending = !$scope.descending;

                        // sort by new field and change sort icons
                        $scope.sortField = newSortField;
                        iconSorting("tbl-revenuepersource", newSortField);
                    };

                    var defaultSort = "r_revenue"; // default sorting
                    $scope.sortField = defaultSort;
                    $scope.descending = true; // most revenue first

                    // change sort icons
                    iconSorting("tbl-revenuepersource", defaultSort);
                });

                //Get Store details via statsResource - does WebAPI GET call
                statsResource.getstoredetails(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.storedetails = response.data.ApiResult;

                    var _transactions = $scope.storedetails.Rows[0].Cells[0];
                    var _transactionRevenue = $scope.storedetails.Rows[0].Cells[1];
                    var _itemsPerPurchase = $scope.storedetails.Rows[0].Cells[2];
                    var _itemQuantity = $scope.storedetails.Rows[0].Cells[3];
                    var _conversionRate = $scope.storedetails.Rows[0].Cells[4];

                    $scope.info = {
                        transactions: parseInt(_transactions),
                        revenue: 0.0,
                        avgRevenue: 0.0,
                        itemsPerPurchase: parseFloat(_itemsPerPurchase),
                        itemQuantity: parseInt(_itemQuantity),
                        conversionRate: parseFloat(_conversionRate)
                    }

                    $scope.info.revenue = parseFloat(_transactionRevenue).toFixed(2);
                    $scope.info.avgRevenue = parseFloat(_transactions) > 0 ? (parseFloat(_transactionRevenue) / parseFloat(_transactions)).toFixed(2) : 0.0;
                    $scope.info.conversionRate = $scope.info.conversionRate.toFixed(2);
                });

            });
        });
    });