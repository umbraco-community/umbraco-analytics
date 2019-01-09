using Umbraco.Web.Models.Trees;

namespace Analytics
{
    /// <summary>
    /// This class is picked up by Umbraco TypeLoader & will register the application/section
    /// </summary>
    [Application("analytics", "Analytics")]
    public class AnalyticsApplication : IApplication { }

}
