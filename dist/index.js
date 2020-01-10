"use strict";
// Imports
var Mixer = require('@mixer/client-node');
var ws = require('ws');
require('dotenv').config({ path: require('find-config')('.env') });
var userInfo;
var client = new Mixer.Client(new Mixer.DefaultRequestRunner());
// With OAuth we don't need to log in. The OAuth Provider will attach
// the required information to all of our requests after this call.
client.use(new Mixer.OAuthProvider(client, {
    tokens: {
        access: process.env.ACCESS,
        expires: Date.now() + (365 * 24 * 60 * 60 * 1000)
    },
}));
// Gets the user that the Access Token we provided above belongs to.
client.request('GET', 'users/current')
    .then(function (response) {
    userInfo = response.body;
    return new Mixer.ChatService(client).join(2655274); // response.body.channel.id or 2655274 = NicmeisteR
})
    .then(function (response) {
    var body = response.body;
    return createChatSocket(userInfo.id, 2655274, body.endpoints, body.authkey); // response.body.channel.id or 2655274 = NicmeisteR
})
    .catch(function (error) {
    console.error('Something went wrong.');
    console.error(error);
});
/**
* Creates a Mixer chat socket and sets up listeners to various chat events.
* @param {number} userId The user to authenticate as
* @param {number} channelId The channel id to join
* @param {string[]} endpoints An array of endpoints to connect to
* @param {string} authkey An authentication key to connect with
* @returns {Promise.<>}
*/
function createChatSocket(userId, channelId, endpoints, authkey) {
    // Chat connection
    var socket = new Mixer.Socket(ws, endpoints).boot();
    // Greet a joined user
    socket.on('UserJoin', function (data) {
        socket.call('msg', ["Hi " + data.username + "! I'm HaloStatsBot! Write !stats and I will send back Halo 5 stats!"]);
    });
    // React to our !pong command
    socket.on('ChatMessage', function (data) {
        if (data.message.message[0].data.toLowerCase().startsWith('!stats')) {
            socket.call('msg', ["@" + data.user_name + " STATS HERE!"]);
        }
    });
    // Handle errors
    socket.on('error', function (error) {
        console.error('Socket error');
        console.error(error);
    });
    return socket.auth(channelId, userId, authkey)
        .then(function () {
        console.log('Login successful');
        return socket.call('msg', ['Hi! I\'m HaloStatsBot! Write !stats and I will send back Halo 5 stats!']);
    });
}
