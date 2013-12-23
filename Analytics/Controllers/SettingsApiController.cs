using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web.Hosting;
using System.Web.Http;
using System.Xml;
using Analytics.Models;
using Skybrud.Social.Google.Analytics.Objects;
using Skybrud.Social.Json;
using Umbraco.Web.Mvc;
using Umbraco.Web.WebApi;
using Formatting = Newtonsoft.Json.Formatting;

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
        private const string ConfigPath     = "~/App_Plugins/Analytics/settings.config";
        private const string AccountPath    = "~/App_Plugins/Analytics/account.config";
        private const string ProfilePath    = "~/App_Plugins/Analytics/profile.config";

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

        public SettingsValue GetSetting(string key)
        {
            //Path to the settings.config file
            var configPath = HostingEnvironment.MapPath(ConfigPath);

            //Load settings.config XML file
            XmlDocument settingsXml = new XmlDocument();
            settingsXml.Load(configPath);

            //Get specific node 
            XmlNode settingNode = settingsXml.SelectSingleNode("//Analytics/" + key);

            if (settingNode != null)
            {
                //Go & populate our model
                var setting         = new SettingsValue();
                setting.Key         = settingNode.Name;
                setting.Label       = settingNode.Attributes["label"].Value;
                setting.Description = settingNode.Attributes["description"].Value;
                setting.Value       = settingNode.InnerText;

                return setting;
            }

            return null;
        }

        public string GetSettingValue(string key)
        {
            //Path to the settings.config file
            var configPath = HostingEnvironment.MapPath(ConfigPath);

            //Load settings.config XML file
            XmlDocument settingsXml = new XmlDocument();
            settingsXml.Load(configPath);

            //Get specific node 
            XmlNode settingNode = settingsXml.SelectSingleNode("//Analytics/" + key);

            if (settingNode != null)
            {
                return settingNode.InnerText;
            }

            return string.Empty;
        }

        public SettingsValue PostSetting(SettingsValue setting)
        {
            //Update the XML config file on disk

            //Path to the settings.config file
            var configPath = HostingEnvironment.MapPath(ConfigPath);

            //Load settings.config XML file
            XmlDocument settingsXml = new XmlDocument();
            settingsXml.Load(configPath);

            //Get all child nodes of <Analytics> node
            XmlNode settingNode = settingsXml.SelectSingleNode("//Analytics/" + setting.Key);

            //Go & update the value
            if (settingNode != null)
            {
                settingNode.InnerText = setting.Value;
            }

            //Save the XML file back down to disk
            settingsXml.Save(configPath);

            //Return the same setting that passed in
            return setting;
        }

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

        public bool GetAuth()
        {
            //Check to see if RefreshToken has a value or not
            //Assume if there is a value we have auth'd from Google with oAuth

            //Path to the settings.config file
            var configPath = HostingEnvironment.MapPath(ConfigPath);

            //Load settings.config XML file
            XmlDocument settingsXml = new XmlDocument();
            settingsXml.Load(configPath);

            //Get specific node 
            XmlNode refreshNode = settingsXml.SelectSingleNode("//Analytics/RefreshToken");

            //Make sure we found it
            if (refreshNode != null)
            {
                //If we have a value (aka bigger than 0) then we have a refresh token
                //Aka we have Auth'd against Google
                return refreshNode.InnerText.Length > 0;
            }

            return false;
        }


        public AnalyticsAccount GetAccount()
        {
            //Open JSON file from disk
            var accountAsJson = File.ReadAllText(HostingEnvironment.MapPath(AccountPath));

            //Deserialize to .NET object
            var account = JsonConverter.ParseObject(accountAsJson, AnalyticsAccount.Parse);

            return account;
        }

        public AnalyticsProfile GetProfile()
        {
            //Open JSON file from disk
            var profileAsJson = File.ReadAllText(HostingEnvironment.MapPath(ProfilePath));

            //Deserialize to .NET object
            var profile = JsonConverter.ParseObject(profileAsJson, AnalyticsProfile.Parse);

            return profile;
        }

        public dynamic PostAccount(dynamic account)
        {
            //Convert the posted object down into JSON
            var accountAsJson = Newtonsoft.Json.JsonConvert.SerializeObject(account, Formatting.Indented);

            //Open file on disk & save contents
            File.WriteAllText(HostingEnvironment.MapPath(AccountPath), accountAsJson);

            return account;
        }

        public dynamic PostProfile(dynamic profile)
        {
            //Convert the posted object down into JSON
            var profileAsJson = Newtonsoft.Json.JsonConvert.SerializeObject(profile, Formatting.Indented);

            //Open file on disk & save contents
            File.WriteAllText(HostingEnvironment.MapPath(ProfilePath), profileAsJson);

            return profile;
        }
    }
}
