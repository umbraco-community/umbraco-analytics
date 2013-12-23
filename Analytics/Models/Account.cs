using System;
using Skybrud.Social.Google.Analytics.Objects;

namespace Analytics.Models {
    
    public class Account {

        public string Id { get; set; }
        public string Name { get; set; }
        public DateTime Created { get; set; }
        public DateTime Updated { get; set; }

        public Account() {
            // Default constructor
        }

        public Account(AnalyticsAccount account) {
            Id = account.Id;
            Name = account.Name;
            Created = account.Created;
            Updated = account.Updated;
        }

    }

}
