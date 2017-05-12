/*
 * message.js
 * This file contains your bot code
 */

const recastai = require('recastai')
const httpRequest = require('request')
const syncRequest = require('request-promise');

// This function is the core of the bot behaviour
const replyMessage = (message) => {
  // Instantiate Recast.AI SDK, just for request service
  const request = new recastai.request(process.env.REQUEST_TOKEN, process.env.LANGUAGE)
  // Get text from message received
  const text = message.content

  console.log('I receive: ', text)

  // Get senderId to catch unique conversation_token
  const senderId = message.senderId

  // Call Recast.AI SDK, through /converse route
  request.converseText(text, { conversationToken: senderId })
  .then(result => {
    /*
    * YOUR OWN CODE
    * Here, you can add your own process.
    * Ex: You can call any external API
    * Or: Update your mongo DB
    * etc...
    */

    if (result.action) {
      console.log('senderId : ' + senderId)
        //https://api.recast.ai/connect/v1/participants/$PARTICIPANT_ID


        console.log('The action source is: ', result.action.source)
      console.log('The conversation action is: ', result.action.slug)
        console.log('The conversation intent name is: ', result.action.name)
        var output = "toto";
        if(result.action.slug == "view-leave-balance") {
            /*httpRequest('http://192.168.1.20:8080/api/query?name=lvacc.forecast.extract&key=TOTO&fields=name,balanceIncludingAcceptedAndPendingRequests&filter=ownerUsername%3D%3Dguillaume.gaulard@zenika.com', function (error, response, body) {
                console.log('error:', error); // Print the error if one occurred
                console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                console.log('body:', body); // Print the HTML for the Google homepage.
                var alibeezResponse = JSON.parse(body);
                for (var i = 0; i < alibeezResponse.result.length; i++) {
                    var item = alibeezResponse.result[i];
                    var balanceDescription = "Ton solde de "+item.name+" est de "+item.balanceIncludingAcceptedAndPendingRequests;
                    console.log(balanceDescription);
                    output = output + "" +balanceDescription;
                    //message.addReply({ type: 'text', content: balanceDescription });
                    //message.addReply({ type: 'text', content: "TITI" });
                    console.log(output)
                }
                message.addReply({ type: 'text', content: output });
                message.reply();

            });*/


            var alibeezResponseBody = syncRequest('http://192.168.1.20:8080/api/query?name=lvacc.forecast.extract&key=TOTO&fields=name,balanceIncludingAcceptedAndPendingRequests&filter=ownerUsername%3D%3Dguillaume.gaulard@zenika.com');
            var options = {
                uri: 'http://192.168.1.20:8080/api/query?name=lvacc.forecast.extract&key=TOTO&fields=name,balanceIncludingAcceptedAndPendingRequests&filter=ownerUsername%3D%3Dguillaume.gaulard@zenika.com',
                headers: {
                    'User-Agent': 'Request-Promise'
                },
                json: false // Automatically parses the JSON string in the response
            };

            syncRequest(options)
                .then(function (result) {
                    console.log('result : '+result);
                    var alibeezResponse = JSON.parse(result);
                    for (var i = 0; i < alibeezResponse.result.length; i++) {
                        var item = alibeezResponse.result[i];
                        var balanceDescription = "Ton solde de "+item.name+" est de "+item.balanceIncludingAcceptedAndPendingRequests;
                        console.log(balanceDescription);

                        message.addReply({ type: 'text', content: balanceDescription });
                        //message.addReply({ type: 'text', content: "TITI" });
                        console.log(output)
                    }
                    // Send to client back
                    message.reply()
                        .then(() => {
                        console.log('replied');
                        // Do some code after sending messages
                    })
                        .catch(err => {
                            console.error('Error while sending message to channel', err)
                    })
                    })
                .catch(function (err) {
                    // API call failed...
                });



            /*var alibeezResponse = JSON.parse(alibeezResponseBody.body);
            for (var i = 0; i < alibeezResponse.result.length; i++) {
                var item = alibeezResponse.result[i];
                var balanceDescription = "Ton solde de "+item.name+" est de "+item.balanceIncludingAcceptedAndPendingRequests;
                console.log(balanceDescription);
                output = output + "" +balanceDescription;
                message.addReply({ type: 'text', content: balanceDescription });
                //message.addReply({ type: 'text', content: "TITI" });
                console.log(output)
            }
            message.addReply({ type: 'text', content: output });
            console.log("output : "+output)*/




        } else {
            if (!result.replies.length) {
             message.addReply({ type: 'text', content: 'Je n\'ai pas compris :)' })
             } else {
             // Add each reply received from API to replies stack
             result.replies.forEach(replyContent => message.addReply({ type: 'text', content: replyContent }))
             }
            message.reply()
                .then(() => {
                console.log('replied');
            // Do some code after sending messages
            })
            .catch(err => {
                    console.error('Error while sending message to channel', err)
            })
        }
    }

    // If there is not any message return by Recast.AI for this current conversation


    // Send all replies

  })
  .catch(err => {
    console.error('Error while sending message to Recast.AI', err)
  })
}

module.exports = replyMessage
