export const GameCanvas = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 400;
    canvas.className = "border border-gray-600";

    const ctx = canvas.getContext("2d");    
    let gameState = {
        ball: { x: 400, y: 200 },
        paddles: [
            { x: 20, y: 150 },
            { x: 760, y: 150 }
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
            ctx.fillRect(paddle.x, paddle.y, 10, 80);
        });
    };   
    const loop = () => {
        draw();
        requestAnimationFrame(loop);
    };
    loop();

    return canvas;
};
