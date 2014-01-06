using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Xml;
using umbraco;
using umbraco.cms.businesslogic.macro;



namespace Analytics.Installer
{
    public partial class PostInstall : System.Web.UI.UserControl
    {

        protected void Page_Load(object sender, EventArgs e)
        {
            //gives current user access to the analytics section
            umbraco.BusinessLogic.User currentUser = umbraco.BasePages.UmbracoEnsuredPage.CurrentUser;
            bool hasAccess = false;

            foreach (umbraco.BusinessLogic.Application a in currentUser.Applications)
            {
                if (a.alias == "analytics")
                {
                    hasAccess = true;
                    break;
                }
            }

            //add application
            if (!hasAccess)
                currentUser.addApplication("analytics");
        }
    }
}