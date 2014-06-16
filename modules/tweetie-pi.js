var path = require("path"), basePath = path.dirname(require.main.filename);
var twitter = require("ntwitter");
var serialPort = require("serialport");

var tweetiePi = function () {
   var self = this;
   this.twitter = {};

   this.speak = function (phrase) {
      if (self.speak.serialPort) {
         self.speak.serialPort.write("S" + phrase + "\n");
      }
      console.log(phrase);
   };

   this.init = function (options) {
      self.options = options;
      self.twitter = new twitter(self.options.twitterCredentials);

      // open the serial port if we can
      if (isPortAvailable(options.serialPort)) {
         self.speak.serialPort = new serialPort.SerialPort(options.serialPort, {
            baudrate: 9600
         });
      }
      else {
         console.error(options.serialPort + " was not found.");
      }

      self.twitter.stream("user", { with: "following" }, function (stream) {
         console.log("listening to the Twitter stream...");
         stream.on("data", function (data) {
            if (data.friends) {
               for (var i = 0, len = data.friends.length; i < len; i++) {
                  //console.log(data.friends[i]);
               }
            }
            else {
               // Check for filtered followers
               for (var i = 0, len = self.options.twitterHandles.length; i < len; i++) {
                  if (data.user.name === self.options.twitterHandles[0] || self.options.twitterHandles[i] === "*") {
                     console.log(data);
                     var tweet = writtenToSpoken(data);
                     self.speak(tweet.user + tweet.action + tweet.text);
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
      });
   }

   var isPortAvailable = function (port) {
      var portExists = false;
      serialPort.list(function (err, ports) {
         ports.forEach(function (port) {
            if (port.comName == port) {
               portExists = true;
            }
            console.log(port.comName);
            console.log(port.pnpId);
            console.log(port.manufacturer);
         });
      });
      return portExists;
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

      if (tweetObject.text.indexOf("RT ") > -1) {
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