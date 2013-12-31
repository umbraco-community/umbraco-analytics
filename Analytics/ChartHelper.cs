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
                labels      = apiResults.Rows.Select(row => row.Cells[0]).ToArray(),
                datasets    = new ChartDataSet[metrics]
            };

            // Add a dataset for each metric
            for (int metric = 0; metric < metrics; metric++)
            {

                // Initialize the data object
                ChartDataSet ds = cd.datasets[metric] = new ChartDataSet();
                ds.fillColor    = GetFillColor(metric);
                ds.strokeColor  = GetStrokeColor(metric);
                ds.data         = new object[apiResults.Rows.Length];

                for (int row = 0; row < apiResults.Rows.Length; row++)
                {

                    // Get the value
                    string value = apiResults.Rows[row].Cells[dimensions + metric];

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

        public static LineChartData GetLineChartData(AnalyticsDataResponse apiResults)
        {            
            // Get the amount of dimensions and metrics
            int dimensions  = apiResults.ColumnHeaders.Count(x => x.ColumnType == "DIMENSION");
            int metrics     = apiResults.ColumnHeaders.Count(x => x.ColumnType == "METRIC");

            // Initialize the data object
            LineChartData cd = new LineChartData
            {
                labels      = apiResults.Rows.Select(row => row.Cells[1] + "/" + row.Cells[0]).ToArray(),
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
                ds.data             = new object[apiResults.Rows.Length];

                for (int row = 0; row < apiResults.Rows.Length; row++)
                {
                    // Get the value
                    string value = apiResults.Rows[row].Cells[dimensions + metric];

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

        public static string GetFillColor(int pos)
        {
            return pos % 2 == 0 ? "rgba(245, 112, 32, 0.5)" : "rgba(151, 187, 205, 0.5)";
        }

        public static string GetStrokeColor(int pos)
        {
            return pos % 2 == 0 ? "rgba(245, 112, 32, 1)" : "rgba(151, 187, 205, 1)";
        }
    }
}
