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
import { useAddresses } from '@/hooks/react-query-hooks/use-addresses';
import { useAppPrefsStore } from '@/stores/app-prefs-store';
import { getAddressFieldsSummary } from '@/lib/utils.';

interface AddressSelectorProps {
    visible: boolean;
    onClose: () => void;
}

export function AddressSelector({ visible, onClose }: AddressSelectorProps) {
    const { colors, font } = useAppTheme();
    const { t } = useTranslation('addresses');
    const router = useRouter();
    const insets = useSafeAreaInsets();

    // Addresses (server state)
    const { data: addresses = [] } = useAddresses();

    // Last selected address (client pref)
    const lastSelectedAddressId = useAppPrefsStore((s) => s.lastSelectedAddressId);
    const setLastSelectedAddress = useAppPrefsStore((s) => s.setLastSelectedAddress);

    const handleChange = (address: Address) => {
        setLastSelectedAddress(address);
        onClose();
    };

    const handleAddNew = () => {
        onClose();
        router.push({
            pathname: '/addresses/add',
            params: { selectOnCreate: '1' },
        });
    };

    const renderItem = ({ item }: { item: Address }) => {
        const isSelected = lastSelectedAddressId === item.id;

        return (
            <Pressable
                style={[
                    styles.addressItem,
                    {
                        backgroundColor: isSelected ? colors.background : colors.card,
                        borderColor: isSelected ? colors.primary : colors.border,
                    },
                ]}
                onPress={() => handleChange(item)}
            >
                {/* Text block */}
                <View style={styles.itemText}>
                    <Text style={[styles.itemName, { color: colors.foreground, fontFamily: font.bold }]}>
                        {item.name.length > 25 ? item.name.slice(0, 25) + '...' : item.name}
                    </Text>
                    <Text
                        style={[styles.itemSummary, { color: colors.mutedForeground, fontFamily: font.regular }]}
                        numberOfLines={2}
                    >
                        {getAddressFieldsSummary(item)}
                    </Text>
                </View>
            </Pressable>
        );
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
                            {addresses.length > 0 ? t('deliver_to_other_address') : t('add_delivery_address')}
                        </Text>
                    </Pressable>
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
