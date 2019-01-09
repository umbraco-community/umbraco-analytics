using Umbraco.Web.Composing;

namespace Analytics
{
    public class UninstallHelpers
    {
        /// <summary>
        /// Removes the custom app/section from Umbraco
        /// </summary>
        public void RemoveSection()
        {
            //Get the Umbraco Service's Api's
            var sections = Current.Services.SectionService;

            //Check to see if the section is still here (should be)
            var analyticsSection = sections.GetByAlias("analytics");

            if (analyticsSection != null)
            {
                //Delete the section from the application
                sections.DeleteSection(analyticsSection);
            }
        }
    }
}
