/* Imports */
// Module Imports
import { 
  TextField, Grid, Stack, Divider, Chip,
  Autocomplete, ToggleButton, getFormControlLabelUtilityClasses
} from "@mui/material";
import { ViewCompact } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import React, { useState, useEffect } from "react";

// Next Imports
import Image from "next/image";
import Head from "next/head";

// Type Imports
import type ISteamGame from "../types/ISteamGame";
import type ISortBy from "../types/ISortBy";

// Component Imports
import GameCard from "../components/GameCard";
import ourSteamLogo from "../public/oursteam.png";
import IError from "../types/IError";
/*---*/

export default function App() {

  // IDS
  const [yourID, setYourID] = useState<string>();
  const [friendID, setFriendID] = useState<string>();
  
  // Fetching states.
  const [games, setGames] = useState<ISteamGame[]>([]);
  const [gotError, setGotError] = useState<IError>(null!);
  const [fetching, setFetching] = useState<boolean>(false);
  
  // Const option states.
  const [compact, setCompact] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);

  function handleFindCommon() {
    setFetching(true);
    fetch(`/api/games/common?id=${yourID}&id=${friendID}`)
      .then(res => res.json())
      .then((data: ISteamGame[] | IError) => {
        if (Object.keys(data).includes("Error")) {
          setGotError(data as IError);
          setGames([]);
        }
        else {
          setGames(data as ISteamGame[]);
          setGotError(null!)
        }
        setFetching(false);
      })
  }

  function handleSortAlgo(e: React.SyntheticEvent<Element, Event>) {
    const el = e.target as HTMLLIElement;
    const option = el.textContent as ISortBy;
    
    if (!option) return;

    let sortedGames: ISteamGame[] = [];
    switch(option) {
      case "Alphabet (A-Z)":
        sortedGames = games.sort((a: ISteamGame, b: ISteamGame) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0
        })
        break;
      case "Playtime (Total)":
        sortedGames = games.sort((a: ISteamGame, b: ISteamGame) => {
          const [ah, bh] = [a.hoursOnRecord ? parseFloat(a.hoursOnRecord[0].replace(",", "")) : 0, b.hoursOnRecord ? parseFloat(b.hoursOnRecord[0].replace(",", "")) : 0];
          if (ah > bh) return -1;
          if (ah < bh) return 1;
          return 0
        })
        break;
        case "Playtime (Two weeks)":
          sortedGames = games.sort((a: ISteamGame, b: ISteamGame) => {
            const [ah, bh] = [a.hoursLast2Weeks ? parseFloat(a.hoursLast2Weeks[0].replace(",", "")) : 0, b.hoursLast2Weeks ? parseFloat(b.hoursLast2Weeks[0].replace(",", "")) : 0];
            if (ah > bh) return -1;
            if (ah < bh) return 1;
            return 0
          })
          break;
    }
    setGames(sortedGames)
    setRefresh(r=>!r)
  }

  return (
    <>
      <Head>
        <title>OurSteam - Compare libraries!</title>

        <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png"/>
        <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png"/>
        <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png"/>
        <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png"/>
        <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png"/>
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png"/>
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png"/>
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png"/>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png"/>
        <link rel="icon" type="image/png" sizes="192x192"  href="/android-icon-192x192.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        <link rel="manifest" href="/manifest.json"/>
        <meta name="msapplication-TileColor" content="#ffffff"/>
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png"/>
        <meta name="theme-color" content="#ffffff"/>

        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="title" content="OurSteam" />
        <meta name="description" content="Find common games to play with your friends." />
        <meta name="keywords" content="steam,our,oursteam,common,steam games, common games,co-op games,games,multiplayer games,friend games,play together,find games,steam libraries,compare games, play with your friend,steam multiplayer, steam co-op,steam play together,connect games,connect" />
        <meta name="robots" content="index, follow" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
        <meta name="author" content="cvcvka5" />
      </Head>
      <Stack
        alignItems="center"
        spacing={2}
        style={{margin: "2em"}}
      >
        <Image src={ourSteamLogo} alt="OurSteam" priority/>
        <TextField
          required
          id="steamid1"
          label="Your SteamID"
          sx={{width: 300}}
          value={yourID}
          onChange={e => setYourID(e.target.value)}
          helperText={gotError && gotError.ErrorAtIndex === 0 ? gotError.Error : ""}
          error={gotError ? gotError.ErrorAtIndex === 0 : false}
        />
        <TextField
          required
          id="steamid1"
          label="Friend SteamID"
          sx={{width: 300}}
          value={friendID}
          onChange={e => setFriendID(e.target.value)}
          helperText={gotError && gotError.ErrorAtIndex === 1 ? gotError.Error : ""}
          error={gotError ? gotError.ErrorAtIndex === 1 : false}
        />
        <LoadingButton
          loading={fetching}
          variant="contained" size="large"
          onClick={handleFindCommon}
        >
          Find Common
        </LoadingButton>
      </Stack>

      {
        (games.length > 0) &&
        <div>
          <Divider style={{marginBottom: "2em"}}>
            <Chip label="Games"/>
          </Divider>
          <Grid 
            sx={{marginBottom: "2em"}}
            container
            spacing={0}
            direction="row"
            alignItems="center"
            justifyContent="center"
            gap={2}
          >
            <ToggleButton
              value="compact"
              selected={compact}
              color="primary"
              onChange={() => setCompact(comp => !comp)}
            >
              <ViewCompact/>
            </ToggleButton>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={["Alphabet (A-Z)", "Playtime (Total)", "Playtime (Two weeks)"]}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Sort by" />}
              onChange={e => handleSortAlgo(e)}
            />
          </Grid>
        </div>
      }
      

      <Grid
        container
        alignItems="center"
        justifyContent="center"
        spacing={2}
        gap={2}
        columns={3}
      >
        {

          games.map((game: ISteamGame, i: number) => {
            return (
            <Grid item key={i}>
              <GameCard compact={compact} game={game}/>
            </Grid>
            );
          })
        }
      </Grid>
    </>
  )
}