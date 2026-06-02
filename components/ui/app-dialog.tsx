import { FontFamily } from "@/constants/fonts";
import { BorderRadius, Colors, Spacing } from "@/constants/theme";
import { TextVariants } from "@/constants/typography";
import {
    DialogButton,
    DialogOptions,
    useDialogStore,
} from "@/stores/dialog-store";
import { Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { FullWindowOverlay } from "react-native-screens";

/**
 * Themed, drop-in replacement for `Alert.alert`. Same call signature, but
 * rendered by <AppDialogHost /> with the app's fonts, colors, and radii.
 *
 *   AppDialog.alert("Title", "Message", [
 *     { text: "Cancel", style: "cancel" },
 *     { text: "Delete", style: "destructive", onPress: doDelete },
 *   ]);
 */
export const AppDialog = {
    alert(title: string, message?: string, buttons?: DialogButton[]) {
        useDialogStore.getState().present({ title, message, buttons });
    },
    present(options: DialogOptions) {
        useDialogStore.getState().present(options);
    },
    dismiss() {
        useDialogStore.getState().dismiss();
    },
};

const DEFAULT_BUTTONS: DialogButton[] = [{ text: "OK", style: "default" }];

/** The scrim + card. Rendered only while a dialog is active. */
function DialogContent({
    options,
    dismiss,
}: {
    options: DialogOptions;
    dismiss: () => void;
}) {
    const buttons = options.buttons?.length ? options.buttons : DEFAULT_BUTTONS;

    const handlePress = (button: DialogButton) => {
        dismiss();
        button.onPress?.();
    };

    // Side-by-side only for the common two-button case; stack otherwise so long
    // labels (and 3+ actions) stay readable.
    const horizontal = buttons.length === 2;

    return (
        <Pressable style={styles.overlay} onPress={dismiss}>
            {/* Stop taps inside the card from dismissing. */}
            <Pressable style={styles.card} onPress={() => {}}>
                {!!options.title && (
                    <Text style={styles.title}>{options.title}</Text>
                )}
                {!!options.message && (
                    <Text style={styles.message}>{options.message}</Text>
                )}

                <View
                    style={[
                        styles.actions,
                        horizontal ? styles.actionsRow : styles.actionsColumn,
                    ]}
                >
                    {buttons.map((button, index) => {
                        const isCancel = button.style === "cancel";
                        const isDestructive = button.style === "destructive";
                        return (
                            <Pressable
                                key={`${button.text}-${index}`}
                                onPress={() => handlePress(button)}
                                style={({ pressed }) => [
                                    styles.button,
                                    horizontal && styles.buttonFlex,
                                    isCancel
                                        ? styles.buttonCancel
                                        : styles.buttonSolid,
                                    isDestructive && styles.buttonDestructive,
                                    pressed && styles.buttonPressed,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.buttonText,
                                        isCancel
                                            ? styles.buttonTextCancel
                                            : styles.buttonTextSolid,
                                    ]}
                                >
                                    {button.text}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            </Pressable>
        </Pressable>
    );
}

/**
 * Mount once near the root (next to <Toast />). Renders the active dialog.
 *
 * iOS: a plain RN <Modal> renders *behind* screens presented with
 * `presentation: "modal"` (e.g. the product screen). FullWindowOverlay draws
 * above the entire window — including native modal screens — so the dialog is
 * always visible. Android <Modal> already stacks above modal screens.
 */
export function AppDialogHost() {
    const { visible, options, dismiss } = useDialogStore();

    const content =
        visible && options ? (
            <DialogContent options={options} dismiss={dismiss} />
        ) : null;

    if (Platform.OS === "ios") {
        return <FullWindowOverlay>{content}</FullWindowOverlay>;
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={dismiss}
        >
            {content}
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: Colors.modalOverlay,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: Spacing.xl,
    },
    card: {
        width: "100%",
        maxWidth: 360,
        backgroundColor: Colors.popover,
        borderRadius: BorderRadius["2xl"],
        padding: Spacing.lg,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 24,
        elevation: 12,
    },
    title: {
        ...TextVariants.subtitle,
        fontFamily: FontFamily.bold,
        color: Colors.popoverForeground,
        textAlign: "center",
    },
    message: {
        ...TextVariants.body,
        fontFamily: FontFamily.regular,
        color: Colors.mutedForeground,
        textAlign: "center",
        marginTop: Spacing.sm,
    },
    actions: {
        marginTop: Spacing.lg,
        gap: Spacing.tight,
    },
    actionsRow: {
        flexDirection: "row",
    },
    actionsColumn: {
        flexDirection: "column",
    },
    button: {
        minHeight: 50,
        borderRadius: BorderRadius.xl,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: Spacing.lg,
    },
    buttonFlex: {
        flex: 1,
    },
    buttonSolid: {
        backgroundColor: Colors.primary,
    },
    buttonDestructive: {
        backgroundColor: Colors.destructive,
    },
    buttonCancel: {
        backgroundColor: Colors.secondary,
    },
    buttonPressed: {
        opacity: 0.85,
    },
    buttonText: {
        fontSize: 16,
        fontFamily: FontFamily.semiBold,
    },
    buttonTextSolid: {
        color: Colors.primaryForeground,
    },
    buttonTextCancel: {
        color: Colors.secondaryForeground,
    },
});
