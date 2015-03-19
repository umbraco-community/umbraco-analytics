angular.module("umbraco").controller("Analytics.SettingsController",
    function ($scope, $routeParams, settingsResource, notificationsService, localizationService, navigationService) {

        //By default user has not authorised
        var hasUserAuthd = false;

        //Get all settings via settingsResource - does WebAPI GET call
        settingsResource.getall().then(function (response) {
            $scope.settings = response.data;
        });

        //Get Account JSON & bind back to dropdown
        settingsResource.getaccount().then(function (response) {
            if (response.data === "null") {
                $scope.selectedaccount = null;
            }
            else {
                $scope.selectedaccount = response.data;
            }
        });

        //Get Profile JSON & bind back to dropdown
        settingsResource.getprofile().then(function (response) {
            if (response.data === "null") {
                $scope.selectedprofile = null;
            }
            else {
                $scope.selectedprofile = response.data;
            }
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

                    if ($scope.selectedaccount != null) {
                        $scope.selectedaccount = _.where($scope.accounts, { Id: $scope.selectedaccount.Id })[0];
                        
                        settingsResource.getprofiles($scope.selectedaccount.Id).then(function (response) {
                            $scope.profiles = response.data;
                            if ($scope.selectedprofile != null) {
                                $scope.selectedprofile = _.where($scope.profiles, { Id: $scope.selectedprofile.Id })[0];
                            }
                        });
                    }
                });


                //When an account is selected
                $scope.accountSelected = function (selectedAccount) {
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

            //Save settings resource - does a WebAPI POST call
            settingsResource.save(settings).then(function (response) {
                $scope.settings = response.data;

                //Display Success message
                notificationsService.success(localizationService.localize("analytics_settingsSaved"));
            });

            //Save settings resource - does a WebAPI POST call
            settingsResource.saveAccount(account).then(function (response) {
                //Don't need anything from response.data back

                //Display Success message
                notificationsService.success(localizationService.localize("analytics_accountDetailsSaved"));
            });

            //Save settings resource - does a WebAPI POST call
            settingsResource.saveProfile(profile).then(function (response) {
                //Don't need anything from response.data back

                //Display Success message
                notificationsService.success(localizationService.localize("analytics_profileDetailsSaved"));

                //Sync ('refresh') the tree!
                navigationService.syncTree({ tree: 'analyticsTree', path: [-1, $routeParams.id], forceReload: true, activate: true });
            });

        };

        navigationService.syncTree({ tree: 'analyticsTree', path: ["-1", $routeParams.id], forceReload: false });
    });