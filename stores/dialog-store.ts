import { create } from "zustand";

/**
 * A single action button in a themed dialog. Mirrors React Native's
 * `AlertButton` so call sites can migrate from `Alert.alert` unchanged.
 */
export interface DialogButton {
    text: string;
    style?: "default" | "cancel" | "destructive";
    onPress?: () => void;
}

export interface DialogOptions {
    title: string;
    message?: string;
    buttons?: DialogButton[];
}

interface DialogState {
    visible: boolean;
    options: DialogOptions | null;
    /** Opens the themed dialog. Replaces native `Alert.alert`. */
    present: (options: DialogOptions) => void;
    /** Closes the dialog without invoking any button handler. */
    dismiss: () => void;
}

/**
 * Imperative, store-backed dialog so it can be triggered from hooks, mutation
 * callbacks, and other non-render contexts — exactly where `Alert.alert` lived.
 * The single <AppDialogHost /> mounted in the root layout renders the state.
 */
export const useDialogStore = create<DialogState>((set) => ({
    visible: false,
    options: null,
    present: (options) => set({ visible: true, options }),
    dismiss: () => set({ visible: false }),
}));
