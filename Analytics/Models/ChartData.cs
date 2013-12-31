using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using Skybrud.Social.Google.Analytics.Responses;

namespace Analytics.Models
{
    public class ChartData
    {

        /*
        var chartData = {
                    labels: ["Desktop", "Mobile", "Tablet"],
                    datasets: [
                        {
                            fillColor: "rgba(245,112, 32,0.5)",
                            strokeColor: "rgba(245, 112, 32, 1)",
                            data: [87736, 2880, 2057]
                        },
                        {
                            fillColor: "rgba(245,112, 32,0.5)",
                            strokeColor: "rgba(245, 112, 32, 1)",
                            data: [236897, 5711, 5623]
                        }
                    ]
                };
        */

        public string [] labels { get; set; }

        public ChartDataSet[] datasets { get; set; }
    
    }

    public class ChartDataSet
    {
        public string fillColor { get; set; }

        public string strokeColor { get; set; }

        public object[] data { get; set; }
    }
}
