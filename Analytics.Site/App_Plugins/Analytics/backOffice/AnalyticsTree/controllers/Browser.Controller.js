angular.module("umbraco").controller("Analytics.BrowserController",
    function ($scope, statsResource, settingsResource) {

        var profileID = "";

        //Get Profile
        settingsResource.getprofile().then(function (response) {
            $scope.profile  = response.data;
            profileID = response.data.Id;

            //Get Browser via statsResource - does WebAPI GET call
            statsResource.getbrowsers(profileID).then(function (browserResponse) {
                $scope.browsers = browserResponse.data;
            });

            //Get Browser specific via statsResource - does WebAPI GET call
            statsResource.getbrowserspecifics(profileID).then(function (browserSpecificResponse) {
                $scope.browserspecifics = browserSpecificResponse.data;
            });

        });

    });