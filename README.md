# tweetie-pi
A simple NodeJS app that uses the Twitter Stream API and the [Emic 2 Text-to-Speech Module](http://www.parallax.com/product/30016) to read tweets out loud.
## Roadmap
The first version is mostly a proof of concept. It can/will/does read all tweets associated with the user specified in config.secure.json:twitterCredentails.
The next version will introduce a basic REST API to allow on-the-fly configuration of some Emic 2 properties including voice and volume.
## config.secure.json
This file is not included in the repo since it contains confidential oAuth keys and tokens. You will need to create your own config.secure.json and populate the fields with your data. This is a template you can edit:

    {
       "twitterCredentials": {
          "consumer_key": "",
          "consumer_secret": "",
          "access_token_key": "",
          "access_token_secret": ""
       }
    }

