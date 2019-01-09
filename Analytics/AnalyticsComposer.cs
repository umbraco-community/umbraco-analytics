using Umbraco.Core;
using Umbraco.Core.Components;

namespace Analytics
{
    [RuntimeLevel(MinLevel = RuntimeLevel.Run)]
    public class AnalyticsComposer : IUserComposer
    {
        public void Compose(Composition composition)
        {
            composition.Components().Append<AnalyticsComponent>();
        }
    }
}
