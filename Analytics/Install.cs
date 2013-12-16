using System.Linq;
using System.Web.Hosting;
using System.Xml;
using umbraco.BusinessLogic;
using Umbraco.Core;

namespace Analytics
{
    public static class Install
    {

        /// <summary>
        /// 
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
        /// 
        /// </summary>
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
