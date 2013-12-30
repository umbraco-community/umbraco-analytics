using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Analytics.Models;
using Skybrud.Social.Google.Analytics.Responses;

namespace Analytics
{
    public static class ChartHelper
    {
        public static ChartData GetChartData(AnalyticsDataResponse apiResults)
        {
            //Chart Data object to return
            var chartData = new ChartData();

            //Create a list we can use to store labels & convert to array
            var labels = new List<string>();

            //Loop over data and get values out & into our chart object
            foreach (var row in apiResults.Rows)
            {
                //Add the first item in the cells array, as it's the label
                labels.Add(row.Cells[0]);
            }

            //Set the labels
            chartData.labels = labels.ToArray();

            //Create a list of data sets so we can add it to object
            var chartDataSets = new List<ChartDataSet>();

            //TODO: Fix logic as needs to grab value from each row to build up data
            foreach (var row in apiResults.Rows)
            {
                var dataSetToAdd            = new ChartDataSet();
                dataSetToAdd.fillColor      = "rgba(245, 112, 32, 0.5)";
                dataSetToAdd.strokeColor    = "rgba(245, 112, 32, 1)";

                //Get the cell data array & convert to list so can easily remove the first item
                var cells = row.Cells.ToList();
                cells.Remove(cells.First());

                //Convert the list back to an array
                dataSetToAdd.data = cells.ToArray();

                //Add the dataset
                chartDataSets.Add(dataSetToAdd);
            }

            //Set chart data sets on chart data object
            chartData.datasets = chartDataSets;

            //Return the data
            return chartData;
        }
    }
}
