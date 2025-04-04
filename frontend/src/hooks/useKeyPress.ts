type KeyMap = {
    [key: string]: () => void;
};

export const useKeyPress = (keyMap: KeyMap): (() => void) => {
    const handleKeyDown = (event: KeyboardEvent): void => {
        const action = keyMap[event.key];
        if (action) {
            action(); 
        }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
        document.removeEventListener("keydown", handleKeyDown);
    };
};
