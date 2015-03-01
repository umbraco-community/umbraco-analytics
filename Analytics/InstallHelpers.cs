using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web.Hosting;
using System.Xml;
using Umbraco.Core;
using Umbraco.Core.Logging;

namespace Analytics
{
    public class InstallHelpers
    {
        // Set the path of the language files directory
        private const string UmbracoLangPath = "~/umbraco/config/lang/";
        private const string AnalyticsLangPath = "~/App_Plugins/Analytics/Config/Lang/";

        public static IEnumerable<FileInfo> GetUmbracoLanguageFiles()
        {
            var umbPath = HostingEnvironment.MapPath(UmbracoLangPath);
            var di = new DirectoryInfo(umbPath);
            return di.GetFiles("*.xml");
        }

        public static IEnumerable<FileInfo> GetAnalyticsLanguageFiles()
        {
            var analyticsPath = HostingEnvironment.MapPath(AnalyticsLangPath);
            var di = new DirectoryInfo(analyticsPath);
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
        public void AddTranslations()
        {
            var analyticsFiles = GetAnalyticsLanguageFiles();
            LogHelper.Info<InstallHelpers>(string.Format("{0} Analytics Plugin language files to be merged into Umbraco language files", analyticsFiles.Count()));
            
            //Convert to an array
            var analyticsFileArray = analyticsFiles as FileInfo[] ?? analyticsFiles.ToArray();

            //Check which language filenames that we have match up
            var existingLangs = GetUmbracoLanguageFilesToInsertLocalizationData();
            LogHelper.Info<InstallHelpers>(string.Format("{0} Umbraco language files that match up with our Analytics language files", existingLangs.Count()));

            //For each umbraco language file...
            foreach (var lang in existingLangs)
            {
                var analytics = new XmlDocument() { PreserveWhitespace = true };
                var umb = new XmlDocument() { PreserveWhitespace = true };

                try
                {
                    //From our analytics language file/s - try & find a file with the same name
                    var match = analyticsFileArray.FirstOrDefault(x => x.Name == lang.Name);

                    //Ensure we have a match & not null
                    if (match != null)
                    {
                        //Load the two XML files
                        analytics.LoadXml(File.ReadAllText(match.FullName));
                        umb.LoadXml(File.ReadAllText(lang.FullName));

                        //Get all of the <area>'s from analytics XML file & their child elements
                        var areas = analytics.DocumentElement.SelectNodes("//area");

                        //For each <area> in our XML...
                        foreach (var area in areas)
                        {
                            //Import the XML <area> stub into the Umbraco lang file
                            var import = umb.ImportNode((XmlNode)area, true);
                            umb.DocumentElement.AppendChild(import);



                            //TODO: Verify if <area> with alias already exists
                            //If not exist just import the <area> & all children

                            //If area exists THEN for each <key> in <area>
                            //Verify if key exists. If no key ADD it
                            //Otherwise ignore it as may override/conflict with an existing key


                            
                        }

                        //Save the umb lang file with the merged contents
                        umb.Save(lang.FullName);
                    }
                }
                catch (Exception ex)
                {   
                    LogHelper.Error<InstallHelpers>("Failed to add Analytics localization values to language file", ex);
                }

            }
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


        /// <summary>
        /// 
        /// </summary>
        [Obsolete]
        public void AddSectionLanguageKeys()
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
