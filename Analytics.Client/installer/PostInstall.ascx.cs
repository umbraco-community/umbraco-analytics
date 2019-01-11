//using System;
//using System.Linq;
//using Umbraco.Web.UI.Controls;

//namespace Analytics.Installer
//{
//    public class PostInstall : UmbracoUserControl
//    {

//        protected void Page_Load(object sender, EventArgs e)
//        {
//            //Get the current user
//            var currentUser = Security.CurrentUser;

//            //Check if the user has access to the section
//            bool hasAccess = currentUser.AllowedSections.Contains("analytics");

//            if (!hasAccess)
//            {
//                //Add section if they do not have access to it already
//                currentUser.AddAllowedSection("analytics");
//            }
//        }
//    }
//}