## 2024-05-22 - Game Loop vs UI Rendering
**Learning:** In a game-like React app with a timer loop (WPM update every second), the entire component tree re-renders on every tick. Visual components like the Scrolling Tape (mapping hundreds of DOM nodes) and Virtual Keyboard (calculating styles for 60+ keys) were re-rendering unnecessarily even when user input didn't change.
**Action:** Extract expensive visual components (`TypingTape`, `VirtualKeyboard`) and use `React.memo` to isolate them from the "Game Loop" state updates (WPM, time elapsed) that don't affect their appearance.
