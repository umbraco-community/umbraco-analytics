angular.module("umbraco").controller("Analytics.SettingsController",
    function ($scope, settingsResource, notificationsService) {

        //Get all settings via settingsResource - does WebAPI GET call
        settingsResource.getall().then(function (response) {
            $scope.settings = response.data;
        });

        //Show Auth?
        //TODO: Check if token from oAuth exists or not
        $scope.showAuth = true;

        //Auth - Click
        $scope.auth = function () {

            //Open a dialog window to oAuth
            window.open("http://google.com", "oAuthAnayltics", "location=0,status=0,width=800,height=400");

            //It will callback to http://analytics-oauth.azurewebsites.net/callback/oAuth.aspx?origin=http://localhost:62315

            //Once we have got token at anlytics.com site in popup

            //It does a WebAPI post to the Umbraco Site
            //http://localhost:62315/umbraco/Analytics/oAuthApi/PostSettingValue?key=refreshToken&value=blah

            //Once got OK back from WebAPI that the setting file has been posted/updated

            //Close Popup Window

            //Set showAuth to false

            //Maybe show a sucess message with ng-show perhaps in it's place?
        };

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