using System.Web.Hosting;
using System.Xml.Linq;

namespace Analytics {

    /// <summary>
    /// This code is not pretty and not intented to be. Will be rewritten later, but for now it
    /// serves as a global way to read from and write to the settings file.
    /// </summary>
    public class AnalyticsConfig {

        /// <summary>
        /// Gets the client ID from the config file.
        /// </summary>
        public static string ConfigFilePath {
            get { return HostingEnvironment.MapPath("~/App_Plugins/Analytics/settings.config"); }
        }

        public static string GetSetting(string key) {
            // TODO: This is just for POC - use Warren's logic instead
            XElement xAnalytics = XElement.Load(ConfigFilePath);
            XElement xSetting = xAnalytics.Element(key);
            return xSetting == null ? null : xSetting.Value;
        }

        public static void SetSetting(string key, string value) {
            // TODO: This is just for POC - use Warren's logic instead
            XElement xAnalytics = XElement.Load(ConfigFilePath);
            XElement xSetting = xAnalytics.Element(key);
            if (xSetting == null) {
                xAnalytics.Add(new XElement(
                    key,
                    new XAttribute("label", key),
                    new XAttribute("description", ""),
                    value ?? ""
                ));
            } else {
                xSetting.Value = value;
            }
            xAnalytics.Save(ConfigFilePath);
        }
        
        /// <summary>
        /// Gets the client ID from the config file.
        /// </summary>
        public static string ClientId {
            get { return GetSetting("ClientId"); }
        }

        /// <summary>
        /// Gets the client secret from the config file.
        /// </summary>
        public static string ClientSecret {
            get { return GetSetting("ClientSecret"); }
        }

        /// <summary>
        /// Get the redirect URI from the config file.
        /// </summary>
        public static string RedirectUri {
            get { return GetSetting("RedirectUri"); }
        }

        /// <summary>
        /// The refresh token used to acquire new access tokens. This is sensitive information.
        /// </summary>
        public static string RefreshToken {
            get { return GetSetting("RefreshToken"); }
            set { SetSetting("RefreshToken", value); }
        }

    }

}
