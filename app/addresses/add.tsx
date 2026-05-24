import { BorderRadius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useCreateAddress, useUpdateAddress } from '@/hooks/react-query-hooks/use-addresses';
import { usePlatformAddressFields, usePlatformStore } from '@/stores/platform-store';
import type { AddressFieldTemplate, StoreAddressPayload } from '@/services/addresses/types';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    I18nManager,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddAddressScreen() {
    const { colors, font } = useAppTheme();
    const { t, i18n } = useTranslation('addresses');
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id?: string }>();

    const fields = usePlatformAddressFields();
    const addresses = usePlatformStore((s) => s.addresses);

    const editing = useMemo(
        () => (id ? addresses.find((a) => String(a.id) === String(id)) ?? null : null),
        [id, addresses],
    );

    const createAddress = useCreateAddress();
    const updateAddress = useUpdateAddress();

    const [name, setName] = useState(editing?.name ?? '');
    const [values, setValues] = useState<Record<string, string>>(() => {
        const initial: Record<string, string> = {};
        editing?.fields.forEach((f) => {
            initial[f.key] = f.value;
        });
        return initial;
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const lang = i18n.language;

    const getLabel = (template: AddressFieldTemplate) =>
        template.label[lang] ?? template.label.en ?? template.label.ar ?? template.key;

    const handleChange = (key: string, value: string) => {
        setValues((prev) => ({ ...prev, [key]: value }));
        if (errors[key]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[key];
                return next;
            });
        }
    };

    const validate = () => {
        const next: Record<string, string> = {};
        if (!name.trim()) next.__name = t('address_name') + ' *';
        fields.forEach((f) => {
            if (f.is_required && !(values[f.key] ?? '').trim()) {
                next[f.key] = getLabel(f) + ' *';
            }
        });
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        const payloadFields: Record<string, string> = {};
        fields.forEach((f) => {
            const v = (values[f.key] ?? '').trim();
            if (v) payloadFields[f.key] = v;
        });

        const payload: StoreAddressPayload = {
            name: name.trim(),
            fields: payloadFields,
        };

        if (editing) {
            updateAddress.mutate(
                { id: editing.id, payload },
                { onSuccess: () => router.back() },
            );
        } else {
            createAddress.mutate(payload, { onSuccess: () => router.back() });
        }
    };

    const submitting = createAddress.isPending || updateAddress.isPending;

    return (
        <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Pressable
                    onPress={() => router.back()}
                    hitSlop={8}
                    style={[styles.backButton, { borderColor: colors.border }]}
                >
                    <Ionicons
                        name={I18nManager.isRTL ? 'arrow-forward' : 'arrow-back'}
                        size={20}
                        color={colors.foreground}
                    />
                </Pressable>
                <Text style={[styles.headerTitle, { color: colors.foreground, fontFamily: font.bold }]}>
                    {editing ? t('edit_address') : t('add_address')}
                </Text>
                <View style={styles.backButton} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.flex}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <FieldInput
                        label={t('address_name')}
                        placeholder={t('address_name_placeholder')}
                        value={name}
                        onChangeText={(v) => {
                            setName(v);
                            if (errors.__name) {
                                setErrors((prev) => {
                                    const next = { ...prev };
                                    delete next.__name;
                                    return next;
                                });
                            }
                        }}
                        error={errors.__name}
                        colors={colors}
                        font={font}
                    />

                    {fields.map((template) => (
                        <FieldInput
                            key={template.key}
                            label={getLabel(template) + (template.is_required ? ' *' : '')}
                            placeholder={getLabel(template)}
                            value={values[template.key] ?? ''}
                            onChangeText={(v) => handleChange(template.key, v)}
                            error={errors[template.key]}
                            colors={colors}
                            font={font}
                        />
                    ))}
                </ScrollView>

                <View style={[styles.footer, { borderTopColor: colors.border }]}>
                    <Pressable
                        onPress={handleSubmit}
                        disabled={submitting}
                        style={[
                            styles.submitButton,
                            { backgroundColor: colors.primary, opacity: submitting ? 0.6 : 1 },
                        ]}
                    >
                        {submitting ? (
                            <ActivityIndicator color={colors.primaryForeground} />
                        ) : (
                            <Text
                                style={[
                                    styles.submitText,
                                    { color: colors.primaryForeground, fontFamily: font.bold },
                                ]}
                            >
                                {editing ? t('update') : t('save')}
                            </Text>
                        )}
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

interface FieldInputProps {
    label: string;
    placeholder: string;
    value: string;
    onChangeText: (value: string) => void;
    error?: string;
    colors: ReturnType<typeof useAppTheme>['colors'];
    font: ReturnType<typeof useAppTheme>['font'];
}

function FieldInput({ label, placeholder, value, onChangeText, error, colors, font }: FieldInputProps) {
    return (
        <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.secondaryForeground, fontFamily: font.semiBold }]}>
                {label}
            </Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.placeholder}
                style={[
                    styles.input,
                    {
                        borderColor: error ? colors.destructive : colors.border,
                        backgroundColor: error ? colors.surfaceError : colors.muted,
                        color: colors.foreground,
                        fontFamily: font.regular,
                    },
                ]}
            />
            {error ? (
                <Text style={[styles.errorText, { color: colors.destructive, fontFamily: font.regular }]}>
                    {error}
                </Text>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1 },
    flex: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.gutter,
        paddingVertical: Spacing.tight,
    },
    backButton: {
        width: 38,
        height: 38,
        borderRadius: BorderRadius.full,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: { fontSize: 18 },
    scrollContent: {
        paddingHorizontal: Spacing.gutter,
        paddingTop: Spacing.sm,
        paddingBottom: Spacing.lg,
    },
    fieldGroup: { marginBottom: Spacing.md },
    fieldLabel: {
        fontSize: 14,
        marginBottom: Spacing.sm,
    },
    input: {
        borderWidth: 1.5,
        borderRadius: BorderRadius.xl,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.tight,
        minHeight: 50,
        fontSize: 16,
        textAlign: 'auto',
    },
    errorText: {
        fontSize: 12,
        marginTop: Spacing.xs,
        marginStart: 2,
    },
    footer: {
        paddingHorizontal: Spacing.gutter,
        paddingVertical: Spacing.tight,
        borderTopWidth: 1,
    },
    submitButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.tight + 2,
        borderRadius: BorderRadius.xl,
        minHeight: 50,
    },
    submitText: { fontSize: 16 },
});
