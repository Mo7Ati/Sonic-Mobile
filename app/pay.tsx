import { useBranchPaymentMethods, usePlaceOrder } from "@/hooks/react-query-hooks/use-orders";
import { useAppTheme } from "@/hooks/use-app-theme";
import { formatAmount } from "@/lib/utils.";
import type { PaymentMethod, ProofFile } from "@/services/orders/types";
import { useLastSelectedAddress } from "@/stores/app-prefs-store";
import {
    selectCartBranchId,
    selectSubtotal,
    useCartStore,
} from "@/stores/cart-store";
import { BorderRadius, Spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    Alert,
    I18nManager,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PayScreen() {
    const { colors, font } = useAppTheme();
    const { t } = useTranslation(["checkout", "general"]);
    const router = useRouter();
    const params = useLocalSearchParams<{ methodId?: string; notes?: string }>();

    const branchId = useCartStore(selectCartBranchId);
    const subtotal = useCartStore(selectSubtotal);
    const clearCart = useCartStore((s) => s.clearCart);
    const selectedAddress = useLastSelectedAddress();

    const { data: paymentMethods, isLoading } = useBranchPaymentMethods(branchId);
    const placeOrder = usePlaceOrder();

    const [proof, setProof] = useState<ProofFile | null>(null);

    const method = useMemo<PaymentMethod | undefined>(
        () =>
            paymentMethods?.find((m) => String(m.id) === String(params.methodId)),
        [paymentMethods, params.methodId],
    );

    const handleCopy = async (value: string) => {
        await Clipboard.setStringAsync(value);
        Alert.alert(t("checkout:copied"), value);
    };

    const handlePickProof = async () => {
        const permission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert(t("checkout:permission_needed"), t("checkout:permission_photos"));
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            quality: 0.7,
        });

        if (result.canceled || !result.assets?.length) {
            return;
        }

        const asset = result.assets[0];
        setProof({
            uri: asset.uri,
            name: asset.fileName ?? `proof_${Date.now()}.jpg`,
            type: asset.mimeType ?? "image/jpeg",
        });
    };

    const handleSubmit = () => {
        if (!selectedAddress || !method || !proof) {
            return;
        }

        placeOrder.mutate(
            {
                address_id: selectedAddress.id,
                payment_method_type: method.type.value,
                proof,
                notes: params.notes?.trim() || undefined,
            },
            {
                onSuccess: () => {
                    clearCart();
                    Alert.alert(
                        t("checkout:order_success_title"),
                        t("checkout:order_success_message"),
                        [
                            {
                                text: t("checkout:ok"),
                                onPress: () => router.replace("/(tabs)"),
                            },
                        ],
                    );
                },
                onError: () => {
                    Alert.alert(
                        t("checkout:order_error_title"),
                        t("checkout:order_error_message"),
                    );
                },
            },
        );
    };

    const submitting = placeOrder.isPending;

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
                        name={I18nManager.isRTL ? "arrow-forward" : "arrow-back"}
                        size={20}
                        color={colors.foreground}
                    />
                </Pressable>
                <Text
                    style={[
                        styles.headerTitle,
                        { color: colors.foreground, fontFamily: font.bold },
                    ]}
                >
                    {t("checkout:pay_title")}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            {isLoading ? (
                <View style={styles.centered}>
                    <ActivityIndicator color={colors.primary} />
                </View>
            ) : !method ? (
                <View style={styles.centered}>
                    <Text
                        style={[
                            styles.helperText,
                            { color: colors.mutedForeground, fontFamily: font.regular },
                        ]}
                    >
                        {t("checkout:no_payment_methods")}
                    </Text>
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Method header */}
                    <Text
                        style={[
                            styles.methodName,
                            { color: colors.foreground, fontFamily: font.bold },
                        ]}
                    >
                        {method.type.label}
                    </Text>
                    <Text
                        style={[
                            styles.helperText,
                            { color: colors.mutedForeground, fontFamily: font.regular },
                        ]}
                    >
                        {t("checkout:pay_instructions_hint")}
                    </Text>

                    {/* Pay details */}
                    <View
                        style={[
                            styles.detailsCard,
                            { backgroundColor: colors.card, borderColor: colors.border },
                        ]}
                    >
                        <CopyRow
                            label={t("checkout:beneficiary_name")}
                            value={method.beneficiary_name}
                            onCopy={handleCopy}
                            colors={colors}
                            font={font}
                        />
                        {method.account_number ? (
                            <CopyRow
                                label={t("checkout:account_number")}
                                value={method.account_number}
                                onCopy={handleCopy}
                                colors={colors}
                                font={font}
                            />
                        ) : null}
                        {method.phone_number ? (
                            <CopyRow
                                label={t("checkout:phone_number")}
                                value={method.phone_number}
                                onCopy={handleCopy}
                                colors={colors}
                                font={font}
                            />
                        ) : null}
                    </View>

                    {method.instructions ? (
                        <View
                            style={[
                                styles.instructionsCard,
                                {
                                    backgroundColor: colors.accent,
                                    borderColor: colors.border,
                                },
                            ]}
                        >
                            <Ionicons
                                name="information-circle-outline"
                                size={20}
                                color={colors.accentForeground}
                            />
                            <Text
                                style={[
                                    styles.instructionsText,
                                    {
                                        color: colors.accentForeground,
                                        fontFamily: font.regular,
                                    },
                                ]}
                            >
                                {method.instructions}
                            </Text>
                        </View>
                    ) : null}

                    {/* Proof upload */}
                    <Text
                        style={[
                            styles.sectionTitle,
                            { color: colors.foreground, fontFamily: font.bold },
                        ]}
                    >
                        {t("checkout:upload_proof")}
                    </Text>
                    <Text
                        style={[
                            styles.helperText,
                            { color: colors.mutedForeground, fontFamily: font.regular },
                        ]}
                    >
                        {t("checkout:upload_proof_hint")}
                    </Text>

                    {proof ? (
                        <View style={styles.proofWrapper}>
                            <Image source={{ uri: proof.uri }} style={styles.proofImage} />
                            <Pressable
                                onPress={handlePickProof}
                                style={[
                                    styles.changeProofButton,
                                    { backgroundColor: colors.card, borderColor: colors.border },
                                ]}
                            >
                                <Ionicons name="image-outline" size={18} color={colors.primary} />
                                <Text
                                    style={[
                                        styles.changeProofText,
                                        { color: colors.primary, fontFamily: font.medium },
                                    ]}
                                >
                                    {t("checkout:change_image")}
                                </Text>
                            </Pressable>
                        </View>
                    ) : (
                        <Pressable
                            onPress={handlePickProof}
                            style={[styles.uploadCard, { borderColor: colors.border }]}
                        >
                            <Ionicons
                                name="cloud-upload-outline"
                                size={28}
                                color={colors.primary}
                            />
                            <Text
                                style={[
                                    styles.uploadText,
                                    { color: colors.foreground, fontFamily: font.semiBold },
                                ]}
                            >
                                {t("checkout:select_image")}
                            </Text>
                        </Pressable>
                    )}
                </ScrollView>
            )}

            {/* Footer */}
            {method ? (
                <View style={[styles.footer, { borderTopColor: colors.border }]}>
                    <Pressable
                        onPress={handleSubmit}
                        disabled={!proof || submitting}
                        style={[
                            styles.submitButton,
                            {
                                backgroundColor: colors.primary,
                                opacity: !proof || submitting ? 0.5 : 1,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.submitText,
                                { color: colors.primaryForeground, fontFamily: font.bold },
                            ]}
                        >
                            {submitting
                                ? t("checkout:placing_order")
                                : `${t("checkout:confirm_payment")} · ${formatAmount(subtotal)}`}
                        </Text>
                    </Pressable>
                </View>
            ) : null}
        </SafeAreaView>
    );
}

function CopyRow({
    label,
    value,
    onCopy,
    colors,
    font,
}: {
    label: string;
    value: string;
    onCopy: (value: string) => void;
    colors: ReturnType<typeof useAppTheme>["colors"];
    font: ReturnType<typeof useAppTheme>["font"];
}) {
    return (
        <View style={styles.copyRow}>
            <View style={styles.copyTexts}>
                <Text
                    style={[
                        styles.copyLabel,
                        { color: colors.mutedForeground, fontFamily: font.regular },
                    ]}
                >
                    {label}
                </Text>
                <Text
                    style={[
                        styles.copyValue,
                        { color: colors.foreground, fontFamily: font.semiBold },
                    ]}
                    selectable
                >
                    {value}
                </Text>
            </View>
            <Pressable onPress={() => onCopy(value)} hitSlop={8} style={styles.copyButton}>
                <Ionicons name="copy-outline" size={20} color={colors.primary} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1 },
    centered: { flex: 1, alignItems: "center", justifyContent: "center", padding: Spacing.gutter },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: Spacing.gutter,
        paddingVertical: Spacing.tight,
    },
    backButton: {
        width: 38,
        height: 38,
        borderRadius: BorderRadius.full,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    headerSpacer: { width: 38, height: 38 },
    headerTitle: { fontSize: 18 },

    scrollContent: { paddingHorizontal: Spacing.gutter, paddingBottom: Spacing.lg },

    methodName: { fontSize: 20, textAlign: "left", marginTop: Spacing.sm },
    helperText: { fontSize: 13, lineHeight: 19, textAlign: "left", marginTop: 4 },

    detailsCard: {
        borderWidth: 1,
        borderRadius: BorderRadius.xl,
        paddingHorizontal: Spacing.md,
        marginTop: Spacing.md,
    },
    copyRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.sm,
        paddingVertical: Spacing.tight,
    },
    copyTexts: { flex: 1 },
    copyLabel: { fontSize: 12, textAlign: "left" },
    copyValue: { fontSize: 16, textAlign: "left", marginTop: 2 },
    copyButton: { padding: 6 },

    instructionsCard: {
        flexDirection: "row",
        gap: Spacing.sm,
        borderWidth: 1,
        borderRadius: BorderRadius.xl,
        padding: Spacing.md,
        marginTop: Spacing.md,
    },
    instructionsText: { flex: 1, fontSize: 13, lineHeight: 20, textAlign: "left" },

    sectionTitle: { fontSize: 16, textAlign: "left", marginTop: Spacing.lg },

    uploadCard: {
        alignItems: "center",
        justifyContent: "center",
        gap: Spacing.sm,
        borderWidth: 1.5,
        borderStyle: "dashed",
        borderRadius: BorderRadius.xl,
        paddingVertical: Spacing.lg,
        marginTop: Spacing.sm,
    },
    uploadText: { fontSize: 15 },

    proofWrapper: { marginTop: Spacing.sm, gap: Spacing.sm },
    proofImage: {
        width: "100%",
        height: 260,
        borderRadius: BorderRadius.xl,
        resizeMode: "cover",
    },
    changeProofButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: Spacing.tight,
        borderWidth: 1,
        borderRadius: BorderRadius.full,
        paddingVertical: Spacing.tight,
    },
    changeProofText: { fontSize: 14 },

    footer: {
        borderTopWidth: StyleSheet.hairlineWidth,
        paddingHorizontal: Spacing.gutter,
        paddingTop: Spacing.tight,
        paddingBottom: Spacing.sm,
    },
    submitButton: {
        paddingVertical: Spacing.tight,
        borderRadius: BorderRadius.xl,
        alignItems: "center",
        justifyContent: "center",
    },
    submitText: { fontSize: 16 },
});
