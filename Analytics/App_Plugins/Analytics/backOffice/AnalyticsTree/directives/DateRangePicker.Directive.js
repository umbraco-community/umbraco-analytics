angular.module("umbraco").directive('dateRangePicker', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            ngModel: '=',
        },
        template: '<i class="glyphicon glyphicon-calendar icon-calendar icon-large"></i> <span></span> <b class="caret"></b>',
        link: function (scope, element) {
            $(function () {
                
                element.daterangepicker(
                   {
                       startDate: moment(scope.ngModel.startDate),
                       endDate: moment(scope.ngModel.endDate),
                       minDate: '01/01/1990',
                       maxDate: moment().format("DD/MM/YYYY"),
                       dateLimit: { days: 6000 },
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
                       scope.ngModel = dateFilter;
                      
                       scope.$apply();

                       
                       angular.element(element.children()[1]).html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
                   }
                );
                
                angular.element(element.children()[1]).html(moment(scope.ngModel.startDate).format('MMMM D, YYYY') + ' - ' + moment(scope.ngModel.endDate).format('MMMM D, YYYY'));

            });
        }
    }
});