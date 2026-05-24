
import { I18nManager, NativeModules } from 'react-native';
import RNRestart from 'react-native-restart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n, { AppLanguage } from '@/lib/i18n';

export function useLanguage() {
    const setLanguage = async (selectedLanguage: AppLanguage) => {
        const isRTL = selectedLanguage === 'ar';

        await AsyncStorage.setItem('appLanguage', selectedLanguage);
        await i18n.changeLanguage(selectedLanguage);

        I18nManager.forceRTL(isRTL);
        NativeModules.DevSettings.reload();
    };
    return { setLanguage };
}
