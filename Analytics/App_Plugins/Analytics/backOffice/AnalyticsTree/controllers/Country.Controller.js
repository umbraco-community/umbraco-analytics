angular.module("umbraco").controller("Analytics.CountryController",
    function ($scope, statsResource, settingsResource, assetsService) {

        var profileID = "";


        assetsService.loadJs('http://www.google.com/jsapi')
            .then(function () {
                google.load("visualization", "1",
                {
                    callback: initChart,
                    packages: ['geochart']
                });
            });

        function initChart() {
            //Get Profile
            settingsResource.getprofile().then(function(response) {
                $scope.profile = response.data;
                profileID = response.data.Id;

                //Get Countires via statsResource - does WebAPI GET call
                statsResource.getcountries(profileID).then(function(response) {
                    $scope.data = response.data;


                    var chartMapData = google.visualization.arrayToDataTable([
                              ['Country', 'Page Views'],
                              ['Germany', 200],
                              ['United States', 300],
                              ['Brazil', 400],
                              ['Canada', 500],
                              ['France', 600],
                              ['RU', 700]
                    ]);

                    //Options for map (currently use defaults)
                    var options = {};

                    //Create the GeoChart with the countryChart DIV
                    var geochart = new google.visualization.GeoChart(document.getElementById('countryChart'));

                    //Draw the chart with the data & options
                    geochart.draw(chartMapData, options);

                });
            });
        };

    });