## 2024-05-22 - Game Loop vs UI Rendering
**Learning:** In a game-like React app with a timer loop (WPM update every second), the entire component tree re-renders on every tick. Visual components like the Scrolling Tape (mapping hundreds of DOM nodes) and Virtual Keyboard (calculating styles for 60+ keys) were re-rendering unnecessarily even when user input didn't change.
**Action:** Extract expensive visual components (`TypingTape`, `VirtualKeyboard`) and use `React.memo` to isolate them from the "Game Loop" state updates (WPM, time elapsed) that don't affect their appearance.

## 2025-02-24 - Isolating Timer Updates
**Learning:** Even with `React.memo` on child components, the parent `TypingGame` component was still re-rendering every second due to a local `wpm` state update driven by a `setInterval`. This caused unnecessary reconciliation overhead (creating new object references, re-evaluating hook dependencies) for the entire game tree.
**Action:** Extracted the WPM timer and display into a separate `<WpmDisplay />` component. This isolates the "every second" state update to a small leaf component, preventing the heavy parent and its other children from re-rendering unless the user actually types.
