angular.module("umbraco").controller("Analytics.EcommerceController",
    function ($scope, $location, $routeParams, statsResource, settingsResource, navigationService) {

        var profileID = "";

        // items list array
        $scope.itemProducts = [];
        $scope.itemRevenuePerSource = [];

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
                            productSku: item.Cells[0].Value,
                            productName: item.Cells[1].Value,
                            quantity: parseInt(item.Cells[2].Value),
                            revenue: parseFloat(item.Cells[3].Value)
                        });
                    });

                });

                //Get Revenue Per Source via statsResource - does WebAPI GET call
                statsResource.getrevenuepersource(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.revenuepersource = response.data.ApiResult;

                    // clear existing items
                    $scope.itemRevenuePerSource.length = 0;

                    // push objects to items array
                    angular.forEach($scope.revenuepersource.Rows, function (item) {
                        // only where there have been a transaction
                        var numberOfTransactions = parseInt(item.Cells[2].Value);
                        if (numberOfTransactions > 0) {
                            $scope.itemRevenuePerSource.push({
                                r_source: item.Cells[0].Value,
                                r_keyword: item.Cells[1].Value,
                                r_transactions: numberOfTransactions,
                                r_revenue: parseFloat(item.Cells[3].Value)
                            });
                        }
                    });

                });

                //Get Store details via statsResource - does WebAPI GET call
                statsResource.getstoredetails(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.storedetails = response.data.ApiResult;

                    var _transactions = $scope.storedetails.Rows[0].Cells[0].Value;
                    var _transactionRevenue = $scope.storedetails.Rows[0].Cells[1].Value;
                    var _itemsPerPurchase = $scope.storedetails.Rows[0].Cells[2].Value;
                    var _itemQuantity = $scope.storedetails.Rows[0].Cells[3].Value;
                    var _conversionRate = $scope.storedetails.Rows[0].Cells[4].Value;

                    $scope.info = {
                        transactions: parseInt(_transactions),
                        revenue: 0.0,
                        avgRevenue: 0.0,
                        itemsPerPurchase: parseFloat(_itemsPerPurchase).toFixed(2),
                        itemQuantity: parseInt(_itemQuantity),
                        conversionRate: parseFloat(_conversionRate)
                    }

                    $scope.info.revenue = parseFloat(_transactionRevenue).toFixed(2);
                    $scope.info.avgRevenue = parseFloat(_transactions) > 0 ? (parseFloat(_transactionRevenue) / parseFloat(_transactions)).toFixed(2) : 0.0;
                    $scope.info.conversionRate = $scope.info.conversionRate.toFixed(2);
                });

            });
        });

        navigationService.syncTree({ tree: 'analyticsTree', path: ["-1", $routeParams.id], forceReload: false });
    });