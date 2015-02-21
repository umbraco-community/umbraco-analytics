using System;
using System.Collections.Generic;
using Analytics.Models;
using Lucene.Net.Analysis;
using Umbraco.Core;
using Umbraco.Web.Models.Trees;
using Umbraco.Web.Mvc;
using Umbraco.Web.Trees;
using umbraco;
using umbraco.BusinessLogic.Actions;

namespace Analytics.Controllers
{
    [Tree("analytics", "analyticsTree", "Analytics")]
    [PluginController("Analytics")]
    public class AnalyticsTreeController : TreeController
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <param name="queryStrings"></param>
        /// <returns></returns>
        protected override Umbraco.Web.Models.Trees.TreeNodeCollection GetTreeNodes(string id, System.Net.Http.Formatting.FormDataCollection queryStrings)
        {
            //check if we're rendering the root node's children
            if (id == Constants.System.Root.ToInvariantString())
            {
                //Nodes that we will return
                var nodes = new TreeNodeCollection();

                //Main Route
                var mainRoute = "/analytics/analyticsTree";

                //Add nodes
                var treeNodes = new List<SectionTreeNode>();
                //treeNodes.Add(new SectionTreeNode() { Id = "real-time", Title = "Real Time", Icon = "icon-connection", Route = string.Format("{0}/view/{1}", mainRoute, "real-time") });
                
                treeNodes.Add(new SectionTreeNode() { Id = "views", Title = ui.Text("analytics", "views"), Icon = "icon-activity", Route = string.Format("{0}/view/{1}", mainRoute, "views") });
                treeNodes.Add(new SectionTreeNode() { Id = "keywords", Title = ui.Text("analytics", "keywords"), Icon = "icon-tags", Route = string.Format("{0}/view/{1}", mainRoute, "keywords") });
                treeNodes.Add(new SectionTreeNode() { Id = "social", Title = ui.Text("analytics", "socialNetwork"), Icon = "icon-chat-active", Route = string.Format("{0}/view/{1}", mainRoute, "social") });
                treeNodes.Add(new SectionTreeNode() { Id = "os", Title = ui.Text("analytics", "operatingSystem"), Icon = "icon-windows", Route = string.Format("{0}/view/{1}", mainRoute, "os") });
                treeNodes.Add(new SectionTreeNode() { Id = "screenres", Title = ui.Text("analytics", "screenResolution"), Icon = "icon-display", Route = string.Format("{0}/view/{1}", mainRoute, "screenres") });
                treeNodes.Add(new SectionTreeNode() { Id = "devices", Title = ui.Text("analytics", "devices"), Icon = "icon-iphone", Route = string.Format("{0}/view/{1}", mainRoute, "devices") });
                treeNodes.Add(new SectionTreeNode() { Id = "browser", Title = ui.Text("analytics", "browser"), Icon = "icon-browser-window", Route = string.Format("{0}/view/{1}", mainRoute, "browser") });
                treeNodes.Add(new SectionTreeNode() { Id = "language", Title = ui.Text("analytics", "language"), Icon = "icon-chat-active", Route = string.Format("{0}/view/{1}", mainRoute, "language") });
                treeNodes.Add(new SectionTreeNode() { Id = "country", Title = ui.Text("analytics", "country"), Icon = "icon-globe", Route = string.Format("{0}/view/{1}", mainRoute, "country") });
                treeNodes.Add(new SectionTreeNode() { Id = "ecommerce", Title = ui.Text("analytics", "ecommerce"), Icon = "icon-shopping-basket", Route = string.Format("{0}/view/{1}", mainRoute, "ecommerce") });
                treeNodes.Add(new SectionTreeNode() { Id = "settings", Title = ui.Text("analytics", "settings"), Icon = "icon-settings", Route = string.Format("{0}/edit/{1}", mainRoute, "settings") });

                foreach (var item in treeNodes)
                {
                    //When clicked - /App_Plugins/Diagnostics/backoffice/diagnosticsTree/edit.html
                    //URL in address bar - /developer/diagnosticsTree/General/someID
                    //var route = string.Format("/analytics/analyticsTree/view/{0}", item.Value);
                    bool hasChildNodes = item.Id == "ecommerce" ? true : false;
                    var nodeToAdd = CreateTreeNode(item.Id, null, queryStrings, item.Title, item.Icon, hasChildNodes, item.Route);

                    //Add it to the collection
                    nodes.Add(nodeToAdd);
                }

                //Return the nodes
                return nodes;
            }


            if (id == "ecommerce")
            {
                //Main Route
                var mainRoute = "/analytics/analyticsTree";

                var childNodes = new TreeNodeCollection();
                var childTreeNodes = new List<SectionTreeNode>();
                childTreeNodes.Add(new SectionTreeNode() { Id = "transactions", Title = ui.Text("analytics", "transactions"), Icon = "icon-credit-card", Route = string.Format("{0}/view/{1}", mainRoute, "transactions") });
                childTreeNodes.Add(new SectionTreeNode() { Id = "productperformance", Title = ui.Text("analytics", "productPerformance"), Icon = "icon-barcode", Route = string.Format("{0}/view/{1}", mainRoute, "productperformance") });
                childTreeNodes.Add(new SectionTreeNode() { Id = "salesperformance", Title = ui.Text("analytics", "salesPerformance"), Icon = "icon-bill", Route = string.Format("{0}/view/{1}", mainRoute, "salesperformance") });

                foreach (var c in childTreeNodes)
                {
                    var childnodeToAdd = CreateTreeNode(c.Id, null, queryStrings, c.Title, c.Icon, false, c.Route);

                    //Add it to the collection
                    childNodes.Add(childnodeToAdd);
                }
                return childNodes;
            }

            //this tree doesn't suport rendering more than 1 level
            throw new NotSupportedException();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <param name="queryStrings"></param>
        /// <returns></returns>
        protected override Umbraco.Web.Models.Trees.MenuItemCollection GetMenuForNode(string id, System.Net.Http.Formatting.FormDataCollection queryStrings)
        {
            var menu = new MenuItemCollection();
            if (id == Constants.System.Root.ToInvariantString()) 
            {
                // root actions
                menu.Items.Add<RefreshNode, ActionRefresh>(ui.Text("actions", ActionRefresh.Instance.Alias), false);
            }
            return menu;
        }
    }
}
