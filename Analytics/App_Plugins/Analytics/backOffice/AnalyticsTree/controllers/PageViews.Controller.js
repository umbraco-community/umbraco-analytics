angular.module("umbraco").controller("Analytics.PageViewsController",
    function ($scope, statsResource, settingsResource, assetsService) {

        var profileID = "";



        assetsService.load(
                ["/App_Plugins/Analytics/lib/momentjs/moment.min.js",
                "/App_Plugins/Analytics/lib/daterangepicker/daterangepicker.js"])
            .then(function () {

                $scope.startDate = moment().subtract('days', 29).format("YYYY-MM-DD");
                $scope.endDate = moment().format("YYYY-MM-DD");

                console.log($scope.startDate);
                console.log($scope.endDate);

                //Get Profile
                settingsResource.getprofile().then(function (response) {
                    $scope.profile = response.data;
                    profileID = response.data.Id;

                    //Get Browser via statsResource - does WebAPI GET call
                    statsResource.getvisits(profileID, $scope.startDate, $scope.endDate).then(function (response) {
                        $scope.views = response.data;
                    });

                    //Get Browser specific via statsResource - does WebAPI GET call
                    statsResource.getsources(profileID).then(function (response) {
                        $scope.sources = response.data;
                    });

                });

                $('#reportrange').daterangepicker(
                   {
                       startDate: $scope.startDate,
                       endDate: $scope.endDate,
                       minDate: '01/01/2012',
                       maxDate: moment().format("MM/DD/YYYY"),
                       dateLimit: { days: 60 },
                       showDropdowns: true,
                       showWeekNumbers: true,
                       timePicker: false,
                       timePickerIncrement: 1,
                       timePicker12Hour: true,
                       ranges: {
                           'Today': [moment(), moment()],
                           'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
                           'Last 7 Days': [moment().subtract('days', 6), moment()],
                           'Last 30 Days': [moment().subtract('days', 29), moment()],
                           'This Month': [moment().startOf('month'), moment().endOf('month')],
                           'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
                       },
                       opens: 'left',
                       buttonClasses: ['btn btn-default'],
                       applyClass: 'btn-small btn-primary',
                       cancelClass: 'btn-small',
                       format: 'MM/DD/YYYY',
                       separator: ' to ',
                       locale: {
                           applyLabel: 'Submit',
                           fromLabel: 'From',
                           toLabel: 'To',
                           customRangeLabel: 'Custom Range',
                           daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                           monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                           firstDay: 1
                       }
                   },
                   function (start, end) {
                       statsResource.getvisits(profileID, start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')).then(function (response) {
                           $scope.views = response.data;
                       });
                   }
                );
                //Set the initial state of the picker label
                $('#reportrange span').html(moment().subtract('days', 29).format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));

            });


    });