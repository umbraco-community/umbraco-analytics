angular.module("umbraco").controller("Analytics.LanguageController",
    function ($scope, statsResource, settingsResource) {

        var profileID = "";

        $scope.dateFilter = settingsResource.getDateFilter();

        $scope.$watch('dateFilter', function () {
            
            settingsResource.setDateFilter($scope.dateFilter.startDate, $scope.dateFilter.endDate);
            //Get Profile
            settingsResource.getprofile().then(function(response) {
                $scope.profile = response.data;
                profileID = response.data.Id;

                //Get language via statsResource - does WebAPI GET call
                statsResource.getlanguage(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.data = response.data;
                });

            });
        });
    });