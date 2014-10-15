angular.module('filters', []).filter('currency', function () {
    return function (number, currencyCode) {
        var currency = {
            USD: "$",
            GBP: "£",
            AUD: "$",
            EUR: "€",
            CAD: "$",
            MIXED: "~"
        },
        thousand, decimal, format;
        if ($.inArray(currencyCode, ["USD", "AUD", "CAD", "MIXED"]) >= 0) {
            thousand = ",";
            decimal = ".";
            format = "%s %v";
        } else {
            thousand = ".";
            decimal = ",";
            format = "%s %v";
        };
        return accounting.formatMoney(number, currency[currencyCode], 2, thousand, decimal, format);
    };
});