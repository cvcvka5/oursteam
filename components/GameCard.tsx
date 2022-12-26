import React from "react";

import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import ISteamGame from "../types/ISteamGame";
import styles from "../styles/GameCard.module.css";

type PropsType = {
   game: ISteamGame,
   compact?: boolean
}

export default function GameCard(props: PropsType) {
    const game = props.game;

    const handleCardClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const el = ((e.target as HTMLDivElement).parentNode! as HTMLDivElement);
        window.open(el.dataset!.storeUrl, "_blank");
    };

    const store = game.storeLink ? game.storeLink[0] : undefined;

    return (
        <Card
            sx={{minHeight: props.compact ? 0 : 335, maxWidth: 308}}
            className={`${props.compact ? styles.GameCard : ""} ${styles.GameCardHover}`}
            onClick={props.compact ? e => handleCardClick(e) : () => {}}
            data-store-url={store}
        >
        <CardMedia 
          sx={{width: 308, height: 176.5}}
          image={game.logo[0].replace("184x69", "616x353")} // 616x353
          title={game.name[0]}

        />
        {
            !props.compact &&
            <div>
                <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {game.name[0]} 
                    <Typography gutterBottom variant="body2" color="text.secondary">
                    <i>
                    { game.hoursOnRecord ?
                        `${game.hoursOnRecord[0] } hours` :
                        `0 hours`
                    }
                    </i>
                    <i>
                    { (game.hoursLast2Weeks ?
                        ` | ${game.hoursLast2Weeks[0] } last two weeks.` :
                        ` | 0 last two weeks.`)
                    }
                    </i>
                    </Typography>

                </Typography>
                <Typography gutterBottom variant="body2" color="text.secondary">
                    <a href={store} rel="noreferrer" target="_blank">Store</a>
                    &nbsp;&nbsp;
                    <a href={game.statsLink ? game.statsLink[0] : undefined} rel="noreferrer" target="_blank">Stats</a>
                </Typography>
                </CardContent>
            </div>
        }
      </Card>

    );
}