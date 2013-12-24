angular.module("umbraco").controller("Analytics.ViewController",
    function ($scope, $routeParams, assetsService) {

        //Currently loading /umbraco/general.html
        //Need it to look at /App_Plugins/

        var viewName = $routeParams.id;
        viewName = viewName.replace('%20', '-').replace(' ', '-');

        $scope.templatePartialURL = '../App_Plugins/Analytics/backoffice/analyticsTree/partials/' + viewName + '.html';
        $scope.sectionName = $routeParams.id;
 



    });