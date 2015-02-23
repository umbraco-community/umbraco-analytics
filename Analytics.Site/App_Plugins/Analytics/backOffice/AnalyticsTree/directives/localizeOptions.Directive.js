angular.module("umbraco.directives").directive('localizeOption', function (localizationService) {
    return {
        restrict: 'A',
        link: function ($scope, element, attrs, controller) {
            var key = attrs.localizeOption;

            localizationService.localize(key).then(function (value) {
                element.text(value);
            });
        }
    }
});