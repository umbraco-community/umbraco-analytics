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
    /// http://localhost:62315/umbraco/Analytics/SettingsApi/GetSettings
    /// </summary>
    [PluginController("Analytics")]
    public class SettingsApiController : UmbracoAuthorizedApiController
    {
        /// <summary>
        /// Does what it says on the tin - the path to the settings.config file
        /// </summary>
        private const string ConfigPath = "~/App_Plugins/Analytics/settings.config";

        /// <summary>
        /// Gets Settings from the XML settings.config
        /// </summary>
        /// <returns>Serializes settings from XML file into a nice list of objects</returns>
        public List<SettingsValue> GetSettings()
        {
            //A list to store our settings
            var settings = new List<SettingsValue>();

            //Path to the settings.config file
            var configPath = HostingEnvironment.MapPath(ConfigPath);

            //Load settings.config XML file
            XmlDocument settingsXml = new XmlDocument();
            settingsXml.Load(configPath);

            //Get all child nodes of <Analytics> node
            XmlNodeList analayticsNode = settingsXml.SelectNodes("//Analytics");

            //Ensure we found the <Analytics> node in the config
            if (analayticsNode != null)
            {
                //Loop over child nodes inside <Analytics> node
                foreach (XmlNode settingNode in analayticsNode)
                {
                    foreach (XmlNode setting in settingNode.ChildNodes)
                    {
                        //Go & populate our model from each item in the XML file
                        var settingToAdd            = new SettingsValue();
                        settingToAdd.Key            = setting.Name;
                        settingToAdd.Label          = setting.Attributes["label"].Value;
                        settingToAdd.Description    = setting.Attributes["description"].Value;
                        settingToAdd.Value          = setting.InnerText;

                        //Add the item to the list
                        settings.Add(settingToAdd);
                    }
                }
            }

            //Return the list
            return settings;
        }

        public List<SettingsValue> PostSettings(List<SettingsValue> settings)
        {
            //Update the XML config file on disk

            //Path to the settings.config file
            var configPath = HostingEnvironment.MapPath(ConfigPath);

            //Load settings.config XML file
            XmlDocument settingsXml = new XmlDocument();
            settingsXml.Load(configPath);

            //Get all child nodes of <Analytics> node
            XmlNodeList analayticsNode = settingsXml.SelectNodes("//Analytics");

            //Loop over child nodes inside <Analytics> node
            foreach (XmlNode settingNode in analayticsNode)
            {
                foreach (XmlNode setting in settingNode.ChildNodes)
                {
                    //Go & populate our model from each item in the XML file
                    setting.InnerText = settings.SingleOrDefault(x => x.Key == setting.Name).Value;
                }
            }

            //Save the XML file back down to disk
            settingsXml.Save(configPath);

            //Return the same settings that passed in
            return settings;
        }
    }
}
