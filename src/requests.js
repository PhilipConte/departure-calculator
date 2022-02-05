import { useCallback, useEffect, useState } from 'react';
import { set, get } from "idb-keyval";

export async function wmataRequest(url) {
  const response = await fetch(url, {
    headers: {
      api_key: 'e13626d03d8e4c03ac07f95541b3091b' // https://developer.wmata.com/
    }
  });
  return await response.json();
}

export async function cachedGetData(key, getter) {
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
