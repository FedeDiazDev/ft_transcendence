import { GameState, Paddle } from "../../types/types.js";
import { movePaddle } from "../../api/game/paddleAPI.js";
import { updateBall } from "../../api/game/gameAPI.js";
import { useKeyPress } from "../../hooks/useKeyPress.js";
import { gameSocket } from "../../sockets/gameSocket.js";

export const GameCanvas = (state: GameState, mode: string, scoreElement: any) => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 400;
    canvas.className = "border border-gray-600";

    const ctx = canvas.getContext("2d");
    let gameState: GameState = { ...state };
    const draw = () => {
        if (!ctx || !gameState?.ball) return;
        // console.log(" Redibujando con ball:", gameState.ball);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";

        ctx.beginPath();
        ctx.arc(gameState.ball.x, gameState.ball.y, 10, 0, Math.PI * 2);
        ctx.fill();

        Object.values(gameState.paddles).forEach((paddle: Paddle) => {
            ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
        });
    };
    if (mode === "local") {
        //!: al cambair de vista el juego se sigue ejecutando en 2º plano
        const pressedKeys = useKeyPress();

        const updateGameState = async () => {
            if (gameState.status !== "playing") {
                console.warn(" Estado no es PLAYING:", gameState.status);
                return;
            }
            if (pressedKeys.w) moveAndUpdate("left", "up");
            if (pressedKeys.s) moveAndUpdate("left", "down");
            if (pressedKeys.ArrowUp) moveAndUpdate("right", "up");
            if (pressedKeys.ArrowDown) moveAndUpdate("right", "down");
            draw();
            try {
                const updatedState = await updateBall();
                if (updatedState && updatedState.ball) {
                    gameState = { ...gameState, ...updatedState };
                    draw();
                }
            } catch (error) {
                console.error("Error al actualizar la bola:", error);
            }
        };

        const loop = async () => {
            if (scoreElement != null) {
                scoreElement.innerHTML = `${gameState.leftPoints} - ${gameState.rightPoints}`;
            }

            if (gameState.status === "game_over") {
                console.log("GAME FINISHED:", gameState);
                if (gameState.rightPoints == 10)
                    alert("El ganador es el jugador de la derecha");
                else
                    alert("El ganador es el jugador de la izquierda");
                return;
            }
            await updateGameState();
            const path = window.location.pathname;            
            if (path.endsWith("/local_game")) {
                requestAnimationFrame(loop);
            }
            else return ;
        };

        loop();

        const updatePaddlePosition = (player: "left" | "right", direction: "up" | "down") => {
            const paddle = gameState.paddles[player];
            if (!paddle) return;
            const speed = paddle.speed ?? 10;
            const newY = direction === "up" ? paddle.y - speed : paddle.y + speed;

            gameState = {
                ...gameState,
                paddles: {
                    ...gameState.paddles,
                    [player]: { ...paddle, y: newY }
                }
            };
        };
        const moveAndUpdate = async (player: "left" | "right", direction: "up" | "down") => {
            try {
                const response = await movePaddle(player, direction);
                if (!response || response.status == 204) return;
                updatePaddlePosition(player, direction);
                draw();
            } catch (error) {
                console.error("Error al mover la pala:", error);
            }
        };
        //*ONLINE
    } else if (mode === "online") {
        const id = localStorage.getItem("id");
        console.log("State", gameState);
        const updateGameState = (newState: GameState) => {
            gameState = { ...gameState, ...newState };
            console.log("Nuevo estado del juego:", gameState);
            renderGame(gameState);
        }
        const socket = gameSocket(updateGameState, Number(id));
        document.addEventListener("keydown", (event) => {
            if (event.key === "ArrowUp" || event.key === "w") {
                console.log("PULSADO");
                socket.sendMove("up", Number(id));
            }
            else if (event.key === "ArrowDown" || event.key === "s") {
                socket.sendMove("down", Number(id));
            }
        })
        const renderGame = (state: GameState) => {
            draw();
            // scoreElement.innerHTML = `${state.leftPoints} - ${state.rightPoints}`;
            console.log("Renderizando juego con estado:", state);
        }
    }
    return canvas;
};
