var app = angular.module("umbraco");

//Only need to inject/requires the tableSort module once
//As when done all other controllers will have access to it
app.requires.push('tableSort');

app.controller("Analytics.BrowserController",
    function ($scope, $location, $routeParams, statsResource, settingsResource, localizationService, navigationService) {

        var profileID = "";

        // items list array
        $scope.items = [];
        $scope.itemSpecs = [];

        $scope.loadingViews = true;
        $scope.dateFilter = settingsResource.getDateFilter();

        $scope.$watch('dateFilter', function () {
            $scope.loadingViews = true;
            settingsResource.setDateFilter($scope.dateFilter.startDate, $scope.dateFilter.endDate);
            //Get Profile
            settingsResource.getprofile().then(function (response) {
                $scope.profile  = response.data;
                profileID = response.data.Id;

                if (profileID == null || profileID == "") {
                    $location.path("/analytics/analyticsTree/edit/settings");
                    return;
                } else {
                
                    //Get Browser via statsResource - does WebAPI GET call
                    statsResource.getbrowsers(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                        $scope.browsers = response.data.ApiResult;

                        var chartData = response.data.ChartData;

                        var canvasId = "browsers";
                        var canvas = document.getElementById(canvasId),
                            canvasWidth = canvas.clientWidth,
                            canvasHeight = canvas.clientHeight;

                        // Replace the chart canvas element
                        $('#' + canvasId).replaceWith('<canvas id="' + canvasId + '" width="' + canvasWidth + '" height="' + canvasHeight + '"></canvas>');

                        var options = {
                            labelTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\">"
                                + "<% for (var i=0; i<datasets.length; i++){%>"
                                + "<li><span style=\"background-color:<%=datasets[i].fillColor%>;border-color:<%=datasets[i].strokeColor%>\"></span>"
                                + "<%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%>"
                                + "</ul>"
                        };

                        // Draw the chart / Create Bar Chart
                        var ctx = $('#' + canvasId).get(0).getContext("2d");
                        var browsersChart = new Chart(ctx).Bar(chartData, options);

                        // Create legend
                        var legendHolder = document.createElement('div');
                        legendHolder.className = "chart-legend-holder";
                        legendHolder.innerHTML = browsersChart.generateLegend();

                        var helpers = Chart.helpers;
                        helpers.each(legendHolder.firstChild.childNodes, function (legendNode, index) {
                            if (index == 0) {
                                localizationService.localize("analytics_visits").then(function (value) {
                                    var text = value != null ? value : "Visits";
                                    var t = document.createTextNode(text);
                                    legendNode.appendChild(t);
                                    legendNode.className = "first";
                                });
                            }
                            else if (index == 1) {
                                localizationService.localize("analytics_pageViews").then(function (value) {
                                    var text = value != null ? value : "Page Views";
                                    var t = document.createTextNode(text);
                                    legendNode.appendChild(t);
                                    legendNode.className = "second";
                                });
                            }
                        });

                        // ensure legend not gets added multiple times
                        $(".chart-legend-holder").remove();
                        browsersChart.chart.canvas.parentNode.appendChild(legendHolder);

                        // clear existing items
                        $scope.items.length = 0;

                        // push objects to items array
                        angular.forEach($scope.browsers.Rows, function (item) {
                            $scope.items.push({
                                browser: item.Cells[0].Value,
                                visits: parseInt(item.Cells[1].Value),
                                pageviews: parseInt(item.Cells[2].Value)
                            });
                        });

                    });

                    //Get Browser specific via statsResource - does WebAPI GET call
                    statsResource.getbrowserspecifics(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                        $scope.browserspecifics = response.data.ApiResult;
                        $scope.loadingViews = false;

                        // clear existing items
                        $scope.itemSpecs.length = 0;

                        // push objects to items array
                        angular.forEach($scope.browserspecifics.Rows, function (item) {
                            $scope.itemSpecs.push({
                                bs_browser: item.Cells[0].Value,
                                bs_version: item.Cells[1].Value,
                                bs_visits: parseInt(item.Cells[2].Value),
                                bs_pageviews: parseInt(item.Cells[3].Value)
                            });
                        });

                    });
                }
            });
        });

        navigationService.syncTree({ tree: 'analyticsTree', path: ["-1", $routeParams.id], forceReload: false });
    });
angular.module("umbraco").controller("Analytics.CountryController",
    function ($scope, $location, $routeParams, statsResource, settingsResource, assetsService, navigationService) {

        var profileID = "";

        // items list array
        $scope.items = [];

        $scope.loadingViews = true;

        assetsService.loadJs('http://www.google.com/jsapi')
            .then(function () {
                google.load("visualization", "1",
                {
                    callback: initChart,
                    packages: ['geochart']
                });
            });

        $scope.dateFilter = settingsResource.getDateFilter();

        $scope.$watch('dateFilter', function() {

            settingsResource.setDateFilter($scope.dateFilter.startDate, $scope.dateFilter.endDate);
            initChart();
        });
        
        function initChart() {
            $scope.loadingViews = true;
            //Get Profile
            settingsResource.getprofile().then(function(response) {
                $scope.profile  = response.data;
                profileID       = response.data.Id;

                if (profileID == null || profileID == "") {
                    $location.path("/analytics/analyticsTree/edit/settings");
                    return;
                }
                
                //Get Countires via statsResource - does WebAPI GET call
                statsResource.getcountries(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.data         = response.data.ApiResult;
                    $scope.loadingViews = false;

                    // clear existing items
                    $scope.items.length = 0;

                    // push objects to items array
                    angular.forEach($scope.data.Rows, function (item) {
                        $scope.items.push({
                            country: item.Cells[0].Value,
                            visits: parseInt(item.Cells[1].Value),
                            pageviews: parseInt(item.Cells[2].Value)
                        });
                    });

                    var chartData       = response.data.ChartData;
                    var chartMapData    = google.visualization.arrayToDataTable(chartData);

                    //Options for map (currently use defaults)
                    var options = {};

                    //Create the GeoChart with the countryChart DIV
                    var geochart = new google.visualization.GeoChart(document.getElementById('countryChart'));

                    //Draw the chart with the data & options
                    geochart.draw(chartMapData, options);
                });
            });
        };

        navigationService.syncTree({ tree: 'analyticsTree', path: ["-1", $routeParams.id], forceReload: false });
    });
angular.module("umbraco").controller("Analytics.DashboardController",
    function ($scope, $location, statsResource, settingsResource, localizationService) {

        var profileID = "";

        // items list array
        $scope.items = [];
        $scope.itemsSources = [];
        $scope.itemsKeywords = [];


        function fitToContainer(canvas) {
            canvas.style.width = '95%';
            //canvas.style.height = '100%';
            canvas.width = canvas.offsetWidth;
            //canvas.height = canvas.offsetHeight;
        }

        //Set the date filter for the last 7 days in code 
        //and not use/show date picker
        $scope.dateFilter = {};
        $scope.dateFilter.startDate = moment().subtract('days', 6).format('YYYY-MM-DD');
        $scope.dateFilter.endDate = moment().format('YYYY-MM-DD');
        
        settingsResource.getprofile().then(function(response) {
            $scope.profile = response.data;
            profileID = response.data.Id;

            if (profileID == null || profileID == "") {
                $location.path("/analytics/analyticsTree/edit/settings");
                return;
            }
            
            //Get chart data for monthly visit chart
            statsResource.getvisitcharts(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                var chartData = response.data;

                var canvasId = "viewMonths";
                var canvas = document.getElementById(canvasId),
                    canvasWidth = canvas.clientWidth,
                    canvasHeight = canvas.clientHeight;

                // Replace the chart canvas element
                $('#' + canvasId).replaceWith('<canvas id="' + canvasId + '" width="' + canvasWidth + '" height="' + canvasHeight + '"></canvas>');

                var options = {
                    labelTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\">"
                        + "<% for (var i=0; i<datasets.length; i++){%>"
                        + "<li><span style=\"background-color:<%=datasets[i].fillColor%>;border-color:<%=datasets[i].strokeColor%>\"></span>"
                        + "<%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%>"
                        + "</ul>",
                    bezierCurve: false,
                    scaleBeginAtZero: true,
                    responsive: true
                };

                // Draw the chart / Create Line Chart
                var ctx = $('#' + canvasId).get(0).getContext("2d");
                var viewMonthsChart = new Chart(ctx).Line(chartData, options);

                // Create legend
                var legendHolder = document.createElement('div');
                legendHolder.className = "chart-legend-holder dashboard-view";
                legendHolder.innerHTML = viewMonthsChart.generateLegend();

                var helpers = Chart.helpers;
                helpers.each(legendHolder.firstChild.childNodes, function (legendNode, index) {
                    if (index == 0) {
                        localizationService.localize("analytics_visits").then(function (value) {
                            var text = value != null ? value : "Visits";
                            var t = document.createTextNode(text);
                            legendNode.appendChild(t);
                            legendNode.className = "first";
                        });
                    }
                    else if (index == 1) {
                        localizationService.localize("analytics_pageViews").then(function (value) {
                            var text = value != null ? value : "Page Views";
                            var t = document.createTextNode(text);
                            legendNode.appendChild(t);
                            legendNode.className = "second";
                        });
                    }
                });

                // ensure legend not gets added multiple times
                $(".chart-legend-holder").remove();
                viewMonthsChart.chart.canvas.parentNode.appendChild(legendHolder);
            });

            //Get Browser via statsResource - does WebAPI GET call
            statsResource.getvisits(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                $scope.views = response.data;
                $scope.loadingViews = false;

                // clear existing items
                $scope.items.length = 0;

                // push objects to items array
                angular.forEach($scope.views.Rows, function (item) {
                    $scope.items.push({
                        pagepath: item.Cells[0].Value,
                        visits: parseInt(item.Cells[1].Value),
                        pageviews: parseInt(item.Cells[2].Value)
                    });
                });

            });

            //Get Browser specific via statsResource - does WebAPI GET call
            statsResource.getsources(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                $scope.sources = response.data;

                // clear existing items
                $scope.itemsSources.length = 0;

                // push objects to items array
                angular.forEach($scope.sources.Rows, function (item) {
                    $scope.itemsSources.push({
                        s_source: item.Cells[0].Value,
                        s_visits: parseInt(item.Cells[1].Value),
                        s_pageviews: parseInt(item.Cells[2].Value)
                    });
                });

            });
            
            //Keywords
            statsResource.getkeywords(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                $scope.keywords = response.data.ApiResult;

                // clear existing items
                $scope.itemsKeywords.length = 0;

                // push objects to items array
                angular.forEach($scope.keywords.Rows, function (item) {
                    $scope.itemsKeywords.push({
                        k_keyword: item.Cells[0].Value,
                        k_visits: parseInt(item.Cells[1].Value),
                        k_pageviews: parseInt(item.Cells[2].Value)
                    });
                });

            });
        });
});
angular.module("umbraco").controller("Analytics.DeviceController",
    function ($scope, $location, $routeParams, statsResource, settingsResource, localizationService, navigationService) {

        var profileID = "";

        // items list array
        $scope.types = [];
        $scope.items = [];

        $scope.dateFilter = settingsResource.getDateFilter();
        $scope.loadingViews = true;
        
        $scope.$watch('dateFilter', function () {
            $scope.loadingViews = true;
            settingsResource.setDateFilter($scope.dateFilter.startDate, $scope.dateFilter.endDate);

            //Get Profile
            settingsResource.getprofile().then(function(response) {
                $scope.profile = response.data;
                profileID = response.data.Id;
                
                if (profileID == null || profileID == "") {
                    $location.path("/analytics/analyticsTree/edit/settings");
                    return;
                }
                $scope.loadingViews = false;
                //Get Browser via statsResource - does WebAPI GET call
                statsResource.getdevicetypes(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.devicetypes = response.data.ApiResult;

                    var chartData = response.data.ChartData;

                    var canvasId = "deviceType";
                    var canvas = document.getElementById(canvasId),
                        canvasWidth = canvas.clientWidth,
                        canvasHeight = canvas.clientHeight;

                    // Replace the chart canvas element
                    $('#' + canvasId).replaceWith('<canvas id="' + canvasId + '" width="' + canvasWidth + '" height="' + canvasHeight + '"></canvas>');

                    var options = {
                        labelTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\">"
                            + "<% for (var i=0; i<datasets.length; i++){%>"
                            + "<li><span style=\"background-color:<%=datasets[i].fillColor%>;border-color:<%=datasets[i].strokeColor%>\"></span>"
                            + "<%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%>"
                            + "</ul>"
                    };

                    // Draw the chart / Create Bar Chart
                    var ctx = $('#' + canvasId).get(0).getContext("2d");
                    var devicetypeChart = new Chart(ctx).Bar(chartData, options);

                    // Create legend
                    var legendHolder = document.createElement('div');
                    legendHolder.className = "chart-legend-holder";
                    legendHolder.innerHTML = devicetypeChart.generateLegend();

                    var helpers = Chart.helpers;
                    helpers.each(legendHolder.firstChild.childNodes, function (legendNode, index) {
                        if (index == 0) {
                            localizationService.localize("analytics_visits").then(function (value) {
                                var text = value != null ? value : "Visits";
                                var t = document.createTextNode(text);
                                legendNode.appendChild(t);
                                legendNode.className = "first";
                            });
                        }
                        else if (index == 1) {
                            localizationService.localize("analytics_pageViews").then(function (value) {
                                var text = value != null ? value : "Page Views";
                                var t = document.createTextNode(text);
                                legendNode.appendChild(t);
                                legendNode.className = "second";
                            });
                        }
                    });

                    // ensure legend not gets added multiple times
                    $(".chart-legend-holder").remove();
                    devicetypeChart.chart.canvas.parentNode.appendChild(legendHolder);

                    // clear existing items
                    $scope.types.length = 0;

                    // push objects to items array
                    angular.forEach($scope.devicetypes.Rows, function (item) {
                        $scope.types.push({
                            dt_devicetype: item.Cells[0].Value,
                            dt_visits: parseInt(item.Cells[1].Value),
                            dt_pageviews: parseInt(item.Cells[2].Value)
                        });
                    });

                });

                //Get Browser specific via statsResource - does WebAPI GET call
                statsResource.getdevices(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.devices = response.data.ApiResult;

                    // clear existing items
                    $scope.items.length = 0;

                    // push objects to items array
                    angular.forEach($scope.devices.Rows, function (item) {
                        $scope.items.push({
                            device: item.Cells[0].Value,
                            model: item.Cells[1].Value,
                            visits: parseInt(item.Cells[2].Value),
                            pageviews: parseInt(item.Cells[3].Value)
                        });
                    });

                });

            });
        });

        navigationService.syncTree({ tree: 'analyticsTree', path: ["-1", $routeParams.id], forceReload: false });
    });
angular.module("umbraco").controller("Analytics.EcommerceController",
    function ($scope, $location, $routeParams, statsResource, settingsResource, navigationService) {

        var profileID = "";

        // items list array
        $scope.itemProducts = [];
        $scope.itemRevenuePerSource = [];

        $scope.dateFilter = settingsResource.getDateFilter();
        $scope.loadingViews = true;

        $scope.$watch('dateFilter', function () {
            $scope.loadingViews = true;
            settingsResource.setDateFilter($scope.dateFilter.startDate, $scope.dateFilter.endDate);

            //Get Profile
            settingsResource.getprofile().then(function (response) {
                $scope.profile = response.data;
                profileID = response.data.Id;
                $scope.currencyCode = $scope.profile.Currency;

                if (profileID == null || profileID == "") {
                    $location.path("/analytics/analyticsTree/edit/settings");
                    return;
                }
                $scope.loadingViews = false;

                //Get Bestsellers via statsResource - does WebAPI GET call
                statsResource.getbestsellers(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.products = response.data.ApiResult;

                    // clear existing items
                    $scope.itemProducts.length = 0;

                    // push objects to items array
                    angular.forEach($scope.products.Rows, function (item) {
                        $scope.itemProducts.push({
                            productSku: item.Cells[0].Value,
                            productName: item.Cells[1].Value,
                            quantity: parseInt(item.Cells[2].Value),
                            revenue: parseFloat(item.Cells[3].Value)
                        });
                    });

                });

                //Get Revenue Per Source via statsResource - does WebAPI GET call
                statsResource.getrevenuepersource(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.revenuepersource = response.data.ApiResult;

                    // clear existing items
                    $scope.itemRevenuePerSource.length = 0;

                    // push objects to items array
                    angular.forEach($scope.revenuepersource.Rows, function (item) {
                        // only where there have been a transaction
                        var numberOfTransactions = parseInt(item.Cells[2].Value);
                        if (numberOfTransactions > 0) {
                            $scope.itemRevenuePerSource.push({
                                r_source: item.Cells[0].Value,
                                r_keyword: item.Cells[1].Value,
                                r_transactions: numberOfTransactions,
                                r_revenue: parseFloat(item.Cells[3].Value)
                            });
                        }
                    });

                });

                //Get Store details via statsResource - does WebAPI GET call
                statsResource.getstoredetails(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.storedetails = response.data.ApiResult;

                    var _transactions = $scope.storedetails.Rows[0].Cells[0].Value;
                    var _transactionRevenue = $scope.storedetails.Rows[0].Cells[1].Value;
                    var _itemsPerPurchase = $scope.storedetails.Rows[0].Cells[2].Value;
                    var _itemQuantity = $scope.storedetails.Rows[0].Cells[3].Value;
                    var _conversionRate = $scope.storedetails.Rows[0].Cells[4].Value;

                    $scope.info = {
                        transactions: parseInt(_transactions),
                        revenue: 0.0,
                        avgRevenue: 0.0,
                        itemsPerPurchase: parseFloat(_itemsPerPurchase).toFixed(2),
                        itemQuantity: parseInt(_itemQuantity),
                        conversionRate: parseFloat(_conversionRate)
                    }

                    $scope.info.revenue = parseFloat(_transactionRevenue).toFixed(2);
                    $scope.info.avgRevenue = parseFloat(_transactions) > 0 ? (parseFloat(_transactionRevenue) / parseFloat(_transactions)).toFixed(2) : 0.0;
                    $scope.info.conversionRate = $scope.info.conversionRate.toFixed(2);
                });

            });
        });

        navigationService.syncTree({ tree: 'analyticsTree', path: ["-1", $routeParams.id], forceReload: false });
    });
angular.module("umbraco").controller("Analytics.EditController",
    function ($scope, $routeParams) {

        //Currently loading /umbraco/general.html
        //Need it to look at /App_Plugins/

        var viewName = $routeParams.id;
        viewName = viewName.replace('%20', '-').replace(' ', '-');

        $scope.templatePartialURL = '../App_Plugins/Analytics/backoffice/analyticsTree/partials/' + viewName + '.html';
        $scope.sectionName = $routeParams.id;

    });
angular.module("umbraco").controller("Analytics.KeywordController",
    function ($scope, $location, $routeParams, statsResource, settingsResource, navigationService) {

        var profileID = "";

        // items list array
        $scope.items = [];

        $scope.dateFilter = settingsResource.getDateFilter();
        $scope.loadingViews = true;

        $scope.$watch('dateFilter', function () {
            $scope.loadingViews = true;
            settingsResource.setDateFilter($scope.dateFilter.startDate, $scope.dateFilter.endDate);

            //Get Profile
            settingsResource.getprofile().then(function(response) {
                $scope.profile = response.data;
                profileID = response.data.Id;

                if (profileID == null || profileID == "") {
                    $location.path("/analytics/analyticsTree/edit/settings");
                    return;
                }
                $scope.loadingViews = false;
                //Get Browser via statsResource - does WebAPI GET call
                statsResource.getkeywords(profileID,$scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.keywords = response.data.ApiResult;

                    // clear existing items
                    $scope.items.length = 0;

                    // push objects to items array
                    angular.forEach($scope.keywords.Rows, function (item) {
                        $scope.items.push({
                            keyword: item.Cells[0].Value,
                            visits: parseInt(item.Cells[1].Value),
                            pageviews: parseInt(item.Cells[2].Value)
                        });
                    });
                   
                });

            });
        });

        navigationService.syncTree({ tree: 'analyticsTree', path: ["-1", $routeParams.id], forceReload: false });
    });
angular.module("umbraco").controller("Analytics.LanguageController",
    function ($scope, $location, $routeParams, statsResource, settingsResource, navigationService) {

        var profileID = "";

        // items list array
        $scope.items = [];

        $scope.dateFilter = settingsResource.getDateFilter();

        $scope.$watch('dateFilter', function () {
            
            settingsResource.setDateFilter($scope.dateFilter.startDate, $scope.dateFilter.endDate);
            //Get Profile
            settingsResource.getprofile().then(function(response) {
                $scope.profile = response.data;
                profileID = response.data.Id;

                if (profileID == null || profileID == "") {
                    $location.path("/analytics/analyticsTree/edit/settings");
                    return;
                }
                
                //Get language via statsResource - does WebAPI GET call
                statsResource.getlanguage(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.data = response.data;

                    // clear existing items
                    $scope.items.length = 0;

                    // push objects to items array
                    angular.forEach($scope.data.Rows, function (item) {
                        $scope.items.push({
                            language: item.Cells[0].Value,
                            visits: parseInt(item.Cells[1].Value),
                            pageviews: parseInt(item.Cells[2].Value)
                        });
                    });

                });

            });
        });

        navigationService.syncTree({ tree: 'analyticsTree', path: ["-1", $routeParams.id], forceReload: false });
    });
angular.module("umbraco").controller("Analytics.OSController",
    function ($scope, $location, $routeParams, statsResource, settingsResource, localizationService, navigationService) {

        var profileID = "";

        // items list array
        $scope.items = [];
        $scope.itemsVersions = [];

        $scope.dateFilter = settingsResource.getDateFilter();

        $scope.$watch('dateFilter', function () {
            
            settingsResource.setDateFilter($scope.dateFilter.startDate, $scope.dateFilter.endDate);

            //Get Profile
            settingsResource.getprofile().then(function(response) {
                $scope.profile = response.data;
                profileID = response.data.Id;

                if (profileID == null || profileID == "") {
                    $location.path("/analytics/analyticsTree/edit/settings");
                    return;
                }
                
                //Get Browser via statsResource - does WebAPI GET call
                statsResource.getos(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.os = response.data.ApiResult;

                    var chartData = response.data.ChartData;

                    var canvasId = "os";
                    var canvas = document.getElementById(canvasId),
                        canvasWidth = canvas.clientWidth,
                        canvasHeight = canvas.clientHeight;

                    // Replace the chart canvas element
                    $('#' + canvasId).replaceWith('<canvas id="' + canvasId + '" width="' + canvasWidth + '" height="' + canvasHeight + '"></canvas>');

                    var options = {
                        labelTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\">"
                            + "<% for (var i=0; i<datasets.length; i++){%>"
                            + "<li><span style=\"background-color:<%=datasets[i].fillColor%>;border-color:<%=datasets[i].strokeColor%>\"></span>"
                            + "<%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%>"
                            + "</ul>"
                    };

                    // Draw the chart / Create Bar Chart
                    var ctx = $('#' + canvasId).get(0).getContext("2d");
                    var osChart = new Chart(ctx).Bar(chartData, options);

                    // Create legend
                    var legendHolder = document.createElement('div');
                    legendHolder.className = "chart-legend-holder";
                    legendHolder.innerHTML = osChart.generateLegend();

                    var helpers = Chart.helpers;
                    helpers.each(legendHolder.firstChild.childNodes, function (legendNode, index) {
                        if (index == 0) {
                            localizationService.localize("analytics_visits").then(function (value) {
                                var text = value != null ? value : "Visits";
                                var t = document.createTextNode(text);
                                legendNode.appendChild(t);
                                legendNode.className = "first";
                            });
                        }
                        else if (index == 1) {
                            localizationService.localize("analytics_pageViews").then(function (value) {
                                var text = value != null ? value : "Page Views";
                                var t = document.createTextNode(text);
                                legendNode.appendChild(t);
                                legendNode.className = "second";
                            });
                        }
                    });

                    // ensure legend not gets added multiple times
                    $(".chart-legend-holder").remove();
                    osChart.chart.canvas.parentNode.appendChild(legendHolder);

                    // clear existing items
                    $scope.items.length = 0;

                    // push objects to items array
                    angular.forEach($scope.os.Rows, function (item) {
                        $scope.items.push({
                            operatingsystem: item.Cells[0].Value,
                            visits: parseInt(item.Cells[1].Value),
                            pageviews: parseInt(item.Cells[2].Value)
                        });
                    });

                });

                //Get Browser via statsResource - does WebAPI GET call
                statsResource.getosversions(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.osVersions = response.data.ApiResult;

                    // clear existing items
                    $scope.itemsVersions.length = 0;

                    // push objects to items array
                    angular.forEach($scope.osVersions.Rows, function (item) {
                        $scope.itemsVersions.push({
                            v_operatingsystem: item.Cells[0].Value,
                            v_version: item.Cells[1].Value,
                            v_visits: parseInt(item.Cells[2].Value),
                            v_pageviews: parseInt(item.Cells[3].Value)
                        });
                    });

                });

            });
        });

        navigationService.syncTree({ tree: 'analyticsTree', path: ["-1", $routeParams.id], forceReload: false });
    });
angular.module("umbraco").controller("Analytics.PageViewsController",
    function ($scope, $location, $routeParams, statsResource, settingsResource, dateRangeService, localizationService, navigationService) {

        var profileID = "";

        // items list array
        $scope.items = [];
        $scope.itemSources = [];

        $scope.dateFilter = settingsResource.getDateFilter();

        $scope.$watch('dateFilter', function () {
            
            settingsResource.setDateFilter($scope.dateFilter.startDate, $scope.dateFilter.endDate);

            //Get Profile
            settingsResource.getprofile().then(function (response) {
                $scope.profile = response.data;
                profileID = response.data.Id;

                if (profileID == null || profileID == "") {
                    $location.path("/analytics/analyticsTree/edit/settings");
                    return;
                }
                
                //Get chart data for monthly visit chart
                statsResource.getvisitcharts(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    var chartData = response.data;

                    var canvasId = "viewMonths";
                    var canvas = document.getElementById(canvasId),
                        canvasWidth = canvas.clientWidth,
                        canvasHeight = canvas.clientHeight;

                    // Replace the chart canvas element
                    $('#' + canvasId).replaceWith('<canvas id="' + canvasId + '" width="' + canvasWidth + '" height="' + canvasHeight + '"></canvas>');
                    
                    var options = {
                        labelTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\">"
                            + "<% for (var i=0; i<datasets.length; i++){%>"
                            + "<li><span style=\"background-color:<%=datasets[i].fillColor%>;border-color:<%=datasets[i].strokeColor%>\"></span>"
                            + "<%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%>"
                            + "</ul>"
                    };

                    // Draw the chart / Create Line Chart
                    var ctx = $('#' + canvasId).get(0).getContext("2d");
                    var viewMonthsChart = new Chart(ctx).Line(chartData, options);

                    // Create legend
                    var legendHolder = document.createElement('div');
                    legendHolder.className = "chart-legend-holder";
                    legendHolder.innerHTML = viewMonthsChart.generateLegend();

                    var helpers = Chart.helpers;
                    helpers.each(legendHolder.firstChild.childNodes, function (legendNode, index) {
                        if (index == 0) {
                            localizationService.localize("analytics_visits").then(function (value) {
                                var text = value != null ? value : "Visits";
                                var t = document.createTextNode(text);
                                legendNode.appendChild(t);
                                legendNode.className = "first";
                            });
                        }
                        else if (index == 1) {
                            localizationService.localize("analytics_pageViews").then(function (value) {
                                var text = value != null ? value : "Page Views";
                                var t = document.createTextNode(text);
                                legendNode.appendChild(t);
                                legendNode.className = "second";
                            });
                        }
                    });

                    // ensure legend not gets added multiple times
                    $(".chart-legend-holder").remove();
                    viewMonthsChart.chart.canvas.parentNode.appendChild(legendHolder);
                });

                //Get Browser via statsResource - does WebAPI GET call
                statsResource.getvisits(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.views = response.data;
                    $scope.loadingViews = false;

                    // clear existing items
                    $scope.items.length = 0;
                    // push objects to items array
                    angular.forEach($scope.views.Rows, function (item) {
                        $scope.items.push({
                            pagepath: item.Cells[0].Value,
                            visits: parseInt(item.Cells[1].Value),
                            pageviews: parseInt(item.Cells[2].Value)
                        });
                    });

                });

                //Get Browser specific via statsResource - does WebAPI GET call
                statsResource.getsources(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.sources = response.data;

                    // clear existing items
                    $scope.itemSources.length = 0;
                    // push objects to items array
                    angular.forEach($scope.sources.Rows, function (item) {
                        $scope.itemSources.push({
                            s_source: item.Cells[0].Value,
                            s_visits: parseInt(item.Cells[1].Value),
                            s_pageviews: parseInt(item.Cells[2].Value)
                        });
                    });

                });

            });
        });

        navigationService.syncTree({ tree: 'analyticsTree', path: ["-1", $routeParams.id], forceReload: false });
    });
angular.module("umbraco").controller("Analytics.ProductPerformanceController",
    function ($scope, $location, $routeParams, statsResource, settingsResource, localizationService, navigationService) {

        var profileID = "";

        // items list array
        $scope.itemProducts = [];

        $scope.dateFilter = settingsResource.getDateFilter();
        $scope.loadingViews = true;

        $scope.$watch('dateFilter', function () {
            $scope.loadingViews = true;
            settingsResource.setDateFilter($scope.dateFilter.startDate, $scope.dateFilter.endDate);

            //Get Profile
            settingsResource.getprofile().then(function (response) {
                $scope.profile = response.data;
                profileID = response.data.Id;
                $scope.currencyCode = $scope.profile.Currency;

                if (profileID == null || profileID == "") {
                    $location.path("/analytics/analyticsTree/edit/settings");
                    return;
                }
                $scope.loadingViews = false;

                //Get chart data for monthly visit chart
                statsResource.getproductperformancecharts(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    var chartData = response.data;

                    var canvasId = "viewProductPerformance";
                    var canvas = document.getElementById(canvasId),
                        canvasWidth = canvas.clientWidth,
                        canvasHeight = canvas.clientHeight;

                    // Replace the chart canvas element
                    $('#' + canvasId).replaceWith('<canvas id="' + canvasId + '" width="' + canvasWidth + '" height="' + canvasHeight + '"></canvas>');

                    var options = {
                        labelTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\">"
                            + "<% for (var i=0; i<datasets.length; i++){%>"
                            + "<li><span style=\"background-color:<%=datasets[i].fillColor%>;border-color:<%=datasets[i].strokeColor%>\"></span>"
                            + "<%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%>"
                            + "</ul>",
                        bezierCurve: false,
                        scaleBeginAtZero: true
                    };

                    // Draw the chart / Create Line Chart
                    var ctx = $('#' + canvasId).get(0).getContext("2d");
                    var viewProductPerformanceChart = new Chart(ctx).Line(chartData, options);

                    // Create legend
                    var legendHolder = document.createElement('div');
                    legendHolder.className = "chart-legend-holder";
                    legendHolder.innerHTML = viewProductPerformanceChart.generateLegend();

                    var helpers = Chart.helpers;
                    helpers.each(legendHolder.firstChild.childNodes, function (legendNode, index) {
                        if (index == 0) {
                            localizationService.localize("analytics_uniquePurchases").then(function (value) {
                                var text = value != null ? value : "Unique Purchases";
                                var t = document.createTextNode(text);
                                legendNode.appendChild(t);
                                legendNode.className = "first";
                            });
                        }
                    });

                    // ensure legend not gets added multiple times
                    $(".chart-legend-holder").remove();
                    viewProductPerformanceChart.chart.canvas.parentNode.appendChild(legendHolder);
                });

                //Get Browser specific via statsResource - does WebAPI GET call
                statsResource.getproductperformance(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.productperformance = response.data.ApiResult;

                    // clear existing items
                    $scope.itemProducts.length = 0;

                    // push objects to items array
                    angular.forEach($scope.productperformance.Rows, function (item) {
                        $scope.itemProducts.push({
                            productSku: item.Cells[0].Value,
                            productName: item.Cells[1].Value,
                            uniquePurchases: parseInt(item.Cells[2].Value),
                            revenue: parseFloat(item.Cells[3].Value),
                            revenuePerItem: parseFloat(item.Cells[4].Value),
                            itemsPerPurchase: parseFloat(item.Cells[5].Value)
                        });
                    });

                });

            });
        });

        // todo: possible to find "ecommerce" alias dynamic? "ecommerce" is parent tree alias
        navigationService.syncTree({ tree: 'analyticsTree', path: ["-1", "ecommerce", $routeParams.id], forceReload: false });
    });
angular.module("umbraco").controller("Analytics.SalesPerformanceController",
    function ($scope, $location, $routeParams, statsResource, settingsResource, localizationService, navigationService) {

        var profileID = "";

        // items list array
        $scope.itemSales = [];

        $scope.dateFilter = settingsResource.getDateFilter();
        $scope.loadingViews = true;

        $scope.$watch('dateFilter', function () {
            $scope.loadingViews = true;
            settingsResource.setDateFilter($scope.dateFilter.startDate, $scope.dateFilter.endDate);

            //Get Profile
            settingsResource.getprofile().then(function (response) {
                $scope.profile = response.data;
                profileID = response.data.Id;
                $scope.currencyCode = $scope.profile.Currency;

                if (profileID == null || profileID == "") {
                    $location.path("/analytics/analyticsTree/edit/settings");
                    return;
                }
                $scope.loadingViews = false;

                //Get chart data for monthly visit chart
                statsResource.getsalesperformancecharts(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    var chartData = response.data;

                    var canvasId = "viewSalesPerformance";
                    var canvas = document.getElementById(canvasId),
                        canvasWidth = canvas.clientWidth,
                        canvasHeight = canvas.clientHeight;

                    // Replace the chart canvas element
                    $('#' + canvasId).replaceWith('<canvas id="' + canvasId + '" width="' + canvasWidth + '" height="' + canvasHeight + '"></canvas>');

                    var options = {
                        labelTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\">"
                            + "<% for (var i=0; i<datasets.length; i++){%>"
                            + "<li><span style=\"background-color:<%=datasets[i].fillColor%>;border-color:<%=datasets[i].strokeColor%>\"></span>"
                            + "<%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%>"
                            + "</ul>",
                        bezierCurve: false,
                        scaleBeginAtZero: true
                    };

                    // Draw the chart / Create Line Chart
                    var ctx = $('#' + canvasId).get(0).getContext("2d");
                    var viewSalesPerformanceChart = new Chart(ctx).Line(chartData, options);

                    // Create legend
                    var legendHolder = document.createElement('div');
                    legendHolder.className = "chart-legend-holder";
                    legendHolder.innerHTML = viewSalesPerformanceChart.generateLegend();

                    var helpers = Chart.helpers;
                    helpers.each(legendHolder.firstChild.childNodes, function (legendNode, index) {
                        if (index == 0) {
                            localizationService.localize("analytics_revenue").then(function (value) {
                                var text = value != null ? value : "Revenue";
                                var t = document.createTextNode(text);
                                legendNode.appendChild(t);
                                legendNode.className = "first";
                            });
                        }
                    });

                    // ensure legend not gets added multiple times
                    $(".chart-legend-holder").remove();
                    viewSalesPerformanceChart.chart.canvas.parentNode.appendChild(legendHolder);
                });

                //Get Browser specific via statsResource - does WebAPI GET call
                statsResource.getsalesperformance(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.salesperformance = response.data.ApiResult;

                    // clear existing items
                    $scope.itemSales.length = 0;

                    // push objects to items array
                    angular.forEach($scope.salesperformance.Rows, function (item) {
                        var year = item.Cells[0].Value.slice(0, 4);
                        var month = item.Cells[0].Value.slice(4, 6);
                        var day = item.Cells[0].Value.slice(6, 8);
                        $scope.itemSales.push({
                            date: new Date(year, month, day), // yyyyMMdd --> yyyy-MM-dd
                            uniquePurchases: parseInt(item.Cells[2].Value),
                            revenue: parseFloat(item.Cells[1].Value)
                        });
                    });

                });

            });
        });

        // todo: possible to find "ecommerce" alias dynamic? "ecommerce" is parent tree alias
        navigationService.syncTree({ tree: 'analyticsTree', path: ["-1", "ecommerce", $routeParams.id], forceReload: false });
    });
angular.module("umbraco").controller("Analytics.ScreenResController",
    function ($scope, $location, $routeParams, statsResource, settingsResource, navigationService) {

        var profileID = "";

        // items list array
        $scope.items = [];

        $scope.dateFilter = settingsResource.getDateFilter();

        $scope.$watch('dateFilter', function () {
            
            settingsResource.setDateFilter($scope.dateFilter.startDate, $scope.dateFilter.endDate);

            //Get Profile
            settingsResource.getprofile().then(function(response) {
                $scope.profile = response.data;
                profileID = response.data.Id;

                if (profileID == null || profileID == "") {
                    $location.path("/analytics/analyticsTree/edit/settings");
                    return;
                }
                //Get Browser via statsResource - does WebAPI GET call
                statsResource.getresolutions(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.resolutions = response.data;

                    // clear existing items
                    $scope.items.length = 0;

                    // push objects to items array
                    angular.forEach($scope.resolutions.Rows, function (item) {
                        $scope.items.push({
                            resolution: item.Cells[0].Value,
                            visits: parseInt(item.Cells[1].Value),
                            pageviews: parseInt(item.Cells[2].Value)
                        });
                    });

                });
            });
        });

        navigationService.syncTree({ tree: 'analyticsTree', path: ["-1", $routeParams.id], forceReload: false });
    });
angular.module("umbraco").controller("Analytics.SettingsController",
    function ($scope, $routeParams, settingsResource, notificationsService, localizationService, navigationService) {

        //By default user has not authorised
        var hasUserAuthd = false;

        //Get all settings via settingsResource - does WebAPI GET call
        settingsResource.getall().then(function (response) {
            $scope.settings = response.data;
        });

        //Get Account JSON & bind back to dropdown
        settingsResource.getaccount().then(function (response) {
            if (response.data === "null") {
                $scope.selectedaccount = null;
            }
            else {
                $scope.selectedaccount = response.data;
            }
        });

        //Get Profile JSON & bind back to dropdown
        settingsResource.getprofile().then(function (response) {
            if (response.data === "null") {
                $scope.selectedprofile = null;
            }
            else {
                $scope.selectedprofile = response.data;
            }
        });


        //Get oAuth Check - WebAPI GET (Basically checks if RefreshToken has a value)
        settingsResource.checkauth().then(function (response) {

            //Show or hide the auth button (set on scope & local var for if check)
            hasUserAuthd = response.data === "true";

            //Apply
            $scope.$apply(function () {
                $scope.hasAuthd = hasUserAuthd;
            });

            //Only load/fetch if showAuth is true
            if (hasUserAuthd === true) {
                
                //Get all accounts via settingsResource - does WebAPI GET call
                settingsResource.getaccounts().then(function (response) {
                    $scope.accounts = response.data;

                    if ($scope.selectedaccount != null) {
                        $scope.selectedaccount = _.where($scope.accounts, { Id: $scope.selectedaccount.Id })[0];
                        
                        settingsResource.getprofiles($scope.selectedaccount.Id).then(function (response) {
                            $scope.profiles = response.data;
                            if ($scope.selectedprofile != null) {
                                $scope.selectedprofile = _.where($scope.profiles, { Id: $scope.selectedprofile.Id })[0];
                            }
                        });
                    }
                });


                //When an account is selected
                $scope.accountSelected = function (selectedAccount) {
                    settingsResource.getprofiles(selectedAccount.Id).then(function (response) {
                        $scope.profiles = response.data;
                    });
                };

            }
        });

        //Auth - Click
        $scope.auth = function () {

            //Open a dialog window to oAuth
            //It will callback to http://analytics-oauth.azurewebsites.net/callback/oAuth.aspx?origin=http://localhost:62315
            window.open("/App_Plugins/analytics/backoffice/OAuth.aspx", "oAuthAnayltics", "location=0,status=0,width=600,height=600");
        };

        //Save - click...
        $scope.save = function (settings, account, profile) {

            //Save settings resource - does a WebAPI POST call
            settingsResource.save(settings).then(function (response) {
                $scope.settings = response.data;

                //Display Success message
                notificationsService.success(localizationService.localize("analytics_settingsSaved"));
            });

            //Save settings resource - does a WebAPI POST call
            settingsResource.saveAccount(account).then(function (response) {
                //Don't need anything from response.data back

                //Display Success message
                notificationsService.success(localizationService.localize("analytics_accountDetailsSaved"));
            });

            //Save settings resource - does a WebAPI POST call
            settingsResource.saveProfile(profile).then(function (response) {
                //Don't need anything from response.data back

                //Display Success message
                notificationsService.success(localizationService.localize("analytics_profileDetailsSaved"));

                //Sync ('refresh') the tree!
                navigationService.syncTree({ tree: 'analyticsTree', path: [-1, $routeParams.id], forceReload: true, activate: true });
            });

        };

        navigationService.syncTree({ tree: 'analyticsTree', path: ["-1", $routeParams.id], forceReload: false });
    });
angular.module("umbraco").controller("Analytics.SocialController",
    function ($scope, $location, $routeParams, statsResource, settingsResource, localizationService, navigationService) {
        
        var profileID = "";

        // items list array
        $scope.items = [];

        $scope.dateFilter = settingsResource.getDateFilter();

        $scope.$watch('dateFilter', function () {
            
            settingsResource.setDateFilter($scope.dateFilter.startDate, $scope.dateFilter.endDate);

            //Get Profile
            settingsResource.getprofile().then(function(response) {
                $scope.profile = response.data;
                profileID = response.data.Id;

                if (profileID == null || profileID == "") {
                    $location.path("/analytics/analyticsTree/edit/settings");
                    return;

                }
                //Get Browser via statsResource - does WebAPI GET call
                statsResource.getsocialnetworks(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.social = response.data.ApiResult;

                    var chartData = response.data.ChartData;

                    var canvasId = "social";
                    var canvas = document.getElementById(canvasId),
                        canvasWidth = canvas.clientWidth,
                        canvasHeight = canvas.clientHeight;

                    // Replace the chart canvas element
                    $('#' + canvasId).replaceWith('<canvas id="' + canvasId + '" width="' + canvasWidth + '" height="' + canvasHeight + '"></canvas>');

                    var options = {
                        labelTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\">"
                            + "<% for (var i=0; i<datasets.length; i++){%>"
                            + "<li><span style=\"background-color:<%=datasets[i].fillColor%>;border-color:<%=datasets[i].strokeColor%>\"></span>"
                            + "<%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%>"
                            + "</ul>"
                    };

                    // Draw the chart / Create Bar Chart
                    var ctx = $('#' + canvasId).get(0).getContext("2d");
                    var socialChart = new Chart(ctx).Bar(chartData, options);

                    // Create legend
                    var legendHolder = document.createElement('div');
                    legendHolder.className = "chart-legend-holder";
                    legendHolder.innerHTML = socialChart.generateLegend();

                    var helpers = Chart.helpers;
                    helpers.each(legendHolder.firstChild.childNodes, function (legendNode, index) {
                        if (index == 0) {
                            localizationService.localize("analytics_visits").then(function (value) {
                                var text = value != null ? value : "Visits";
                                var t = document.createTextNode(text);
                                legendNode.appendChild(t);
                                legendNode.className = "first";
                            });
                        }
                        else if (index == 1) {
                            localizationService.localize("analytics_pageViews").then(function (value) {
                                var text = value != null ? value : "Page Views";
                                var t = document.createTextNode(value);
                                legendNode.appendChild(t);
                                legendNode.className = "second";
                            });
                        }
                    });

                    // ensure legend not gets added multiple times
                    $(".chart-legend-holder").remove();
                    socialChart.chart.canvas.parentNode.appendChild(legendHolder);

                    // clear existing items
                    $scope.items.length = 0;

                    // push objects to items array
                    angular.forEach($scope.social.Rows, function (item) {
                        $scope.items.push({
                            socialnetwork: item.Cells[0].Value,
                            visits: parseInt(item.Cells[1].Value),
                            pageviews: parseInt(item.Cells[2].Value)
                        });
                    });

                });
            });
        });

        navigationService.syncTree({ tree: 'analyticsTree', path: ["-1", $routeParams.id], forceReload: false });
    });
angular.module("umbraco").controller("Analytics.TransactionController",
    function ($scope, $location, $routeParams, statsResource, settingsResource, localizationService, navigationService) {

        var profileID = "";

        // items list array
        $scope.itemTransactions = [];

        $scope.dateFilter = settingsResource.getDateFilter();
        $scope.loadingViews = true;

        $scope.$watch('dateFilter', function () {
            $scope.loadingViews = true;
            settingsResource.setDateFilter($scope.dateFilter.startDate, $scope.dateFilter.endDate);

            //Get Profile
            settingsResource.getprofile().then(function (response) {
                $scope.profile = response.data;
                profileID = response.data.Id;
                $scope.currencyCode = $scope.profile.Currency;

                if (profileID == null || profileID == "") {
                    $location.path("/analytics/analyticsTree/edit/settings");
                    return;
                }
                $scope.loadingViews = false;

                //Get chart data for monthly visit chart
                statsResource.gettransactionscharts(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    var chartData = response.data;

                    var canvasId = "viewTransactions";
                    var canvas = document.getElementById(canvasId),
                        canvasWidth = canvas.clientWidth,
                        canvasHeight = canvas.clientHeight;

                    // Replace the chart canvas element
                    $('#' + canvasId).replaceWith('<canvas id="' + canvasId + '" width="' + canvasWidth + '" height="' + canvasHeight + '"></canvas>');

                    var options = {
                        labelTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\">"
                            + "<% for (var i=0; i<datasets.length; i++){%>"
                            + "<li><span style=\"background-color:<%=datasets[i].fillColor%>;border-color:<%=datasets[i].strokeColor%>\"></span>"
                            + "<%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%>"
                            + "</ul>",
                        bezierCurve: false,
                        scaleBeginAtZero: true
                    };

                    // Draw the chart / Create Line Chart
                    var ctx = $('#' + canvasId).get(0).getContext("2d");
                    var viewTransactionsChart = new Chart(ctx).Line(chartData, options);

                    // Create legend
                    var legendHolder = document.createElement('div');
                    legendHolder.className = "chart-legend-holder";
                    legendHolder.innerHTML = viewTransactionsChart.generateLegend();

                    var helpers = Chart.helpers;
                    helpers.each(legendHolder.firstChild.childNodes, function (legendNode, index) {
                        if (index == 0) {
                            localizationService.localize("analytics_transactions").then(function (value) {
                                var text = value != null ? value : "Transactions";
                                var t = document.createTextNode(text);
                                legendNode.appendChild(t);
                                legendNode.className = "first";
                            });
                        }
                    });

                    // ensure legend not gets added multiple times
                    $(".chart-legend-holder").remove();
                    viewTransactionsChart.chart.canvas.parentNode.appendChild(legendHolder);
                });

                //Get Browser specific via statsResource - does WebAPI GET call
                statsResource.gettransactions(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.transactions = response.data.ApiResult;

                    // clear existing items
                    $scope.itemTransactions.length = 0;

                    // push objects to items array
                    angular.forEach($scope.transactions.Rows, function (item) {
                        $scope.itemTransactions.push({
                            transactionId: item.Cells[0].Value,
                            quantity: parseInt(item.Cells[1].Value),
                            revenue: parseFloat(item.Cells[2].Value)
                        });
                    });

                });

            });
        });

        // todo: possible to find "ecommerce" alias dynamic? "ecommerce" is parent tree alias
        navigationService.syncTree({ tree: 'analyticsTree', path: ["-1", "ecommerce", $routeParams.id], forceReload: false });
    });
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