angular.module("umbraco").controller("Analytics.DeviceController",
    function ($scope, statsResource, settingsResource) {

        var profileID = "";

        //Get Profile
        settingsResource.getprofile().then(function(response) {
            $scope.profile = response.data;
            profileID = response.data.Id;

            //Get Browser via statsResource - does WebAPI GET call
            statsResource.getdevicetypes(profileID).then(function (response) {
                $scope.devicetypes = response.data;

                //For labels (need to loop over our API JSON and create an array for labels)
                //For data (need to loop over our API JSON)
                //First dataset is Visits, second is pageviews
                var chartData = {
                    labels: ["Desktop", "Mobile", "Tablet"],
                    datasets: [
                        {
                            fillColor: "rgba(245,112, 32,0.5)",
                            strokeColor: "rgba(245, 112, 32, 1)",
                            data: [87736, 2880, 2057]
                        },
                        {
                            fillColor: "rgba(245,112, 32,0.5)",
                            strokeColor: "rgba(245, 112, 32, 1)",
                            data: [236897, 5711, 5623]
                        }
                    ]
                };

                //Create Bar Chart
                var ctx = document.getElementById("deviceType").getContext("2d");
                var deviceTypeChart = new Chart(ctx).Bar(chartData);
            });

            //Get Browser specific via statsResource - does WebAPI GET call
            statsResource.getdevices(profileID).then(function (response) {
                $scope.devices = response.data;
            });

        });

    });