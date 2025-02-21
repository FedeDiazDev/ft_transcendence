export const Status = (connected: boolean) => {
    const status = document.createElement("div");
    status.className = `w-4 h-4 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`;
    return status;
};
