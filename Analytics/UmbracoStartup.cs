using System.Linq;
using Umbraco.Core;
using Umbraco.Core.Models;

namespace Analytics
{
    public class UmbracoStartup : ApplicationEventHandler
    {
        protected override void ApplicationStarted(UmbracoApplicationBase umbracoApplication, ApplicationContext applicationContext)
        {
            //Get SectionService
            var sectionService = applicationContext.Services.SectionService;
            
            //Try & find a section with the alias of "analyticsSection"
            var analyticsSection = sectionService.GetSections().SingleOrDefault(x => x.Alias == "analytics");

            //If we can't find the section - doesn't exist
            if (analyticsSection == null)
            {
                //So let's create it the section
                sectionService.MakeNew("Analytics", "analytics", "icon-pulse");
            }
        }
    }
}
