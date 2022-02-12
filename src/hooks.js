import { useState, useRef, useEffect, useCallback } from "react";
import { set, get } from "idb-keyval";


async function cachedGetData(key, getter) {
  try {
    const cached = await get(key)
    if (!cached) {
      const gotten = await getter();
      await set(key, gotten);
      return gotten;
    } else {
      return cached;
    }
  } catch (err) {
    console.error(err);
  }
}

export function usePersistedState(keyToPersistWith, defaultState) {
  const [state, setState] = useState(defaultState);

  useEffect(() => {
    get(keyToPersistWith).then(retrievedState =>
      setState(retrievedState ?? defaultState));
  }, [keyToPersistWith, setState, defaultState]);

  const setPersistedValue = useCallback((newValue) => {
    setState(newValue);
    set(keyToPersistWith, newValue);
  }, [keyToPersistWith, setState]);

  return [state, setPersistedValue];
}

export function usePersistedAPICall(key, temp, getter) {
  const [state, setState] = useState(temp);

  useEffect(() => {
    cachedGetData(key, getter).then(retrievedState =>
      setState(retrievedState));
  }, [key, setState, getter]);

  return state;
}

export function useEventListener(eventName, handler, element = window) {
  // Create a ref that stores handler
  const savedHandler = useRef();
  // Update ref.current value if handler changes.
  // This allows our effect below to always get latest handler ...
  // ... without us needing to pass it in effect deps array ...
  // ... and potentially cause effect to re-run every render.
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);
  useEffect(
    () => {
      // Make sure element supports addEventListener
      // On
      const isSupported = element && element.addEventListener;
      if (!isSupported) return;
      // Create event listener that calls handler function stored in ref
      const eventListener = (event) => savedHandler.current(event);
      // Add event listener
      element.addEventListener(eventName, eventListener);
      // Remove event listener on cleanup
      return () => {
        element.removeEventListener(eventName, eventListener);
      };
    },
    [eventName, element] // Re-run if eventName or element changes
  );
}
