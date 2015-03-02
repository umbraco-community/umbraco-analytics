using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web.Hosting;
using System.Xml;
using Umbraco.Core.Logging;

namespace Analytics
{
    /// <summary>
    /// Kudos to the Merchello guys for this approach of merging lang files back into the main
    /// Umbraco lang files
    /// https://github.com/Merchello/Merchello/blob/1.7.1/src/Merchello.Web/PackageActions/AddLocalizationAreas.cs
    /// </summary>
    public class TranslationHelper
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

        public static void AddTranslations()
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
                var analytics = new XmlDocument() {PreserveWhitespace = true};
                var umb = new XmlDocument() {PreserveWhitespace = true};

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
                        foreach (XmlNode area in areas)
                        {
                            //Get the current area in this loop from our analytics translation file - alias attribute
                            var aliasToTryFind = area.Attributes["alias"];

                            //Try and find <area> with same alias in the umbraco file
                            var findAreaInUmbracoLang = umb.SelectSingleNode(string.Format("//area [@alias='{0}']", aliasToTryFind.Value));

                            //Can not find <area> to import/merge in Umbraco lang file
                            if (findAreaInUmbracoLang == null)
                            {
                                //So let's just import the area and child keys
                                var import = umb.ImportNode(area, true);
                                umb.DocumentElement.AppendChild(import);
                            }
                            else
                            {
                                //We have found the <area> so don't just overwrite from what we have
                                //Ensure to go through each key and check we have it or not
                                foreach (XmlNode areaKey in area.ChildNodes)
                                {
                                    //Added as area.childNodes contained 3 items for one element - with 2 being WhiteSpace elements
                                    if (areaKey.NodeType == XmlNodeType.Element)
                                    {
                                        //Get the current area in this loop from our analytics translation file - alias attribute
                                        var keyAliasToTryFind = areaKey.Attributes["alias"];

                                        //Try and find <key> is in the Umbraco XML lang doc
                                        var findKeyInUmbracoLang = findAreaInUmbracoLang.SelectSingleNode(string.Format("./key [@alias='{0}']", keyAliasToTryFind.Value));

                                        //Can not find <key> in Umbraco lang file - let's add it
                                        //And DO NOTHING if we do find it - don't want to overwrite it
                                        if (findKeyInUmbracoLang == null)
                                        {
                                            var keyImport = umb.ImportNode(areaKey, true);
                                            findAreaInUmbracoLang.AppendChild(keyImport);
                                        }
                                    }

                                    
                                }
                            }
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

        public static void RemoveTranslations()
        {
            var analyticsFiles = GetAnalyticsLanguageFiles();
            LogHelper.Info<InstallHelpers>(string.Format("{0} Analytics Plugin language files to be removed into Umbraco language files", analyticsFiles.Count()));

            //Convert to an array
            var analyticsFileArray = analyticsFiles as FileInfo[] ?? analyticsFiles.ToArray();

            //Check which language filenames that we have match up
            var existingLangs = GetUmbracoLanguageFilesToInsertLocalizationData();
            LogHelper.Info<InstallHelpers>(string.Format("{0} Umbraco language files that match up with our Analytics language files",existingLangs.Count()));

            //For each umbraco language file...
            foreach (var lang in existingLangs)
            {
                var analytics = new XmlDocument() {PreserveWhitespace = true};
                var umb = new XmlDocument() {PreserveWhitespace = true};

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
                        foreach (XmlNode area in areas)
                        {
                            //Get the current area in this loop from our analytics translation file - alias attribute
                            var aliasToTryFind = area.Attributes["alias"];

                            //Try and find <area> with same alias in the umbraco file
                            var findAreaInUmbracoLang =
                                umb.SelectSingleNode(string.Format("//area [@alias='{0}']", aliasToTryFind.Value));

                            //Found <area> with alias to remove from Umbraco lang file
                            if (findAreaInUmbracoLang != null)
                            {
                                //We have found the <area> so don't just REMOVE it entirely from what we have
                                //As may be 'treeHeaders' or 'sections' as the area which is core Umbraco
                                //Ensure to go through each key and check we have it or not
                                foreach (XmlNode areaKey in area.ChildNodes)
                                {
                                    //Get the current area in this loop from our analytics translation file - alias attribute
                                    var keyAliasToTryFind = areaKey.Attributes["alias"];

                                    //Try and find <key> is in the Umbraco XML lang doc
                                    var findKeyInUmbracoLang = findAreaInUmbracoLang.SelectSingleNode(string.Format("//key [@alias='{0}']", keyAliasToTryFind.Value));

                                    //Can find <key> in Umbraco lang file - let's REMOVE it
                                    if (findKeyInUmbracoLang != null)
                                    {
                                        var keyToRemove = umb.ImportNode(areaKey, true);
                                        findAreaInUmbracoLang.RemoveChild(keyToRemove);
                                    }
                                }

                                //After looping through all - lets check we have no <key> left in them
                                if (!area.HasChildNodes)
                                {
                                    //No child nodes - so is our custom analytics areas as opposed to Umbraco core ones 'treeHeaders' & 'sections'
                                    //Remove the area itself as it's empty
                                    var areaToRemove = umb.ImportNode(area, true);
                                    analytics.DocumentElement.RemoveChild(areaToRemove);
                                }
                            }
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
    }
}
