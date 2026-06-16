import { BorderRadius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useLanguage } from '@/hooks/use-language';
import i18n, { type AppLanguage } from '@/lib/i18n';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { I18nManager, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface LanguageSelectorProps {
    visible: boolean;
    onClose: () => void;
}

/** Each language is shown in its own native script. */
const OPTIONS: { value: AppLanguage; nativeLabel: string }[] = [
    { value: 'ar', nativeLabel: 'العربية' },
    { value: 'en', nativeLabel: 'English' },
];

export function LanguageSelector({ visible, onClose }: LanguageSelectorProps) {
    const { colors, font } = useAppTheme();
    const { t } = useTranslation('settings');
    const { setLanguage } = useLanguage();
    const insets = useSafeAreaInsets();

    const handleSelect = (next: AppLanguage) => {
        if (next === i18n.language) {
            onClose();
            return;
        }
        // Persists, switches RTL and reloads the app.
        setLanguage(next);
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable
                    style={[
                        styles.sheet,
                        { backgroundColor: colors.background, paddingBottom: insets.bottom + Spacing.sm },
                    ]}
                    onPress={(e) => e.stopPropagation()}
                >
                    {/* Handle */}
                    <View style={styles.handleRow}>
                        <View style={[styles.handle, { backgroundColor: colors.border }]} />
                    </View>

                    {/* Header */}
                    <View style={styles.headerRow}>
                        <View style={styles.headerText}>
                            <Text style={[styles.sheetTitle, { color: colors.foreground, fontFamily: font.bold }]}>
                                {t('language.title')}
                            </Text>
                            <Text style={[styles.sheetSubtitle, { color: colors.mutedForeground, fontFamily: font.regular }]}>
                                {t('language.description')}
                            </Text>
                        </View>
                        <Pressable
                            onPress={onClose}
                            hitSlop={8}
                            style={[styles.closeButton, { backgroundColor: colors.muted }]}
                        >
                            <Ionicons name="close" size={20} color={colors.foreground} />
                        </Pressable>
                    </View>

                    {/* Options */}
                    <View style={styles.options}>
                        {OPTIONS.map((option) => {
                            const isSelected = option.value === i18n.language;
                            return (
                                <Pressable
                                    key={option.value}
                                    onPress={() => handleSelect(option.value)}
                                    style={[
                                        styles.option,
                                        isSelected && {
                                            backgroundColor: colors.accent,
                                            borderColor: colors.primary,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.optionLabel,
                                            {
                                                color: colors.foreground,
                                                fontFamily: isSelected ? font.bold : font.regular
                                            },
                                        ]}
                                    >
                                        {option.nativeLabel}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    sheet: {
        borderTopLeftRadius: BorderRadius['2xl'],
        borderTopRightRadius: BorderRadius['2xl'],
    },
    handleRow: {
        alignItems: 'center',
        paddingTop: Spacing.sm,
        paddingBottom: Spacing.xs,
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: BorderRadius.full,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.gutter,
        paddingTop: Spacing.sm,
        paddingBottom: Spacing.tight,
        gap: Spacing.sm,
    },
    headerText: { flex: 1 },
    sheetTitle: {
        fontSize: 22,
        marginBottom: 4,
    },
    sheetSubtitle: {
        fontSize: 13,
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: BorderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    options: {
        paddingHorizontal: Spacing.gutter,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: BorderRadius.xl,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.tight + 2,
        // Reserve the rail on the leading edge (right in RTL, left in LTR) so
        // selecting a row doesn't shift its content. Colored only when selected.
        borderColor: 'transparent',
        ...(I18nManager.isRTL ? { borderRightWidth: 3 } : { borderLeftWidth: 3 }),
    },
    optionLabel: {
        fontSize: 16,
    },
});
