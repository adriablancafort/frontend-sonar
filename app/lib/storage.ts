import AsyncStorage from '@react-native-async-storage/async-storage';

export const readFromStorage = async <T>(key: string): Promise<T | null> => {
  try {
    const value = await AsyncStorage.getItem(key);

    if (value === null) {
      return null;
    }
    
    return JSON.parse(value) as T;
  } catch (error) {
    console.error(`Error reading from storage [${key}]:`, error);
    return null;
  }
};

export const writeToStorage = async <T>(key: string, value: T): Promise<boolean> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error(`Error writing to storage [${key}]:`, error);
    return false;
  }
};