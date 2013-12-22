angular.module("umbraco").controller("Analytics.SettingsController",
    function ($scope, settingsResource, notificationsService) {

        //By default user has not authorised
        var hasUserAuthd = false;

        //Get all settings via settingsResource - does WebAPI GET call
        settingsResource.getall().then(function (response) {
            $scope.settings = response.data;
        });

        //Get oAuth Check - WebAPI GET (Basically checks if RefreshToken has a value)
        settingsResource.checkauth().then(function (response) {

            //Show or hide the auth button (set on scope & local var for if check)
            hasUserAuthd = response.data === "true";

            //Apply
            $scope.$apply(function () {
                $scope.hasAuthd = hasUserAuthd;
            });

            //Only load/fetch if showAuth is true
            if (hasUserAuthd === true) {

                //Get all accounts via settingsResource - does WebAPI GET call
                settingsResource.getaccounts().then(function (response) {
                    $scope.accounts = response.data;
                });

                //When an account is selected
                $scope.accountSelected = function (selectedAccount) {
                    console.log(selectedAccount);

                    settingsResource.getprofiles(selectedAccount.Id).then(function (response) {
                        $scope.profiles = response.data;
                    });
                };
            }
        });

        //Auth - Click
        $scope.auth = function () {

            //Open a dialog window to oAuth
            //It will callback to http://analytics-oauth.azurewebsites.net/callback/oAuth.aspx?origin=http://localhost:62315
            window.open("/App_Plugins/analytics/backoffice/OAuth.aspx", "oAuthAnayltics", "location=0,status=0,width=600,height=600");
        };

        //Save - click...
        $scope.save = function (settings, account, profile) {

            console.log("From Controller Pre Save");
            console.log(settings);
            console.log(account);
            console.log(profile);

            //Save settings resource - does a WebAPI POST call
            settingsResource.save(settings).then(function (response) {
                $scope.settings = response.data;
                
                //Display Success message
                notificationsService.success("Success settings have been saved");
            });

            //Save settings resource - does a WebAPI POST call
            settingsResource.saveAccount(account).then(function (response) {
                //Don't need anything from response.data back

                //Display Success message
                notificationsService.success("Success account details have been saved");
            });

            //Save settings resource - does a WebAPI POST call
            settingsResource.saveProfile(profile).then(function (response) {
                //Don't need anything from response.data back

                //Display Success message
                notificationsService.success("Success profile details have been saved");
            });
        };

    });