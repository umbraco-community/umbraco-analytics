using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web.Hosting;
using System.Web.UI.WebControls;
using System.Xml;
using Umbraco.Core;
using Umbraco.Core.Logging;

namespace Analytics
{
    public class InstallHelpers
    {
        /// <summary>
        /// Add & merge in tranlsations from our lang files into Umbraco lang files
        /// </summary>
        public void AddTranslations()
        {
            TranslationHelper.AddTranslations();
        }


        /// <summary>
        /// Adds the application/custom section to Umbraco
        /// </summary>
        /// <param name="applicationContext"></param>
        public void AddSection(ApplicationContext applicationContext)
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

        

        /// <summary>
        /// Adds the required XML to the dashboard.config file
        /// </summary>
        public void AddSectionDashboard()
        {
            bool saveFile = false;

            //Open up language file
            //umbraco/config/lang/en.xml
            var dashboardPath = "~/config/dashboard.config";

            //Path to the file resolved
            var dashboardFilePath = HostingEnvironment.MapPath(dashboardPath);

            //Load settings.config XML file
            XmlDocument dashboardXml = new XmlDocument();
            dashboardXml.Load(dashboardFilePath);

            // Section Node
            XmlNode findSection = dashboardXml.SelectSingleNode("//section [@alias='AnalyticsDashboardSection']");

            //Couldn't find it
            if (findSection == null)
            {
                //Let's add the xml
                var xmlToAdd = "<section alias='AnalyticsDashboardSection'>" +
                                    "<areas>" +
                                        "<area>analytics</area>" +
                                    "</areas>" +
                                    "<tab caption='Last 7 days'>" +
                                        "<control addPanel='true' panelCaption=''>/App_Plugins/Analytics/backOffice/AnalyticsTree/partials/dashboard.html</control>" +
                                    "</tab>" +
                               "</section>";

                //Get the main root <dashboard> node
                XmlNode dashboardNode = dashboardXml.SelectSingleNode("//dashBoard");

                if (dashboardNode != null)
                {
                    //Load in the XML string above
                    XmlDocument xmlNodeToAdd = new XmlDocument();
                    xmlNodeToAdd.LoadXml(xmlToAdd);

                    var toAdd = xmlNodeToAdd.SelectSingleNode("*");

                    //Append the xml above to the dashboard node
                    dashboardNode.AppendChild(dashboardNode.OwnerDocument.ImportNode(toAdd, true));



                    //Save the file flag to true
                    saveFile = true;
                }
            }

            //If saveFile flag is true then save the file
            if (saveFile)
            {
                //Save the XML file
                dashboardXml.Save(dashboardFilePath);
            }
        }
        
    }
}
