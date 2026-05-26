import { useAppTheme } from '@/hooks/use-app-theme';
import { useDeleteAddress } from '@/hooks/react-query-hooks/use-addresses';
import type { Address } from '@/services/addresses/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    I18nManager,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useAddressesStore } from '@/stores/addresses-store';
import { useAppPrefsStore } from '@/stores/app-prefs-store';
import { getAddressSummary } from '@/lib/utils.';

export default function AddressListScreen() {
    const { colors, font } = useAppTheme();
    const { t } = useTranslation(['addresses', 'general']);
    const router = useRouter();

    const deleteAddress = useDeleteAddress();

    // Addresses
    const { addresses, removeAddress } = useAddressesStore();

    // Last selected address
    const { lastSelectedAddress, setLastSelectedAddress } = useAppPrefsStore();

    const handleDelete = (address: Address) => {
        Alert.alert(
            t('addresses:delete_confirm_title'),
            t('addresses:delete_confirm_message'),
            [
                { text: t('addresses:cancel'), style: 'cancel' },
                {
                    text: t('addresses:delete'),
                    style: 'destructive',
                    onPress: () => {
                        deleteAddress.mutate(address.id, {
                            onSuccess: () => {
                                if (lastSelectedAddress?.id === address.id) {
                                    setLastSelectedAddress(null);
                                }
                            },
                        });
                    },
                },
            ],
        );
    };

    const renderItem = ({ item }: { item: Address }) => {
        return (
            <Pressable
                style={[
                    styles.addressCard,
                    { backgroundColor: colors.card, borderColor: colors.border },
                ]}
                onPress={() => setLastSelectedAddress(item)}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.cardTitleRow}>
                        <Text style={[styles.cardTitle, { color: colors.foreground, fontFamily: font.semiBold }]}>
                            {item.name}
                        </Text>
                    </View>
                    <View style={styles.cardActions}>
                        <Pressable
                            hitSlop={8}
                            onPress={() => router.push({ pathname: '/addresses/add', params: { id: item.id } })}
                        >
                            <Ionicons name="create-outline" size={20} color={colors.link} />
                        </Pressable>
                        <Pressable hitSlop={8} onPress={() => handleDelete(item)}>
                            <Ionicons name="trash-outline" size={20} color={colors.destructive} />
                        </Pressable>
                    </View>
                </View>
                <Text
                    style={[styles.cardSummary, { color: colors.mutedForeground, fontFamily: font.regular }]}
                    numberOfLines={2}
                >
                    {getAddressSummary(item)}
                </Text>
            </Pressable>
        );
    };

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
                    {t('addresses:title')}
                </Text>
                <Pressable
                    onPress={() => router.push('/addresses/add')}
                    hitSlop={8}
                    style={[styles.addButton, { backgroundColor: colors.primary }]}
                >
                    <Ionicons name="add" size={22} color={colors.primaryForeground} />
                </Pressable>
            </View>

            {deleteAddress.isPending ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={addresses}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.centered}>
                            <Ionicons name="location-outline" size={48} color={colors.mutedForeground} />
                            <Text style={[styles.emptyText, { color: colors.mutedForeground, fontFamily: font.regular }]}>
                                {t('addresses:no_addresses')}
                            </Text>
                            <Pressable
                                onPress={() => router.push('/addresses/add')}
                                style={[styles.emptyButton, { backgroundColor: colors.primary }]}
                            >
                                <Text style={[styles.emptyButtonText, { color: colors.primaryForeground, fontFamily: font.bold }]}>
                                    {t('addresses:add_address')}
                                </Text>
                            </Pressable>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1 },
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.tight },
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
    addButton: {
        width: 38,
        height: 38,
        borderRadius: BorderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listContent: {
        paddingHorizontal: Spacing.gutter,
        paddingTop: Spacing.sm,
        paddingBottom: Spacing.lg,
        gap: Spacing.tight,
    },
    addressCard: {
        borderWidth: 1.5,
        borderRadius: BorderRadius.xl,
        padding: Spacing.md,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    cardTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    cardTitle: { fontSize: 16 },
    selectedBadge: {
        width: 20,
        height: 20,
        borderRadius: BorderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardActions: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    cardSummary: { fontSize: 14, lineHeight: 20 },
    emptyText: { fontSize: 15, textAlign: 'center', marginTop: Spacing.sm },
    emptyButton: {
        marginTop: Spacing.md,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.tight,
        borderRadius: BorderRadius.full,
    },
    emptyButtonText: { fontSize: 15 },
});
