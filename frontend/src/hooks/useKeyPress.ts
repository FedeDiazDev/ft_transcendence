type PressedKeys = {
  [key: string]: boolean;
};

export const useKeyPress = (): PressedKeys => {
  const pressedKeys: PressedKeys = {
    ArrowUp: false,
    ArrowDown: false,
    w: false,
    s: false,
  };
  

  function handleKeyDown(event : KeyboardEvent) {
    if (event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "w" || event.key === "s") {
      event.preventDefault();
      pressedKeys[event.key] = true;
    }
  }
  
  function handleKeyUp(event : KeyboardEvent) {
    if (event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "w" || event.key === "s") {
      event.preventDefault();
      pressedKeys[event.key] = false;
    }
  }
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);

  return pressedKeys;
};