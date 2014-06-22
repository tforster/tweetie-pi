# tweetie-pi

Is a simple NodeJS app that uses the Twitter Stream API and the [Emic 2 Text-to-Speech Module](http://www.parallax.com/product/30016) to read tweets out loud.

This first version is mostly a proof of concept. It can/will/does read all tweets associated with the user specified in config.secure.json:twitterCredentails. The first version also includes a few basic transformations of the original tweet to sound more colloquial:

- Uses user name and not @handle, followed by "said"
- Both native retweets and old school "RT"s are transformed to "retweeted"
- Favourites are transformed to "favourited"
- @ characters are transformed to "at"
- # characters are transformed to "hash tag"
- URLs are ignored

The next version will introduce a basic REST API to allow on-the-fly configuration of some Emic 2 properties including voice and volume.

# config.secure.json

This file is not included in the repo since it contains confidential oAuth keys and tokens. You will need to create your own config.secure.json and populate the fields with your data. This is a template you can edit:

    {
       "twitterCredentials": {
          "consumer_key": "",
          "consumer_secret": "",
          "access_token_key": "",
          "access_token_secret": ""
       }
    }

# Parts

- Raspberry Pi Model B (A will probably work)
- SD Card with latest Rasbian, Node, Git, etc
- [Emic 2 Text-to-Speech Module](http://www.adafruit.com/products/924)
- [Stereo 2.8W Class D amp](http://www.adafruit.com/products/1712)
- Speaker or headphones
- Breakout board and jumpers

# Wiring Connections

- Pi 5V and Gnd to breakout board rails
- Amp VDD and Gnd to breakout board rails
- Emic 5V and Gnd to breakout board rails
- Emic SOUT to Pi GPIO Rx
- Emic SIN to Pi GPIO Tx
- Emic SP- to Amp R-
- Emic SP+ to Amp R+
- Amp right speaker out to speaker (ignore if you're just using headphones)
