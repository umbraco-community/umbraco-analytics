angular.module("umbraco").controller('Analytics.ViewController', ['$scope', '$routeParams', function ($scope, $routeParams) {

        //Currently loading /umbraco/general.html
        //Need it to look at /App_Plugins/
        //$scope.dateFilter = settingsResource.getDateFilter();
        //$scope.$watch('dateFilter', function () {
        //    console.log("parent watch");
        //});
        
        var viewName = $routeParams.id;
        viewName = viewName.replace('%20', '-').replace(' ', '-');

        $scope.templates =
            [{ name: 'template1.html', url: 'template1.html' },
            { name: 'template2.html', url: 'template2.html' }];
        $scope.template = $scope.templates[0];

        $scope.templatePartialURL = '../App_Plugins/Analytics/backoffice/analyticsTree/partials/' + viewName + '.html';

        console.log('partial url', $scope.templatePartialURL);

        $scope.sectionName = $routeParams.id;
}]);