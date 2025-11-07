
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SetValue<T> = (value: T | ((prevValue: T) => T)) => void;

function useAsyncStorage<T>(key: string, initialValue: T): [T, SetValue<T>, boolean] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadStoredValue = async () => {
      try {
        const item = await AsyncStorage.getItem(key);
        if (isMounted) {
          setStoredValue(item ? JSON.parse(item) : initialValue);
        }
      } catch (error) {
        console.error(`Error reading value for key "${key}" from AsyncStorage:`, error);
        if (isMounted) {
          setStoredValue(initialValue);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadStoredValue();

    return () => {
      isMounted = false;
    };
  }, [key, initialValue]);

  const setValue: SetValue<T> = useCallback(
    async (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting value for key "${key}" in AsyncStorage:`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue, loading];
}

export default useAsyncStorage;
