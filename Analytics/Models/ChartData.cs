
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

        public dynamic[] datasets { get; set; }
    
    }

    public class ChartDataSet
    {
        public string fillColor { get; set; }

        public string strokeColor { get; set; }

        public object[] data { get; set; }
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
