var request = require("request");

export async function get(gamertag: string, query: string, token: unknown) {
    var options = {
        method: 'POST',
        url: 'https://haloapi.nicmeister.cloud/',
        headers: { 'content-type': 'application/json' },
        body: {
            gamertag: gamertag,
            token: token,
            query: query
        },
        json: true
    };

    request(options, function (error: any, response: any, body: any) {
        if (error) throw new Error(error);
        return new Promise<any>((resolve, reject) => {
            return resolve(body);
        });
    });
}