angular.module("umbraco").controller("Analytics.KeywordController",
    function ($scope, $location, $routeParams, statsResource, settingsResource, navigationService) {

        var profileID = "";

        // items list array
        $scope.items = [];

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
                            keyword: item.Cells[0].Value,
                            visits: parseInt(item.Cells[1].Value),
                            pageviews: parseInt(item.Cells[2].Value)
                        });
                    });
                   
                });

            });
        });

        navigationService.syncTree({ tree: 'analyticsTree', path: ["-1", $routeParams.id], forceReload: false });
    });