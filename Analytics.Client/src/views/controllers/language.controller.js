angular.module("umbraco").controller("Analytics.LanguageController",
    function ($scope, $location, $routeParams, statsResource, settingsResource, navigationService) {

        var profileID = "";

        // items list array
        $scope.items = [];

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
                
                //Get language via statsResource - does WebAPI GET call
                statsResource.getlanguage(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.data = response.data;

                    // clear existing items
                    $scope.items.length = 0;

                    // push objects to items array
                    angular.forEach($scope.data.Rows, function (item) {
                        $scope.items.push({
                            language: item.Cells[0].Value,
                            visits: parseInt(item.Cells[1].Value),
                            pageviews: parseInt(item.Cells[2].Value)
                        });
                    });

                });

            });
        });

        navigationService.syncTree({ tree: 'analyticsTree', path: ["-1", $routeParams.id], forceReload: false });
    });