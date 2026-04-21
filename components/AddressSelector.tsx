import { useAppTheme } from '@/hooks/use-app-theme';
import { useAddresses } from '@/hooks/react-query-hooks/use-addresses';
import type { Address } from '@/services/addresses/types';
import { useAddressStore } from '@/stores/address-store';
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

interface AddressSelectorProps {
    visible: boolean;
    onClose: () => void;
}

export function AddressSelector({ visible, onClose }: AddressSelectorProps) {
    const { colors, font } = useAppTheme();
    const { t } = useTranslation('addresses');
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const { data: addresses } = useAddresses();
    const selectedAddress = useAddressStore((s) => s.selectedAddress);
    const setSelectedAddress = useAddressStore((s) => s.setSelectedAddress);

    const handleSelect = (address: Address) => {
        setSelectedAddress(address);
        onClose();
    };

    const handleAddNew = () => {
        onClose();
        router.push('/addresses/add');
    };

    const getAddressSummary = (address: Address) => {
        return address.fields
            .map((f) => f.value)
            .filter(Boolean)
            .join(', ');
    };

    const renderItem = ({ item }: { item: Address }) => {
        const isSelected = selectedAddress?.id === item.id;

        return (
            <Pressable
                style={[
                    styles.addressItem,
                    {
                        backgroundColor: isSelected ? colors.accent : colors.card,
                        borderColor: isSelected ? colors.primary : colors.border,
                    },
                ]}
                onPress={() => handleSelect(item)}
            >
                <View style={styles.itemLeft}>
                    <Ionicons
                        name={item.name.toLowerCase() === 'work' ? 'briefcase-outline' : 'home-outline'}
                        size={20}
                        color={isSelected ? colors.primary : colors.foreground}
                    />
                    <View style={styles.itemText}>
                        <Text style={[styles.itemName, { color: colors.foreground, fontFamily: font.semiBold }]}>
                            {item.name}
                        </Text>
                        <Text
                            style={[styles.itemSummary, { color: colors.mutedForeground, fontFamily: font.regular }]}
                            numberOfLines={1}
                        >
                            {getAddressSummary(item)}
                        </Text>
                    </View>
                </View>
                {isSelected && (
                    <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                )}
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

                    {/* Title */}
                    <Text style={[styles.sheetTitle, { color: colors.foreground, fontFamily: font.bold }]}>
                        {t('select_address')}
                    </Text>

                    {/* Address List */}
                    <FlatList
                        data={addresses}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <Text style={[styles.emptyText, { color: colors.mutedForeground, fontFamily: font.regular }]}>
                                {t('no_addresses')}
                            </Text>
                        }
                    />

                    {/* Add New Button */}
                    <Pressable
                        style={[styles.addNewButton, { backgroundColor: colors.primary }]}
                        onPress={handleAddNew}
                    >
                        <Ionicons name="add" size={20} color={colors.primaryForeground} />
                        <Text style={[styles.addNewText, { color: colors.primaryForeground, fontFamily: font.bold }]}>
                            {t('add_address')}
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
        maxHeight: '60%',
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
    sheetTitle: {
        fontSize: 18,
        textAlign: 'center',
        paddingVertical: Spacing.tight,
    },
    listContent: {
        paddingHorizontal: Spacing.gutter,
        gap: Spacing.sm,
        paddingBottom: Spacing.tight,
    },
    addressItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1.5,
        borderRadius: BorderRadius.xl,
        padding: Spacing.tight,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        flex: 1,
    },
    itemText: { flex: 1 },
    itemName: { fontSize: 15 },
    itemSummary: { fontSize: 13, marginTop: 2 },
    emptyText: { textAlign: 'center', paddingVertical: Spacing.lg, fontSize: 14 },
    addNewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        marginHorizontal: Spacing.gutter,
        paddingVertical: Spacing.tight,
        borderRadius: BorderRadius.xl,
        marginTop: Spacing.sm,
    },
    addNewText: { fontSize: 15 },
});
