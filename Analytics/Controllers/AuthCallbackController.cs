using System;

namespace Analytics.Controllers
{
    /// <summary>
    /// Taken from tutorial at
    /// https://code.google.com/p/google-api-dotnet-client/wiki/OAuth2
    /// </summary>
    public class AuthCallbackController : Google.Apis.Auth.OAuth2.Mvc.Controllers.AuthCallbackController
    {
        protected override Google.Apis.Auth.OAuth2.Mvc.FlowMetadata FlowData
        {
            get { 
                //return new AppFlowMetadata();
                return null;
            }
        }
    }
}
