export const Status = (connected: boolean) => {
    const status = document.createElement("div");
    status.className = `w-3 h-3 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`;
    return status;
};
