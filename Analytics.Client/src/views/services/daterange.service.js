angular.module("umbraco")
    .service('dateRangeService', function ($rootScope, settingsResource) {
        var filter =  settingsResource.getDateFilter();
        return {
            getFilter: function() {
                return filter;
            },
            setFilter: function (filt) {
                settingsResource.setDateFilter(filt.startDate, filt.endDate);
                filter.startDate = filt.startDate;
                filter.endDate = filt.endDate;
                console.log("broad start");
                $rootScope.$broadcast('DateFilterChanged', filter);
                console.log("broad end");
            }
        };
    })