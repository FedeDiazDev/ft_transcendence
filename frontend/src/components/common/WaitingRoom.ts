export const WaitingRoom = () => {
    const container = document.createElement("div");
    container.className = "flex flex-col items-center justify-center h-screen bg-gray-900 text-white";

    const text = document.createElement("p");
    text.className = "text-2xl font-semibold";
    text.textContent = "Esperando a un jugador";
    
    const dots = document.createElement("span");
    dots.className = "text-2xl";

    let dotCount = 0;
    setInterval(() => {
        dotCount = (dotCount + 1) % 4;
        dots.textContent = ".".repeat(dotCount);
    }, 500);

    text.appendChild(dots);
    container.appendChild(text);


    // let socket = new WebSocket("ws://localhost:4444/online/matchmaking")

    // socket.onopen = function (e) {
    //     alert("[open] Conexión esablecida");
    //     socket.send("Usuario conectado");
    // }
    
    // socket.onmessage = function (event) {
    //     alert(`[message] Datos recibidos del servidor: ${event.data}`)
    // }
    
    // socket.onclose = function (event) {
    //     if (event.wasClean) {
    //         alert(`[close] Conexión cerrrada limpiamente, código=${event.code} motivo=${event.reason}`)
    //     } else {
    //         alert('[close] La conexión se cayó');
    //     }
    // };
    
    // socket.onerror = function (error) {
    //     alert(`[error]`);
    // };

    return container;
};
