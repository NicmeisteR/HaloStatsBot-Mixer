var request = require("request");

export async function get(gamertag: string, query: string, token: unknown, data: any, socket: any) {
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

        if(query.toLowerCase() === "arena"){
            socket.call('msg', [`
                @${data.user_name} 
                Spartan Rank: ${body.SpartanRank}, 
                Total Kills: ${body.Stats.TotalKills},
                Total Deaths: ${body.Stats.TotalDeaths},
                Win/Loss: ${(body.Stats.TotalGamesWon / body.Stats.TotalGamesLost).toFixed(2)}
            `]);
        }
        else if(query.toLowerCase() === "ranks"){
            body.forEach((item:any) => {
                socket.call('msg', [`
                    @${data.user_name} 
                    Playlist: ${item.Name}, 
                    Total Kills: ${item.TotalKills},
                    Total Deaths: ${item.TotalDeaths},
                    Win/Loss: ${(item.TotalGamesWon / item.TotalGamesLost).toFixed(2)},
                    Designation: ${item.Designation.name}
                `]);
            });
        }
    });
}