angular.module("umbraco").controller("Analytics.BrowserController",
    function ($scope, assetsService, notificationsService) {

        //tell the assetsService to load the markdown.editor libs from the markdown editors
        //plugin folder
        assetsService
            .load([
                "/App_Plugins/Analytics/lib/chartjs/chart.0.2.min.js",
                "/App_Plugins/Analytics/lib/angles/angles.js"
            ])
            .then(function () {
                //this function will execute when all dependencies have loaded
                notificationsService.success("Yipee", "ChartJS has been loaded in");
                
                $scope.myChartData = [
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

                $scope.myChartOptions = {
                    //Boolean - Whether we should show a stroke on each segment
                    segmentShowStroke: true,

                    //String - The colour of each segment stroke
                    segmentStrokeColor: "#fff",

                    //Number - The width of each segment stroke
                    segmentStrokeWidth: 24,

                    //The percentage of the chart that we cut out of the middle.
                    percentageInnerCutout: 50,

                    //Boolean - Whether we should animate the chart
                    animation: true,

                    //Number - Amount of animation steps
                    animationSteps: 100,

                    //String - Animation easing effect
                    animationEasing: "easeOutBounce",

                    //Boolean - Whether we animate the rotation of the Doughnut
                    animateRotate: true,

                    //Boolean - Whether we animate scaling the Doughnut from the centre
                    animateScale: false,

                    //Function - Will fire on animation completion.
                    onAnimationComplete: null
                };
                
            });
        
        
    });