import { QRCard } from "../components/auth/QRCard.js"

export const QRCode = () => {
    const div = document.createElement("div");
    div.className="flex flex-col items-center justify-center";

    div.appendChild(QRCard());
    return div;
};
