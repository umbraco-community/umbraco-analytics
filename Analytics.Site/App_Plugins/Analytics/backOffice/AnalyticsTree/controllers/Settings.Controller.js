angular.module("umbraco").controller("Analytics.SettingsController",
    function ($scope, $window, $location, settingsResource, notificationsService) {

        //Get all settings via settingsResource - does WebAPI GET call
        settingsResource.getall().then(function (response) {
            $scope.settings = response.data;
        });

        //Show Auth?
        //TODO: Check if token from oAuth exists or not
        $scope.showAuth = true;

        //Auth - Click
        $scope.auth = function () {

            // TODO Load settings from settings object
            var clientID = "805395301940-duj60glgp6uat7v23lu084bf6arcag4j.apps.googleusercontent.com";
            var redirectUri = "http://localhost:62315/App_Plugins/Analytics/backoffice/oAuth.aspx";

            //Open a dialog window to oAuth
            var popup = window.open("https://accounts.google.com/o/oauth2/auth?response_type=code&scope=https://www.googleapis.com/auth/analytics.readonly&redirect_uri=" + redirectUri + "&client_id=" + clientID + "&approval_prompt=force&include_granted_scopes=true&access_type=offline", "oAuthAnayltics", "location=0,status=0,width=800,height=400");


            angular.element(window).bind('message', function (event) {
                event = event.originalEvent || event;
                if (event.source == popup && event.origin == window.location.origin) {
                    //TODO Way to update the view
                    $window.location.reload();
                }
            });
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