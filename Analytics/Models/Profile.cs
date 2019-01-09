using System;
using Skybrud.Social.Google.Analytics.Models.Profiles;

namespace Analytics.Models
{

    public class Profile {

        public string Id { get; set; }
        public string AccountId { get; set; }
        public string WebPropertyId { get; set; }
        public string InternalWebPropertyId { get; set; }
        public string Name { get; set; }
        public string Currency { get; set; }
        public string Timezone { get; set; }
        public string WebsiteUrl { get; set; }
        public string Type { get; set; }
        public DateTime Created { get; set; }
        public DateTime Updated { get; set; }

        public Profile() {
            // Default constructor
        }

        public Profile(AnalyticsProfile profile) {
            Id = profile.Id;
            AccountId = profile.AccountId;
            WebPropertyId = profile.WebPropertyId;
            InternalWebPropertyId = profile.InternalWebPropertyId;
            Name = profile.Name;
            Currency = profile.Currency;
            Timezone = profile.Timezone;
            WebsiteUrl = profile.WebsiteUrl;
            Type = profile.Type;
            Created = profile.Created;
            Updated = profile.Updated;
        }

    }

}
