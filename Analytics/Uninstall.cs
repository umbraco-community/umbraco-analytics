using Umbraco.Web;

namespace Analytics
{
    public static class Uninstall
    {

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

        public static void RemoveSectionLanguageKeys()
        {
            bool saveFile = false;

            //Open XML file

            //Try & find if key exists

            //If it exists remove it from file

            //Check other key

            //Remove if it exists

            //If saveFile set to true - save the XML file with the items removed


        }
    }
}
