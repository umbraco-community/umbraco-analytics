angular.module("umbraco").controller("Analytics.ViewController",
    function ($scope, $routeParams, assetsService) {

        //Currently loading /umbraco/general.html
        //Need it to look at /App_Plugins/

        var viewName = $routeParams.id;
        viewName = viewName.replace('%20', '-').replace(' ', '-');

        $scope.templatePartialURL = '../App_Plugins/Analytics/backoffice/analyticsTree/partials/' + viewName + '.html';
        $scope.sectionName = $routeParams.id;
 
        assetsService.load(
                ["/App_Plugins/Analytics/lib/momentjs/moment.min.js",
                "/App_Plugins/Analytics/lib/daterangepicker/daterangepicker.js"])
            .then(function () {

                $('#reportrange').daterangepicker(
                   {
                       startDate: moment().subtract('days', 29),
                       endDate: moment(),
                       minDate: '01/01/2012',
                       maxDate: '12/31/2014',
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
                       console.log("Callback has been called!");
                       $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
                   }
                );
                //Set the initial state of the picker label
                $('#reportrange span').html(moment().subtract('days', 29).format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));
            
            });


    });