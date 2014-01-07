angular.module("umbraco").controller("Analytics.ScreenResController",
    function ($scope, $location, statsResource, settingsResource) {

        var profileID = "";

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
                statsResource.getresolutions(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.resolutions = response.data;
                });
            });
        });
    });