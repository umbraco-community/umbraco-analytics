angular.module("umbraco").controller("Analytics.KeywordController",
    function ($scope, $location, statsResource, settingsResource, assetsService) {

        var profileID = "";

        // items list array
        $scope.items = [];

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

        $scope.sort = function (newSortField) {
            if ($scope.sortField == newSortField)
                $scope.descending = !$scope.descending;

            // sort by new field and change sort icons
            $scope.sortField = newSortField;
            iconSorting("tbl-keywords", newSortField);
        };

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
                statsResource.getkeywords(profileID,$scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.keywords = response.data.ApiResult;

                    // clear existing items
                    $scope.items.length = 0;
                    // push objects to items array
                    angular.forEach($scope.keywords.Rows, function (item) {
                        $scope.items.push({
                            keyword: item.Cells[0],
                            visits: parseInt(item.Cells[1]),
                            pageviews: parseInt(item.Cells[2])
                        });
                    });
                    
                    var defaultSort = "pageviews"; // default sorting
                    $scope.sortField = defaultSort;
                    $scope.descending = true; // most pageviews first

                    // change sort icons
                    iconSorting("tbl-keywords", defaultSort);

                    //var chartData = response.data.ChartData;

                    ////Create Bar Chart
                    //var ctx = document.getElementById("keywords").getContext("2d");
                    //var keywordsChart = new Chart(ctx).Bar(chartData);
                });

            });
        });

        //load the seperat css for the editor to avoid it blocking our js loading
        assetsService.loadCss("/umbraco/assets/css/umbraco.css");
        assetsService.loadCss("/App_Plugins/Analytics/backOffice/AnalyticsTree/icons/css/font-awesome.css");
    });