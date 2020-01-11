"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// Imports
var helpers_1 = require("./functions/helpers");
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
    var _this = this;
    // Chat connection
    var socket = new Mixer.Socket(ws, endpoints).boot();
    // Greet a joined user
    socket.on('UserJoin', function (data) {
        socket.call('msg', ["Hi " + data.username + "! I'm HaloStatsBot! Write !stats and I will send back Halo 5 stats!"]);
    });
    // React to our !pong command
    socket.on('ChatMessage', function (data) { return __awaiter(_this, void 0, void 0, function () {
        var message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!data.message.message[0].data.toLowerCase().startsWith('!stats')) return [3 /*break*/, 2];
                    return [4 /*yield*/, helpers_1.get("May Hamn", "Ranks", process.env.TOKEN)];
                case 1:
                    message = _a.sent();
                    console.log(message);
                    socket.call('msg', ["@" + data.user_name + " " + JSON.stringify(message)]);
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); });
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
