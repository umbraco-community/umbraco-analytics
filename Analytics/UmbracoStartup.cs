using System;
using System.Configuration;
using System.Linq;
using System.Web.Configuration;
using umbraco.BusinessLogic;
using umbraco.cms.businesslogic.packager;
using Umbraco.Core;
using Umbraco.Web;
using Umbraco.Web.Trees;
using Analytics.Models;
using Analytics.Controllers;

namespace Analytics
{
    public class UmbracoStartup : ApplicationEventHandler
    {
        private const string AppSettingKey = "AnalyticsStartupInstalled";

        /// <summary>
        /// Register Install & Uninstall Events
        /// </summary>
        /// <param name="umbracoApplication"></param>
        /// <param name="applicationContext"></param>
        protected override void ApplicationStarted(UmbracoApplicationBase umbracoApplication, ApplicationContext applicationContext)
        {
            //Check to see if appSetting AnalyticsStartupInstalled is true or even present
            var installAppSetting = WebConfigurationManager.AppSettings[AppSettingKey];

            if (string.IsNullOrEmpty(installAppSetting) || installAppSetting != true.ToString())
            {
                var install = new InstallHelpers();

                //Check to see if language keys for section needs to be added
                install.AddTranslations();

                //Check to see if section needs to be added
                install.AddSection(applicationContext);

                //Add Section Dashboard XML
                install.AddSectionDashboard();

                //All done installing our custom stuff
                //As we only want this to run once - not every startup of Umbraco
                var webConfig = WebConfigurationManager.OpenWebConfiguration("/");
                webConfig.AppSettings.Settings.Add(AppSettingKey, true.ToString());
                webConfig.Save();

            }

            //Add OLD Style Package Event
            InstalledPackage.BeforeDelete += InstalledPackage_BeforeDelete;

            //Add Tree Node Rendering Event - Used to check if user is admin to display settings node in tree
            TreeControllerBase.TreeNodesRendering += TreeControllerBase_TreeNodesRendering;
 
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        void TreeControllerBase_TreeNodesRendering(TreeControllerBase sender, TreeNodesRenderingEventArgs e)
        {
            //Get Current User
            var currentUser = User.GetCurrent();

            //This will only run on the analyticsTree & if the user is NOT admin
            if (sender.TreeAlias == "analyticsTree" && !currentUser.IsAdmin())
            {
                //setting node to remove
                var settingNode = e.Nodes.SingleOrDefault(x => x.Id.ToString() == "settings");

                //Ensure we found the node
                if (settingNode != null)
                {
                    //Remove the settings node from the collection
                    e.Nodes.Remove(settingNode);
                }
            }

            //This will only run on the analyticsTree
            if (sender.TreeAlias == "analyticsTree")
            {
                AnalyticsApiController gaApi = new AnalyticsApiController();

                Profile profile = AnalyticsHelpers.GetProfile();

                if (profile != null)
                {
                    var ecommerceNode = e.Nodes.SingleOrDefault(x => x.Id.ToString() == "ecommerce");
                    if (ecommerceNode != null)
                    {
                        try
                        {
                            // check if profile has any ecommerce data for last 3 years
                            StatsApiResult transactions = gaApi.GetTransactions(profile.Id, DateTime.Now.AddYears(-3), DateTime.Now);
                            if (!transactions.ApiResult.Rows.Any())
                            {
                                //Remove the ecommerce node from the collection
                                //If no Rows returned from API - then remove the node from the tree
                                e.Nodes.Remove(ecommerceNode);
                            }
                        }
                        catch
                        {
                            //Remove the ecommerce node from the collection
                            //If the API throws an ex then remove the node from the tree as well
                            e.Nodes.Remove(ecommerceNode);
                        }
                    }
                }
            }
        }

        /// <summary>
        /// Uninstall Package - Before Delete (Old style events, no V6/V7 equivelant)
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        void InstalledPackage_BeforeDelete(InstalledPackage sender, System.EventArgs e)
        {
            //Check which package is being uninstalled
            if (sender.Data.Name == "Analytics")
            {
                var uninstall = new UninstallHelpers();

                //Start Uninstall - clean up process...
                uninstall.RemoveSection();
                uninstall.RemoveTranslations();
                uninstall.RemoveSectionDashboard();

                //Remove AppSetting key when all done
                ConfigurationManager.AppSettings.Remove(AppSettingKey);
            }
        }
    }
}
