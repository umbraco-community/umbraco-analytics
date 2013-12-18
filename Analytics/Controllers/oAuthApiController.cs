using System.Collections.Generic;
using System.Linq;
using System.Web.Hosting;
using System.Xml;
using Analytics.Models;
using Umbraco.Web.Mvc;
using Umbraco.Web.WebApi;

namespace Analytics.Controllers
{
    /// <summary>
    /// Web API Controller for Fetching & Saving values from settings.config file
    /// 
    /// Example route URL to API
    /// http://localhost:62315/umbraco/Analytics/oAuthApi/PostSettingValue
    /// </summary>
    [PluginController("Analytics")]
    public class oAuthApiController : UmbracoApiController
    {
        /// <summary>
        /// Does what it says on the tin - the path to the settings.config file
        /// </summary>
        private const string ConfigPath = "~/App_Plugins/Analytics/settings.config";


        public string PostSettingValue(string key, string value)
        {
            //Update the XML config file on disk

            //Path to the settings.config file
            var configPath = HostingEnvironment.MapPath(ConfigPath);

            //Load settings.config XML file
            XmlDocument settingsXml = new XmlDocument();
            settingsXml.Load(configPath);

            //Get all child nodes of <Analytics> node
            XmlNode settingNode = settingsXml.SelectSingleNode("//Analytics/" + key);

            //Go & update the value
            if (settingNode != null)
            {
                settingNode.InnerText = value;
            }

            //Save the XML file back down to disk
            settingsXml.Save(configPath);

            //Return the same setting that passed in
            return value;
        }
    }
}
