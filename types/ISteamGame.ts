export default interface ISteamGame {
    appID:           string[];
    name:            string[];
    logo:            string[];
    storeLink?:       string[];
    hoursLast2Weeks?: string[];
    hoursOnRecord:   string[];
    statsLink?:       string[];
    globalStatsLink: string[];
}