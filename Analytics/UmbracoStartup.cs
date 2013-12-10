using System.Linq;
using Umbraco.Core;

namespace Analytics
{
    public class UmbracoStartup : ApplicationEventHandler
    {
        /// <summary>
        /// Umbraco has started
        /// </summary>
        /// <param name="umbracoApplication"></param>
        /// <param name="applicationContext"></param>
        protected override void ApplicationStarted(UmbracoApplicationBase umbracoApplication, ApplicationContext applicationContext)
        {
            //Get SectionService
            var sectionService = applicationContext.Services.SectionService;

            //Try & find a section with the alias of "Analytics"
            var analyticsSection = sectionService.GetSections().SingleOrDefault(x => x.Alias == "analyticsSection");

            //If we can't find the section - doesn't exist
            if (analyticsSection == null)
            {
                //So let's create it the section
                sectionService.MakeNew("Analytics", "analyticsSection", "icon-pulse");
            }
        }
    }
}
