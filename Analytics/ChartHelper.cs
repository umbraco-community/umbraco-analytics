using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Analytics.Models;
using Skybrud.Social.Google.Analytics.Responses;

namespace Analytics
{
    public static class ChartHelper
    {
        public static ChartData GetChartData(AnalyticsDataResponse apiResults)
        {
            // Get the amount of dimensions and metrics
            int dimensions  = apiResults.ColumnHeaders.Count(x => x.ColumnType == "DIMENSION");
            int metrics     = apiResults.ColumnHeaders.Count(x => x.ColumnType == "METRIC");

            // Initialize the data object
            ChartData cd = new ChartData
            {
                labels      = apiResults.Rows.Select(row => row.Cells[0].Value).ToArray(),
                datasets    = new ChartDataSet[metrics]
            };

            // Add a dataset for each metric
            for (int metric = 0; metric < metrics; metric++)
            {

                // Initialize the data object
                ChartDataSet ds = cd.datasets[metric] = new ChartDataSet();
                ds.fillColor    = GetFillColor(metric);
                ds.strokeColor  = GetStrokeColor(metric);
                ds.highlightFill = GetHighlightFillColor(metric);
                ds.highlightStroke = GetHighlightStrokeColor(metric);
                ds.data         = new object[apiResults.Rows.Length];

                for (int row = 0; row < apiResults.Rows.Length; row++)
                {

                    // Get the value
                    string value = apiResults.Rows[row].Cells[dimensions + metric].Value;

                    // Set the value with the proper type
                    if (Regex.IsMatch(value, "^[0-9]+$"))
                    {
                        ds.data[row] = Int32.Parse(value);
                    }
                    else
                    {
                        ds.data[row] = value;
                    }
                }
            }

            return cd;
        }

        public static ChartData GetLineChartData(AnalyticsDataResponse apiResults)
        {            
            // Get the amount of dimensions and metrics
            int dimensions  = apiResults.ColumnHeaders.Count(x => x.ColumnType == "DIMENSION");
            int metrics     = apiResults.ColumnHeaders.Count(x => x.ColumnType == "METRIC");

            var chartLabels = new string[]{};

            if (apiResults.ColumnHeaders.Count() == 5)
            {
                chartLabels = apiResults.Rows.Select(row => row.Cells[2] + "/" + row.Cells[1] + "/" + row.Cells[0]).ToArray();
            }
            else
            {
                chartLabels = apiResults.Rows.Select(row => row.Cells[1] + "/" + row.Cells[0]).ToArray();
            }

            // Initialize the data object
            ChartData cd = new ChartData
            {
                labels      = chartLabels,
                datasets    = new LineChartDataSet[metrics]
            };

            // Add a dataset for each metric
            for (int metric = 0; metric < metrics; metric++)
            {

                // Initialize the data object
                LineChartDataSet ds = cd.datasets[metric] = new LineChartDataSet();
                ds.fillColor        = GetFillColor(metric);
                ds.strokeColor      = GetStrokeColor(metric);
                ds.pointColor       = GetFillColor(metric);
                ds.pointStrokeColor = GetStrokeColor(metric);
                ds.pointHighlightFill = GetPointHighlightFillColor();
                ds.pointHighlightStroke = GetPointHighlightStrokeColor(metric);
                ds.data             = new object[apiResults.Rows.Length];

                for (int row = 0; row < apiResults.Rows.Length; row++)
                {
                    // Get the value
                    string value = apiResults.Rows[row].Cells[dimensions + metric].Value;

                    // Set the value with the proper type
                    if (Regex.IsMatch(value, "^[0-9]+$"))
                    {
                        ds.data[row] = Int32.Parse(value);
                    }
                    else
                    {
                        ds.data[row] = value;
                    }
                }
            }

            return cd;
            
        }

        public static dynamic GetGeoChartData(AnalyticsDataResponse apiResults)
        {
            List<object> geoChartData = new List<object>();

            var headerRow = new[] {"Country", "Visits"};
            geoChartData.Add(headerRow);

            foreach (var row in apiResults.Rows)
            {
                //Get Data out of the api results
                var country     = row.Cells[0];
                var visits      = Convert.ToInt32(row.Cells[1]);

                //Create an array
                var dataRow = new object[] { country, visits };

                geoChartData.Add(dataRow);
            }

            //Return the object
            return geoChartData;
        }

        public static string GetFillColor(int pos)
        {
            return pos % 2 == 0 ? "rgba(245, 112, 32, 0.5)" : "rgba(151, 187, 205, 0.5)";
        }

        public static string GetStrokeColor(int pos)
        {
            return pos % 2 == 0 ? "rgba(245, 112, 32, 0.8)" : "rgba(151, 187, 205, 0.8)";
        }

        public static string GetHighlightFillColor(int pos)
        {
            return pos % 2 == 0 ? "rgba(245, 112, 32, 0.75)" : "rgba(151, 187, 205, 0.75)";
        }

        public static string GetHighlightStrokeColor(int pos)
        {
            return pos % 2 == 0 ? "rgba(245, 112, 32, 1)" : "rgba(151, 187, 205, 1)";
        }

        public static string GetPointHighlightFillColor()
        {
            return "#fff";
        }

        public static string GetPointHighlightStrokeColor(int pos)
        {
            return pos % 2 == 0 ? "rgba(245, 112, 32, 1)" : "rgba(151, 187, 205, 1)";
        }
    }
}
