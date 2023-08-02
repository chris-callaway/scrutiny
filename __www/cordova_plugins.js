cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "com.danielcwilson.plugins.socialauth.SocialAuth",
        "file": "plugins/com.danielcwilson.plugins.socialauth/www/socialAuth.js",
        "pluginId": "com.danielcwilson.plugins.socialauth",
        "clobbers": [
            "window.socialAuth"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.3.0",
    "com.danielcwilson.plugins.socialauth": "0.1.0"
};
// BOTTOM OF METADATA
});