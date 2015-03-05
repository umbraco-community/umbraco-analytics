using System.IO;
using System.Web.Hosting;
using Analytics.Models;
using Newtonsoft.Json;

namespace Analytics {

    public static class AnalyticsHelpers {
        
        public const string ConfigPath = "~/App_Plugins/Analytics/settings.config";
        
        public const string AccountPath = "~/App_Plugins/Analytics/account.config";

        public const string ProfilePath = "~/App_Plugins/Analytics/profile.config";

        public static string UmbracoVersion {
            get { return Umbraco.Core.Configuration.UmbracoVersion.Current.ToString(); }
        }

        /// <summary>
        /// Reads the contents of the file at the specified <code>path</code>. The path may be either virtual, relative or absolute.
        /// </summary>
        /// <param name="path">The path to the file.</param>
        public static string ReadAllText(string path) {
            if (path.StartsWith("~/")) path = HostingEnvironment.MapPath(path);
            using (FileStream fileStream = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.ReadWrite)) {
                using (StreamReader textReader = new StreamReader(fileStream)) {
                    return textReader.ReadToEnd();
                }
            }
        }

        /// <summary>
        /// Gets a reference to the profile saved to <code>profile.config</code>.
        /// </summary>
        public static Profile GetProfile() {
            return JsonConvert.DeserializeObject<Profile>(ReadAllText(ProfilePath));
        }
 
    }

}