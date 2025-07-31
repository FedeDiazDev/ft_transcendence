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
  
  const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
    }
    
    if (pressedKeys.hasOwnProperty(event.key)) {
      pressedKeys[event.key] = true;
    }
  };

  const handleKeyUp = (event: KeyboardEvent): void => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
    }
    
    if (pressedKeys.hasOwnProperty(event.key)) {
      pressedKeys[event.key] = false;
    }
  };
 
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);

  return pressedKeys;
};