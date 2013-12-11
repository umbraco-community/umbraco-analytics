angular.module("umbraco").controller("Analytics.SettingsController",
    function ($scope, settingsResource, notificationsService) {

        //Get all settings via settingsResource - does WebAPI GET call
        settingsResource.getall().then(function (response) {
            $scope.settings = response.data;
        });

        //Save - click...
        $scope.save = function (settings) {
            
            //Save settings resource - does a WebAPI POST call
            settingsResource.save(settings).then(function (response) {
                $scope.settings = response.data;
                
                //Display Success message
                notificationsService.success("Success settings have been saved");
            });
        };
        
    });