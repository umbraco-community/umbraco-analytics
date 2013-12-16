using System.Web.Hosting;
using System.Xml;
using Umbraco.Web;

namespace Analytics
{
    public static class Uninstall
    {
        /// <summary>
        /// 
        /// </summary>
        public static void RemoveSection()
        {
            //Get the Umbraco Service's Api's
            var services = UmbracoContext.Current.Application.Services;

            //Check to see if the section is still here (should be)
            var analyticsSection = services.SectionService.GetByAlias("analytics");

            if (analyticsSection != null)
            {
                //Delete the section from the application
                services.SectionService.DeleteSection(analyticsSection);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        public static void RemoveSectionLanguageKeys()
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

                if (findSectionKey != null)
                {
                    //Let's remove the key from XML...
                    sectionNode.RemoveChild(findSectionKey);

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

                if (findTreeKey != null)
                {
                    //Let's remove the key from XML...
                    treeNode.RemoveChild(findTreeKey);

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
