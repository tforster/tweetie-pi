var path = require("path"), basePath = path.dirname(require.main.filename);
var nconf = require("nconf");

nconf.file({
   file: path.join(basePath, "config.json")
}).file("secure", {
   file: path.join(basePath, "config.secure.json")
}).argv();
var options = nconf.get();

require(path.join(basePath, "/modules/tweetie-pi.js")).init(options);