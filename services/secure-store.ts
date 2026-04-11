import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'sonic_auth_token';
const LANGUAGE_KEY = 'sonic_app_language';

let memoryToken: string | null = null;
let memoryLanguage: string | null = null;

async function isSecureStoreAvailable(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  try {
    return await SecureStore.isAvailableAsync();
  } catch {
    return false;
  }
}

export async function getToken(): Promise<string | null> {
  try {
    if (await isSecureStoreAvailable()) {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    }
    return memoryToken;
  } catch {
    return memoryToken;
  }
}

export async function setToken(token: string): Promise<void> {
  memoryToken = token;
  try {
    if (await isSecureStoreAvailable()) {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    }
  } catch {
    // Falls back to in-memory storage silently
  }
}

export async function removeToken(): Promise<void> {
  memoryToken = null;
  try {
    if (await isSecureStoreAvailable()) {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
  } catch {
    // Already cleared in-memory
  }
}

export async function getLanguage(): Promise<string | null> {
  try {
    if (await isSecureStoreAvailable()) {
      return await SecureStore.getItemAsync(LANGUAGE_KEY);
    }
    return memoryLanguage;
  } catch {
    return memoryLanguage;
  }
}

export async function setLanguage(language: string): Promise<void> {
  memoryLanguage = language;
  try {
    if (await isSecureStoreAvailable()) {
      await SecureStore.setItemAsync(LANGUAGE_KEY, language);
    }
  } catch {
    // Falls back to in-memory storage silently
  }
}

export async function removeLanguage(): Promise<void> {
  memoryLanguage = null;
  try {
    if (await isSecureStoreAvailable()) {
      await SecureStore.deleteItemAsync(LANGUAGE_KEY);
    }
  } catch {
    // Already cleared in-memory
  }
}
