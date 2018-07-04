angular.module("umbraco")
    .service('dateRangeService', function ($rootScope, analyticsSettingsResource) {
        var filter =  analyticsSettingsResource.getDateFilter();
        return {
            getFilter: function() {
                return filter;
            },
            setFilter: function (filt) {
                analyticsSettingsResource.setDateFilter(filt.startDate, filt.endDate);
                filter.startDate = filt.startDate;
                filter.endDate = filt.endDate;
                console.log("broad start");
                $rootScope.$broadcast('DateFilterChanged', filter);
                console.log("broad end");
            }
        };
    })