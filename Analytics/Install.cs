using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Web.Hosting;
using System.Xml;
using Umbraco.Core;
using Umbraco.Web;

namespace Analytics
{
    public static class Install
    {
        // Set the path of the language files directory
        private const string UmbracoLangPath = "~/umbraco/config/lang/";
        private const string AnalyticsLangPath = "~/App_Plugins/Analytics/Config/Lang/";

        /// <summary>
        /// KUDOS Again to the Merchello guys!!
        /// 
        /// Returns the path to the root of the application, by getting the path to where the assembly where this
        /// method is included is present, then traversing until it's past the /bin directory. This makes it work
        /// even if the assembly is in a /bin/debug or /bin/release folder
        /// </summary>
        /// <returns>
        /// The root directory path
        /// </returns>
        public static string GetRootDirectory()
        {
            var codeBase = Assembly.GetExecutingAssembly().CodeBase;
            var uri = new Uri(codeBase);
            var path = uri.LocalPath;
            var baseDirectory = Path.GetDirectoryName(path);

            if (string.IsNullOrEmpty(baseDirectory))
            {
                throw new Exception("No root directory could be resolved. Please ensure that your Umbraco solution is correctly configured.");

            }
                
            var rootDir = baseDirectory.Contains("bin")
                           ? baseDirectory.Substring(0, baseDirectory.LastIndexOf("bin", StringComparison.OrdinalIgnoreCase) - 1)
                           : baseDirectory;

            return rootDir;
        }

        public static IEnumerable<FileInfo> GetUmbracoLanguageFiles()
        {
            var di = new DirectoryInfo(string.Format("{0}{1}", GetRootDirectory(), UmbracoLangPath.Replace("~", string.Empty).Replace("/", "\\")));
            return di.GetFiles("*.xml");
        }

        public static IEnumerable<FileInfo> GetAnalyticsLanguageFiles()
        {
            var di = new DirectoryInfo(string.Format("{0}{1}", GetRootDirectory(), AnalyticsLangPath.Replace("~", string.Empty).Replace("/", "\\")));
            return di.GetFiles("*.xml");
        }


        public static IEnumerable<FileInfo> GetUmbracoLanguageFilesToInsertLocalizationData()
        {
            return GetUmbracoLanguageFiles().Where(x => GetAnalyticsLanguageFiles().Any(y => y.Name == x.Name));
        }

        /// <summary>
        /// Kudos to the Merchello guys for this approach of merging lang files back into the main
        /// Umbraco lang files
        /// https://github.com/Merchello/Merchello/blob/1.7.1/src/Merchello.Web/PackageActions/AddLocalizationAreas.cs
        /// </summary>
        public static void AddTranslations()
        {

        }


        /// <summary>
        /// Adds the application/custom section to Umbraco
        /// </summary>
        /// <param name="applicationContext"></param>
        public static void AddSection(ApplicationContext applicationContext)
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
        public static void AddSectionDashboard()
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


        /// <summary>
        /// 
        /// </summary>
        [Obsolete]
        public static void AddSectionLanguageKeys()
        {
            bool saveFile = false;

            //Open up language file
            //umbraco/config/lang/en.xml
            var langPath = "~/umbraco/config/lang/en.xml";

            //Path to the file resolved
            var langFilePath = HostingEnvironment.MapPath(langPath);

            //Load settings.config XML file
            XmlDocument langXml = new XmlDocument();
            langXml.Load(langFilePath);

            // Section Node
            // <area alias="sections">
            XmlNode sectionNode = langXml.SelectSingleNode("//area [@alias='sections']");

            if (sectionNode != null)
            {
                XmlNode findSectionKey = sectionNode.SelectSingleNode("./key [@alias='analytics']");

                if (findSectionKey == null)
                {
                    //Let's add the key
                    var attrToAdd       = langXml.CreateAttribute("alias");
                    attrToAdd.Value     = "analytics";

                    var keyToAdd        = langXml.CreateElement("key");
                    keyToAdd.InnerText  = "Analytics";
                    keyToAdd.Attributes.Append(attrToAdd);

                    sectionNode.AppendChild(keyToAdd);

                    //Save the file flag to true
                    saveFile = true;
                }
            }

            // Section Node
            // <area alias="treeHeaders">
            XmlNode treeNode = langXml.SelectSingleNode("//area [@alias='treeHeaders']");

            if (treeNode != null)
            {
                XmlNode findTreeKey = treeNode.SelectSingleNode("./key [@alias='analytics']");

                if (findTreeKey == null)
                {
                    //Let's add the key
                    var attrToAdd       = langXml.CreateAttribute("alias");
                    attrToAdd.Value     = "analytics";

                    var keyToAdd        = langXml.CreateElement("key");
                    keyToAdd.InnerText  = "Analytics";
                    keyToAdd.Attributes.Append(attrToAdd);

                    treeNode.AppendChild(keyToAdd);

                    //Save the file flag to true
                    saveFile = true;
                }
            }


            //If saveFile flag is true then save the file
            if (saveFile)
            {
                //Save the XML file
                langXml.Save(langFilePath);
            }
        }


       

        
    }
}
