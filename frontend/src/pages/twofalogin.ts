import { TwoFALoginCard } from "../components/auth/TwoFALoginCard.js"

export const TwoFALogin = () => {
    const div = document.createElement("div");
    div.className="flex flex-col items-center justify-center";

    div.appendChild(TwoFALoginCard());
    return div;
};
