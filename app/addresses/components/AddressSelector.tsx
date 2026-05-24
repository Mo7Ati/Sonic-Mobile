import { useAppTheme } from '@/hooks/use-app-theme';
import type { Address } from '@/services/addresses/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BorderRadius, Spacing } from '@/constants/theme';
import { usePlatformStore } from '@/stores/platform-store';
import { getAddressSummary } from '@/lib/utils.';
import { useEffect, useMemo, useState } from 'react';

interface AddressSelectorProps {
    visible: boolean;
    onClose: () => void;
}

export function AddressSelector({ visible, onClose }: AddressSelectorProps) {
    const { colors, font } = useAppTheme();
    const { t } = useTranslation('addresses');
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const { addresses, lastSelectedAddress, setLastSelectedAddress } = usePlatformStore();

    const handleChange = (address: Address) => {
        setLastSelectedAddress(address);
    };

    const handleAddNew = () => {
        onClose();
        router.push({
            pathname: '/addresses/add',
            params: { selectOnCreate: '1' },
        });
    };

    const renderItem = ({ item }: { item: Address }) => {
        const isSelected = lastSelectedAddress?.id === item.id;

        return (
            <Pressable
                style={[
                    styles.addressItem,
                    {
                        backgroundColor: isSelected ? colors.accent : colors.card,
                        borderColor: isSelected ? colors.primary : colors.border,
                    },
                ]}
                onPress={() => handleChange(item)}
            >
                {/* Radio */}
                <View
                    style={[
                        styles.radioOuter,
                        { borderColor: isSelected ? colors.primary : colors.border },
                    ]}
                >
                    {isSelected && (
                        <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
                    )}
                </View>

                {/* Text block */}
                <View style={styles.itemText}>
                    <Text style={[styles.itemName, { color: colors.foreground, fontFamily: font.bold }]}>
                        {item.name}
                    </Text>
                    <Text
                        style={[styles.itemSummary, { color: colors.mutedForeground, fontFamily: font.regular }]}
                        numberOfLines={2}
                    >
                        {getAddressSummary(item)}
                    </Text>
                </View>

                {/* Edit action */}
                {/* <Pressable
                    hitSlop={8}
                    onPress={() => handleEdit(item)}
                    style={styles.editButton}
                >
                    <Text style={[styles.editText, { color: colors.primary, fontFamily: font.semiBold }]}>
                        {t('edit')}
                    </Text>
                    <Ionicons name="pencil" size={14} color={colors.primary} />
                </Pressable> */}
            </Pressable>
        );
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable
                    style={[styles.sheet, { backgroundColor: colors.background, paddingBottom: insets.bottom + Spacing.sm }]}
                    onPress={(e) => e.stopPropagation()}
                >
                    {/* Handle */}
                    <View style={styles.handleRow}>
                        <View style={[styles.handle, { backgroundColor: colors.border }]} />
                    </View>

                    {/* Header: title + subtitle + close */}
                    <View style={styles.headerRow}>
                        <View style={styles.headerText}>
                            <Text style={[styles.sheetTitle, { color: colors.foreground, fontFamily: font.bold }]}>
                                {t('select_delivery_address')}
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={[styles.sheetSubtitle, { color: colors.mutedForeground, fontFamily: font.regular }]}>
                                    {t('select_delivery_subtitle')}
                                </Text>

                                {/* <Text style={[{ color: colors.primary, fontFamily: font.semiBold }]}>
                                    {t('see_all_addresses')}
                                    <Ionicons name="chevron-forward" size={14} color={colors.primary} />
                                </Text> */}
                            </View>
                        </View>
                        <Pressable
                            onPress={onClose}
                            hitSlop={8}
                            style={[styles.closeButton, { backgroundColor: colors.muted }]}
                        >
                            <Ionicons name="close" size={20} color={colors.foreground} />
                        </Pressable>
                    </View>

                    {/* Address List */}
                    <FlatList
                        data={addresses}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <Text style={[styles.emptyText, { color: colors.mutedForeground, fontFamily: font.regular }]}>
                                {t('no_addresses')}
                            </Text>
                        }
                    />

                    {/* Add New Button (dashed outline) */}
                    <Pressable
                        style={[styles.addNewButton, { borderColor: colors.primary, backgroundColor: colors.primary }]}
                        onPress={handleAddNew}
                    >
                        <Ionicons name="add" size={20} color={colors.primaryForeground} />
                        <Text style={[styles.addNewText, { color: colors.primaryForeground, fontFamily: font.semiBold }]}>
                            {t('deliver_to_other_address')}
                        </Text>
                    </Pressable>

                    {/* Confirm Button (solid primary) */}
                    {/* <Pressable
                        style={[
                            styles.confirmButton,
                            { backgroundColor: colors.primary, opacity: currentSelectedAddress ? 1 : 0.6 },
                        ]}
                        disabled={!currentSelectedAddress}
                        onPress={handleSubmit}
                    >
                        <Text style={[styles.confirmText, { color: colors.primaryForeground, fontFamily: font.bold }]}>
                            {t('confirm_address')}
                        </Text>
                    </Pressable> */}
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
        maxHeight: '85%',
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
    listContent: {
        paddingHorizontal: Spacing.gutter,
        gap: Spacing.tight,
        paddingBottom: Spacing.tight,
    },
    addressItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: Spacing.tight,
        borderWidth: 1.5,
        borderRadius: BorderRadius.xl,
        padding: Spacing.tight,
    },
    radioOuter: {
        width: 22,
        height: 22,
        borderRadius: BorderRadius.full,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: BorderRadius.full,
    },
    itemText: { flex: 1 },
    itemName: { fontSize: 16 },
    itemSummary: { fontSize: 13, marginTop: 4, lineHeight: 18 },
    lastUsedBadge: {
        alignSelf: 'flex-start',
        marginTop: Spacing.sm,
        paddingHorizontal: Spacing.sm + 2,
        paddingVertical: 4,
        borderRadius: BorderRadius.md,
    },
    lastUsedText: { fontSize: 11 },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: Spacing.xs,
        paddingVertical: 2,
        marginTop: 2,
    },
    editText: { fontSize: 13 },
    emptyText: { textAlign: 'center', paddingVertical: Spacing.lg, fontSize: 14 },
    addNewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        marginHorizontal: Spacing.gutter,
        paddingVertical: Spacing.tight,
        borderRadius: BorderRadius.xl,
        borderWidth: 1.5,
        borderStyle: 'solid',
        marginTop: Spacing.sm,
    },
    addNewText: { fontSize: 14 },
    confirmButton: {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: Spacing.gutter,
        marginTop: Spacing.tight,
        paddingVertical: Spacing.tight + 2,
        borderRadius: BorderRadius.xl,
        minHeight: 52,
    },
    confirmText: { fontSize: 16 },
});
