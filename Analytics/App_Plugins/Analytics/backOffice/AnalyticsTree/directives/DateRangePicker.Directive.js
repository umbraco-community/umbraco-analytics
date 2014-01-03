angular.module("umbraco").directive('dateRangePicker', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            $(function () {

                console.log("value in directive");
                console.log(ctrl.$viewValue);
                console.log(ctrl.$viewValue.startDate);

                
                element.daterangepicker(
                   {
                       startDate: moment(ctrl.$viewValue.startDate),
                       endDate: moment(ctrl.$viewValue.endDate),
                       minDate: '01/01/2010',
                       maxDate: moment().format("DD/MM/YYYY"),
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
                       format: 'DD/MM/YYYY',
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
                      
                       //settingsResource.setDateFilter(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));

                       var dateFilter = {};
                       dateFilter.startDate = start.format('YYYY-MM-DD');
                       dateFilter.endDate = end.format('YYYY-MM-DD');
                       ctrl.$setViewValue(dateFilter);
                       scope.$apply();
                       
                       angular.element(element.children()[1]).html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
                   }
                );
                
                angular.element(element.children()[1]).html(moment(ctrl.$viewValue.startDate).format('MMMM D, YYYY') + ' - ' + moment(ctrl.$viewValue.endDate).format('MMMM D, YYYY'));

            });
        }
    }
});