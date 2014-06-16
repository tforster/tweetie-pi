var path = require("path"), basePath = path.dirname(require.main.filename)
var twitter = require("ntwitter")
var SerialPort = require("serialport").SerialPort

var tweetiePi = function () {
   var self = this
   this.twitter = {}
   var serialPort

   var speak = function (phrase) {
      serialPort.write("S" + phrase + "\n", function (err, results) {
         if (!err) {
            // Do nothing
         }
         else {
            console.error(err)
         }
      })
   }

   this.init = function (options) {
      self.options = options
      self.twitter = new twitter(self.options.twitterCredentials)

      serialPort = new SerialPort(options.serialPort, {
         baudRate: options.baudRate
      }, false)

      serialPort.open(function () {
         // Wake up the Emic 2 board
         serialPort.write("\n", function (err, results) {
            if (!err) {
               console.log("Emic 2 is awake")
               serialPort.write("N" + options.voice + "\n")                  
               speak(options.startupPhrase)
            }
            else {
               console.error(err)
            }
         })
      })

      self.twitter.stream("user", { with: "following" }, function (stream) {
         console.log("listening to Twitter stream")
         stream.on("data", function (data) {
            if (data.friends) {
               for (var i = 0, len = data.friends.length; i < len; i++) {}
            }
            else {
               // Check for filtered followers
               for (var i = 0, len = self.options.twitterHandles.length; i < len; i++) {
                  if (data.user.name === self.options.twitterHandles[0] || self.options.twitterHandles[i] === "*") {
                     var phrase = writtenToSpoken(data)
                     console.log(data.text, "\n", phrase, "\n\n")
                     speak(phrase)
                  }
               }
            }
         })

         stream.on("end", function (response) {
            // Handle a disconnection
         })

         stream.on("destroy", function (response) {
            // Handle a "silent" disconnection from Twitter, no end/error event fired
         })
      })
   }

   // Parses a tweet and transforms to a more colloquial sentence
   var writtenToSpoken = function(tweetObject) {
      var text = tweetObject.text

      var action = " said "

      if (tweetObject.retweeted) {
         action = " retweeted "
      }

      if (tweetObject.favorited) {
         action = " favourited "
      }

      if (text.indexOf("RT ") > -1) {
         action = " retweeted "
         text = text.replace(/RT/g, "")
      }

      // Replace certain symbols with words because the text-to-speech parser doesn't pronounce symbols properly
      text = text.replace(/@/g, " at ")
      text = text.replace(/#/g, " hash tag ")
      text = text.replace(/(http|ftp|https):\/\/([\w\-_]+(?:(?:\.[\w\-_]+)+))([\w\-\.,@?^=%&amp:/~\+#]*[\w\-\@?^=%&amp/~\+#])?/gi, " url ")
      
      // Some tweets include a populated place object
      var from = ""
      if (tweetObject.place) {
         from = " from " + tweetObject.place
      }

      from = tweetObject.location
      var reply = ""

      if (tweetObject.in_reply_to_screen_name) {
         reply = tweetObject.in_reply_to_screen_name
      }

      // Cleanup any extraneous whitespace
      var text = (tweetObject.user.name + action + text).replace(/\s{2,}/g, ' ').trim()

      return text
   }  
}

module.exports = new tweetiePi()