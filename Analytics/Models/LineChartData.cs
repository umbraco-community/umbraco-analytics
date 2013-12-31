
namespace Analytics.Models
{
    public class LineChartData
    {

        /*
        var chartData = {
                    labels: ["Desktop", "Mobile", "Tablet"],
                    datasets: [
                        {
                            fillColor : "rgba(220,220,220,0.5)",
			                strokeColor : "rgba(220,220,220,1)",
			                pointColor : "rgba(220,220,220,1)",
			                pointStrokeColor : "#fff",
                            data: [87736, 2880, 2057]
                        },
                        {
                            fillColor : "rgba(220,220,220,0.5)",
			                strokeColor : "rgba(220,220,220,1)",
			                pointColor : "rgba(220,220,220,1)",
			                pointStrokeColor : "#fff",
                            data: [236897, 5711, 5623]
                        }
                    ]
                };
        */

        public string [] labels { get; set; }

        public LineChartDataSet[] datasets { get; set; }
    
    }

    public class LineChartDataSet
    {

        public string fillColor { get; set; }

        public string strokeColor { get; set; }

        public string pointColor { get; set; }

        public string pointStrokeColor { get; set; }

        public object[] data { get; set; }
    }
}
