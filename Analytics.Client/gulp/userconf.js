/**
 *  This file contains user specific configuration settings
 */

/**
 *  These are the paths of destinations to copy deploy to
 *  Sites is an array of objects:
 *  { name: 'displayname', folder: 'c:/path/to/siteroot', checked: false, clean: false }
 *
 *  Parameters:
 *  'name': name shown in list (don't use fancy characters - haven't tested that ..so.. just don't)
 *  'folder': path to the site (no trailing slash and please use forward slashes - backslash needs to be escaped)
 *  'clean': (optional bool) clean the App_Plugins folder when starting the task.
 *  'checked': (optional bool) selected by default
 */

/**
 *  IMPORTANT NOTE!
 *  If you change this file to fit your local setup, please make sure not to commit the changes.
 *  You can flag this file as being "unwatched" in your local git repository by using:
 *
 *  git update-index --assume-unchanged Analytics.Client/gulp/userconf.js
 *
 *  This will ensure any changes to this file will always be ignored when you commit.
 */
exports.sites = [
    { name: 'Test Site V8', folder: 'C:/Code-Personal/analytics.testsite', checked: true, clean: true }
]