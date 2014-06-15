var path = require("path"), basePath = path.dirname(require.main.filename);
var twitter = require("ntwitter");

var tweetiePi = function () {
   var self = this;
   this.twitter = {};

   this.init = function (options) {
      self.options = options;
      self.twitter = new twitter(self.options.twitterCredentials);

      self.twitter.stream("user", { with: "following" }, function (stream) {
         stream.on("data", function (data) {
            if (data.friends) {
               for (var i = 0, len = data.friends.length; i < len; i++) {
                  // Outputs an array of ids of users this account is following
                  console.log(data.friends[i]);
               }
            }
            else {
               for (var i = 0, len = self.options.twitterHandles.length; i < len; i++) {
                  if (data.user.name === self.options.twitterHandles[0] || self.options.twitterHandles[i] === "*") {
                     //console.log("createedAt:", data.created_at, "by:", data.user.name, "text:", data.text, "place:", data.place);
                     console.log(data);
                     var tweet = writtenToSpoken(data);

                     console.log("user:", tweet.user);
                     console.log(" action:", tweet.action);
                     console.log(" text:", tweet.text);
                     console.log(" from:", tweet.from);
                     console.log(" reply:", tweet.reply);
                     console.log("");
                  }
               }
            }
         });
         stream.on("end", function (response) {
            // Handle a disconnection
         });
         stream.on("destroy", function (response) {
            // Handle a "silent" disconnection from Twitter, no end/error event fired
         });
         // Disconnect stream after five seconds
         //setTimeout(stream.destroy, 5000);
      });
   }

   var writtenToSpoken = function(tweetObject) {
      var speek = {};

      // [username] said | retweeted | favourited [tweet text]
      var action = " said ";

      if (tweetObject.retweeted) {
         action = " retweeted ";
      }

      if (tweetObject.favorited) {
         action = " favourited ";
      }

      if (tweetObject.text.indexOf("RT" > -1)) {
         action = " retweeted ";
         tweetObject.text = tweetObject.text.replace(/RT/g, "");
      }

      // Replace certain symbols with words because the text-to-speech parser doesn't pronounce symbols properly
      tweetObject.text = tweetObject.text.replace(/@/g, " at ");
      tweetObject.text = tweetObject.text.replace(/#/g, " hash tag ");

      // Some tweets include a populated place object
      var from = "";
      if (tweetObject.place) {
         from = " from " + tweetObject.place;
      }

      from = tweetObject.location;
      //var s = tweetObject.user.name + action + tweetObject.text + from;     
      var reply = "";
      if (tweetObject.in_reply_to_screen_name) {
         reply = tweetObject.in_reply_to_screen_name;
      }
      return {
         "user": tweetObject.user.name,
         "action": action,
         "text": tweetObject.text,
         "from": from,
         "reply": reply
      }
   }

  
}

module.exports = new tweetiePi();