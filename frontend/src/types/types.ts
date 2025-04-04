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
