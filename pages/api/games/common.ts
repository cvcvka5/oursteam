/* jshint esversion: 6 */
import axios, { AxiosResponse } from "axios";
import { parseString } from "xml2js";
import { NextApiRequest, NextApiResponse } from "next";
import type ISteamGame from "../../../types/ISteamGame";
import type IError from "../../../types/IError";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ISteamGame[] | IError>
) {

    if (!req.query || !req.query.id || req.query.id.length !== 2) {
        res.status(400).send({"Error": `The query parameters should be: (id[2] = [first id, second id]) `});
        return;
    }

    let isCustomURL1 = !(/^\d+$/.test(req.query.id[0]));
    let isCustomURL2 = !(/^\d+$/.test(req.query.id[1]));
    
    const customURLTemplate = "https://steamcommunity.com/id/{0}/games?tab=all&xml=1";
    const profilesURLTemplate = "https://steamcommunity.com/profiles/{0}/games?tab=all&xml=1";
    
    const URL1 = isCustomURL1 ? customURLTemplate.replace("{0}", req.query.id[0]) : profilesURLTemplate.replace("{0}", req.query.id[0])
    const URL2 = isCustomURL2 ? customURLTemplate.replace("{0}", req.query.id[1]) : profilesURLTemplate.replace("{0}", req.query.id[1])
    
    const res1: AxiosResponse = await axios.get(URL1);
    
    parseString(res1.data, async (err, data1) => {
        let games1: ISteamGame[];
        try{
            games1 = data1.gamesList.games[0].game;
        }
        catch {
            res.status(400).send({
                Error: "The supplied ID must be a STEAM64-ID or a CUSTOM_PROFILE_ID.",
                AlternateError: "The Steam servers might be down.",
                ErrorAtIndex: 0
            });
            return;
        };
        
        
        const res2 = await axios.get(URL2);
        parseString(res2.data, (err, data2) => {
            
            let games2: ISteamGame[];
            try{
                games2 = data2.gamesList.games[0].game;
            }
            catch {
                res.status(400).send({
                    Error: "The supplied ID must be a STEAM64-ID or a CUSTOM_PROFILE_ID.",
                    AlternateError: "The Steam servers might be down.",
                    ErrorAtIndex: 1
                });
                return;
            }            
            
            const appids2 = games2.map((game: any) => game.appID[0]);
            const commongames = games1.filter((game: any) => appids2.includes(game.appID[0]));
            res.status(200).json(commongames);
        });
});

}