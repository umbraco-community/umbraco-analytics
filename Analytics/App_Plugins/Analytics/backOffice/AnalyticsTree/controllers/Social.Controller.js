angular.module("umbraco").controller("Analytics.SocialController",
    function ($scope, $location, statsResource, settingsResource) {
        
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

                    var chartData = response.data.ChartData;

                    //Create Bar Chart
                    var ctx = document.getElementById("social").getContext("2d");
                    var socialChart = new Chart(ctx).Bar(chartData);
                });
            });
        });
    });