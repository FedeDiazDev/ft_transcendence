export interface Paddle {
    player: "left" | "right";
    playerId: number;
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
}

export interface Ball {
    x: number;
    y: number;
}

export interface GameState {
    roomId ?: string;
    status: string;
    ball: Ball;
    paddles: {
        left: Paddle;
        right: Paddle;
    };
    points: number;
    leftPoints: number;
    rightPoints: number;
}

export interface FriendI{
    name : string,
    userId : number
}

export interface UserI{
    username : string,
    id : number,
    avatar_blob : { data: Uint8Array }   ,
    presentacion : string
}

export interface PlayerStats {
    username: string;
    elo: number;
}
  
export interface GameStats {
    winner_username: string;
    looser_username: string;
    looser_points: number;
    game_date: string;
}