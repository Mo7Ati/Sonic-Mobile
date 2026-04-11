import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { I18nManager, Platform } from 'react-native';
import { getLocales } from 'expo-localization';
import { reloadAppAsync } from 'expo';
import i18n from '@/lib/i18n';
import { getLanguage, setLanguage } from '@/services/secure-store';

interface LanguageState {
  language: string;
  isRTL: boolean;
  isLoading: boolean;
}

type LanguageAction =
  | { type: 'RESTORE_LANGUAGE'; language: string; isRTL: boolean }
  | { type: 'RESTORE_FAILED' }
  | { type: 'SET_LANGUAGE'; language: string; isRTL: boolean };

function languageReducer(state: LanguageState, action: LanguageAction): LanguageState {
  switch (action.type) {
    case 'RESTORE_LANGUAGE':
      return {
        language: action.language,
        isRTL: action.isRTL,
        isLoading: false,
      };
    case 'RESTORE_FAILED':
      return {
        language: 'en',
        isRTL: false,
        isLoading: false,
      };
    case 'SET_LANGUAGE':
      return {
        language: action.language,
        isRTL: action.isRTL,
        isLoading: false,
      };
  }
}

interface LanguageContextValue extends LanguageState {
  changeLanguage: (lang: string) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const initialState: LanguageState = {
  language: 'en',
  isRTL: false,
  isLoading: true,
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(languageReducer, initialState);

  useEffect(() => {
    async function restoreLanguage() {
      try {
        let lang = await getLanguage();
        if (!lang) {
          const deviceLang = getLocales()[0]?.languageCode;
          lang = deviceLang === 'ar' ? 'ar' : 'en';
        }

        const isRTL = lang === 'ar';
        await i18n.changeLanguage(lang);
        I18nManager.allowRTL(isRTL);
        I18nManager.forceRTL(isRTL);
        dispatch({ type: 'RESTORE_LANGUAGE', language: lang, isRTL });
      } catch {
        dispatch({ type: 'RESTORE_FAILED' });
      }
    }
    restoreLanguage();
  }, []);

  const changeLanguage = useCallback(async (lang: string) => {
    await i18n.changeLanguage(lang);
    await setLanguage(lang);

    const newIsRTL = lang === 'ar';
    const rtlChanged = newIsRTL !== I18nManager.isRTL;

    if (rtlChanged && Platform.OS !== 'web') {
      I18nManager.allowRTL(newIsRTL);
      I18nManager.forceRTL(newIsRTL);
      await reloadAppAsync();
      return;
    }

    dispatch({ type: 'SET_LANGUAGE', language: lang, isRTL: newIsRTL });
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      ...state,
      changeLanguage,
    }),
    [state, changeLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
