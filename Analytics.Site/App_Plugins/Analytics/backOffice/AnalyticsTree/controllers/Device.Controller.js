angular.module("umbraco").controller("Analytics.DeviceController",
    function ($scope, statsResource, assetsService) {

        assetsService.load("/App_Plugins/Analytics/lib/chartjs/chart.0.2.min.js").then(function () {
            
                //Get Browser via statsResource - does WebAPI GET call
                statsResource.getdevicetypes().then(function (response) {
                    $scope.devicetypes = response.data;

                    var chartData = [
                        {
                            value: 30,
                            color: "#F7464A"
                        },
                        {
                            value: 50,
                            color: "#E2EAE9"
                        },
                        {
                            value: 100,
                            color: "#D4CCC5"
                        },
                        {
                            value: 40,
                            color: "#949FB1"
                        },
                        {
                            value: 120,
                            color: "#4D5360"
                        }
                    ];

                    //Get context with jQuery - using jQuery's .get() method.
                    var ctx = $("#deviceType").get(0).getContext("2d");

                    //This will get the first returned node in the jQuery collection.
                    var deviceTypeChart = Chart(ctx).Doughnut(chartData);


                });

                //Get Browser specific via statsResource - does WebAPI GET call
                statsResource.getdevices().then(function (response) {
                    $scope.devices = response.data;
                });
        });

    });