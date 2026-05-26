import { BorderRadius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useCreateAddress, useDeleteAddress, useUpdateAddress } from '@/hooks/react-query-hooks/use-addresses';
import { useAddressesStore } from '@/stores/addresses-store';
import { useAddressFieldTemplates } from '@/stores/platform-config-store';
import { useAppPrefsStore } from '@/stores/app-prefs-store';
import type { Address, AddressFieldTemplate, StoreAddressPayload } from '@/services/addresses/types';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    Alert,
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
    const { id, selectOnCreate, next } = useLocalSearchParams<{ id?: string; selectOnCreate?: string; next?: string }>();
    const shouldSelectOnCreate = selectOnCreate === '1';

    // When invoked with a `next` param (e.g. from onboarding), leaving this
    // screen should replace into that route rather than popping back to a
    // screen the user shouldn't see again.
    const leave = () => {
        if (next) router.replace(next as any);
        else router.back();
    };

    // Address field templates
    const fields = useAddressFieldTemplates();

    // Addresses
    const { addresses, addAddress, updateAddress, removeAddress } = useAddressesStore();
    
    // Last selected address
    const { lastSelectedAddress, setLastSelectedAddress } = useAppPrefsStore();

    const editing = useMemo(
        () => (id ? addresses.find((a) => String(a.id) === String(id)) ?? null : null),
        [id, addresses],
    );

    const createAddressMutation = useCreateAddress();
    const updateAddressMutation = useUpdateAddress();
    const deleteAddressMutation = useDeleteAddress();

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
        if (!name.trim()) next.__name = t('address_name');
        fields.forEach((f) => {
            if (f.is_required && !(values[f.key] ?? '').trim()) {
                next[f.key] = getLabel(f);
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
            updateAddressMutation.mutate(
                { id: editing.id, payload },
                {
                    onSuccess: (address: Address) => {
                        updateAddress(address);
                        if (lastSelectedAddress?.id === address.id) {
                            setLastSelectedAddress(address);
                        }
                        leave();
                    }
                },
            );
        } else {
            createAddressMutation.mutate(payload, {
                onSuccess: (address: Address) => {
                    addAddress(address);
                    if (!lastSelectedAddress || shouldSelectOnCreate) {
                        setLastSelectedAddress(address);
                    }
                    leave();
                },
            });
        }
    };

    const handleDelete = () => {
        if (!editing) return;
        Alert.alert(
            t('delete_confirm_title'),
            t('delete_confirm_message'),
            [
                { text: t('cancel'), style: 'cancel' },
                {
                    text: t('delete'),
                    style: 'destructive',
                    onPress: () => {
                        deleteAddressMutation.mutate(editing.id, {
                            onSuccess: () => {
                                removeAddress(editing.id);
                                router.back();
                            },
                        });
                    },
                },
            ],
        );
    };

    const submitting = createAddressMutation.isPending || updateAddressMutation.isPending;
    const deleting = deleteAddressMutation.isPending;

    return (
        <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={leave} hitSlop={10} style={styles.headerSide}>
                    <Ionicons
                        name={I18nManager.isRTL ? 'chevron-forward' : 'chevron-back'}
                        size={26}
                        color={colors.foreground}
                    />
                </Pressable>
                <Text style={[styles.headerTitle, { color: colors.foreground, fontFamily: font.bold }]}>
                    {editing ? t('edit_address') : t('add_new_address')}
                </Text>
                <Pressable
                    onPress={handleSubmit}
                    disabled={submitting}
                    hitSlop={10}
                    style={[styles.headerSide, styles.headerSideEnd]}
                >
                    {submitting ? (
                        <ActivityIndicator color={colors.primary} />
                    ) : (
                        <Text style={[styles.saveText, { color: colors.primary, fontFamily: font.semiBold }]}>
                            {t('save')}
                        </Text>
                    )}
                </Pressable>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.flex}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Address name */}
                    <FieldInput
                        label={`${t('address_name')} (${t('address_name_hint')})`}
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
                        error={!!errors.__name}
                        colors={colors}
                        font={font}
                    />

                    {/* Dynamic platform fields */}
                    {fields.map((template) => {
                        const label = getLabel(template);
                        const displayLabel = template.is_required
                            ? label
                            : `${label} (${t('optional')})`;
                        return (
                            <FieldInput
                                key={template.key}
                                label={displayLabel}
                                value={values[template.key] ?? ''}
                                onChangeText={(v) => handleChange(template.key, v)}
                                error={!!errors[template.key]}
                                colors={colors}
                                font={font}
                            />
                        );
                    })}

                    {/* Delete (edit mode only) */}
                    {editing && (
                        <Pressable
                            onPress={handleDelete}
                            disabled={deleting}
                            style={[
                                styles.deleteButton,
                                { backgroundColor: colors.surfaceError, opacity: deleting ? 0.6 : 1 },
                            ]}
                        >
                            {deleting ? (
                                <ActivityIndicator color={colors.destructive} />
                            ) : (
                                <>
                                    <Ionicons name="trash-outline" size={18} color={colors.destructive} />
                                    <Text
                                        style={[
                                            styles.deleteText,
                                            { color: colors.destructive, fontFamily: font.semiBold },
                                        ]}
                                    >
                                        {t('delete_address')}
                                    </Text>
                                </>
                            )}
                        </Pressable>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

interface FieldInputProps {
    label: string;
    value: string;
    onChangeText: (value: string) => void;
    error?: boolean;
    colors: ReturnType<typeof useAppTheme>['colors'];
    font: ReturnType<typeof useAppTheme>['font'];
}

function FieldInput({ label, value, onChangeText, error, colors, font }: FieldInputProps) {
    return (
        <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.mutedForeground, fontFamily: font.regular }]}>
                {label}
            </Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholderTextColor={colors.placeholder}
                style={[
                    styles.input,
                    {
                        borderColor: error ? colors.destructive : colors.border,
                        backgroundColor: colors.background,
                        color: colors.foreground,
                        fontFamily: font.medium,
                    },
                ]}
            />
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
        paddingHorizontal: Spacing.tight,
        paddingVertical: Spacing.tight,
    },
    headerSide: {
        minWidth: 60,
        height: 32,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    headerSideEnd: {
        alignItems: 'flex-end',
    },
    headerTitle: {
        fontSize: 17,
        textAlign: 'center',
        flex: 1,
    },
    saveText: { fontSize: 16 },
    scrollContent: {
        paddingHorizontal: Spacing.gutter,
        paddingTop: Spacing.sm,
        paddingBottom: Spacing.lg,
    },
    fieldGroup: { marginBottom: Spacing.tight },
    fieldLabel: {
        fontSize: 13,
        marginBottom: Spacing.xs + 2,
    },
    input: {
        borderWidth: 1,
        borderRadius: BorderRadius.lg,
        paddingHorizontal: Spacing.tight,
        paddingVertical: Spacing.tight,
        minHeight: 48,
        fontSize: 15,
        textAlign: 'auto',
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        marginTop: Spacing.lg,
        paddingVertical: Spacing.tight,
        borderRadius: BorderRadius.lg,
        minHeight: 48,
    },
    deleteText: { fontSize: 15 },
});
