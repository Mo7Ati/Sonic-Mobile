import { useAppTheme } from '@/hooks/use-app-theme';
import {
    useAddressFields,
    useCreateAddress,
    useUpdateAddress,
    useAddresses,
} from '@/hooks/react-query-hooks/use-addresses';
import { useAddressStore } from '@/stores/address-store';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import i18n from '@/lib/i18n';
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
import { BorderRadius, Spacing } from '@/constants/theme';

export default function AddAddressScreen() {
    const { colors, font } = useAppTheme();
    const { t } = useTranslation(['addresses', 'general']);
    const router = useRouter();
    const params = useLocalSearchParams<{ id?: string }>();
    const editId = params.id ? Number(params.id) : null;
    const isEditing = editId !== null;

    const { data: fieldTemplates, isPending: fieldsLoading } = useAddressFields();
    const { data: addresses } = useAddresses();
    const createAddress = useCreateAddress();
    const updateAddress = useUpdateAddress();
    const setSelectedAddress = useAddressStore((s) => s.setSelectedAddress);

    const editingAddress = isEditing
        ? addresses?.find((a) => a.id === editId)
        : null;

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<Record<string, string>>({ defaultValues: { name: '' } });

    // Pre-fill form when editing
    useEffect(() => {
        if (editingAddress && fieldTemplates) {
            const values: Record<string, string> = { name: editingAddress.name };
            for (const field of editingAddress.fields) {
                values[`field_${field.key}`] = field.value;
            }
            reset(values);
        }
    }, [editingAddress, fieldTemplates, reset]);

    const onSubmit = async (data: Record<string, string>) => {
        const fields: Record<string, string> = {};
        for (const key of Object.keys(data)) {
            if (key.startsWith('field_') && data[key]) {
                fields[key.replace('field_', '')] = data[key];
            }
        }

        const payload = { name: data.name, fields };

        if (isEditing && editId) {
            updateAddress.mutate(
                { id: editId, payload },
                {
                    onSuccess: (updated) => {
                        setSelectedAddress(updated);
                        router.back();
                    },
                },
            );
        } else {
            createAddress.mutate(payload, {
                onSuccess: (created) => {
                    setSelectedAddress(created);
                    router.back();
                },
            });
        }
    };

    const getLabel = (label: Record<string, string>) => {
        return label[i18n.language] || label['en'] || Object.values(label)[0] || '';
    };

    if (fieldsLoading) {
        return (
            <SafeAreaView style={[styles.screen, styles.centered, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </SafeAreaView>
        );
    }

    const isSaving = createAddress.isPending || updateAddress.isPending;

    return (
        <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
            {/* Header */}
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
                    {isEditing ? t('addresses:edit_address') : t('addresses:add_address')}
                </Text>
                <View style={{ width: 38 }} />
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.formContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Address Name */}
                    <View style={styles.fieldContainer}>
                        <Text style={[styles.label, { color: colors.secondaryForeground, fontFamily: font.semiBold }]}>
                            {t('addresses:address_name')} *
                        </Text>
                        <Controller
                            control={control}
                            name="name"
                            rules={{ required: true }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            color: colors.foreground,
                                            backgroundColor: colors.muted,
                                            borderColor: errors.name ? colors.destructive : colors.border,
                                            fontFamily: font.regular,
                                        },
                                    ]}
                                    placeholder={t('addresses:address_name_placeholder')}
                                    placeholderTextColor={colors.placeholder}
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                />
                            )}
                        />
                    </View>

                    {/* Dynamic Fields */}
                    {fieldTemplates?.map((template) => {
                        const fieldName = `field_${template.key}`;
                        return (
                            <View key={template.key} style={styles.fieldContainer}>
                                <Text style={[styles.label, { color: colors.secondaryForeground, fontFamily: font.semiBold }]}>
                                    {getLabel(template.label)}{template.is_required ? ' *' : ''}
                                </Text>
                                <Controller
                                    control={control}
                                    name={fieldName}
                                    rules={{ required: template.is_required }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            style={[
                                                styles.input,
                                                {
                                                    color: colors.foreground,
                                                    backgroundColor: colors.muted,
                                                    borderColor: errors[fieldName] ? colors.destructive : colors.border,
                                                    fontFamily: font.regular,
                                                },
                                            ]}
                                            placeholder={getLabel(template.label)}
                                            placeholderTextColor={colors.placeholder}
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                        />
                                    )}
                                />
                            </View>
                        );
                    })}
                </ScrollView>

                {/* Save Button */}
                <View style={[styles.footer, { borderTopColor: colors.border }]}>
                    <Pressable
                        onPress={handleSubmit(onSubmit)}
                        disabled={isSaving}
                        style={[
                            styles.saveButton,
                            { backgroundColor: isSaving ? colors.muted : colors.primary },
                        ]}
                    >
                        {isSaving ? (
                            <ActivityIndicator size="small" color={colors.primaryForeground} />
                        ) : (
                            <Text style={[styles.saveButtonText, { color: colors.primaryForeground, fontFamily: font.bold }]}>
                                {isEditing ? t('addresses:update') : t('addresses:save')}
                            </Text>
                        )}
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1 },
    centered: { alignItems: 'center', justifyContent: 'center' },
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
    formContent: {
        paddingHorizontal: Spacing.gutter,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.lg,
    },
    fieldContainer: {
        marginBottom: Spacing.md,
    },
    label: {
        fontSize: 14,
        marginBottom: Spacing.sm,
    },
    input: {
        borderWidth: 1.5,
        borderRadius: BorderRadius.xl,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.tight,
        fontSize: 16,
        minHeight: 50,
        textAlign: 'auto',
    },
    footer: {
        borderTopWidth: StyleSheet.hairlineWidth,
        paddingHorizontal: Spacing.gutter,
        paddingTop: Spacing.tight,
        paddingBottom: Spacing.sm,
    },
    saveButton: {
        paddingVertical: Spacing.tight,
        borderRadius: BorderRadius.xl,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 50,
    },
    saveButtonText: { fontSize: 16 },
});
