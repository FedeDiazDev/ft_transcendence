export const GameCanvas = (state : any) => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 400;
    canvas.className = "border border-gray-600";

    const ctx = canvas.getContext("2d");    
    let gameState = {
        ball: { x: state.ball.x, y: state.ball.y },
        paddles: [
            { x: state.paddles.left.x, y: state.paddles.left.y },
            { x: state.paddles.right.x, y: state.paddles.right.y }
        ]
    };  
    const draw = () => {
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);       
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(gameState.ball.x, gameState.ball.y, 10, 0, Math.PI * 2);
        ctx.fill();       
        gameState.paddles.forEach(paddle => {
            ctx.fillRect(paddle.x, paddle.y, 10, 100);
        });
    };   
    const loop = () => {
        draw();
        requestAnimationFrame(loop);
    };
    loop();

    return canvas;
};
