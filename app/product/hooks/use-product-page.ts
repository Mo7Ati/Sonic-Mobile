import { useProductDetail } from "@/hooks/react-query-hooks/use-product-detail";
import { useAddCartItem, useCart, useRemoveCartItem } from "@/hooks/react-query-hooks/use-cart";
import type { AddCartItemPayload } from "@/services/cart/types";
import { isAxiosError } from "axios";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppDialog } from "@/components/ui/app-dialog";
import { ScrollView } from "react-native";

export default function useProductPage(productId: number, branchId: number, editCartItemId?: number) {
    const { data: product, isPending, error } = useProductDetail(productId);

    // Resolve edit state from the cart cache
    const { data: cart } = useCart();
    const editItem = editCartItemId
        ? cart?.items.find((i) => i.id === editCartItemId)
        : undefined;

    const scrollRef = useRef<ScrollView>(null);
    const [showCompactHeader, setShowCompactHeader] = useState(false);

    // Pre-fill from edit item if available
    const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>(() => {
        if (!editItem?.options_data) return {};
        const map: Record<number, number> = {};
        for (const opt of editItem.options_data) {
            map[opt.group_id] = opt.id;
        }
        return map;
    });
    const [selectedAdditions, setSelectedAdditions] = useState<Set<number>>(() => {
        if (!editItem?.additions_data) return new Set();
        return new Set(editItem.additions_data.map((a) => a.id));
    });
    const [quantity, setQuantity] = useState(editItem?.quantity ?? 1);

    const imageHeight = useRef(0);

    const registerImageHeight = useCallback((h: number) => {
        imageHeight.current = h;
    }, []);

    const handleScroll = useCallback((offsetY: number) => {
        const threshold = imageHeight.current > 0 ? imageHeight.current - 60 : 200;
        setShowCompactHeader(offsetY > threshold);
    }, []);

    const selectOption = useCallback((groupId: number, itemId: number) => {
        setSelectedOptions((prev) => ({ ...prev, [groupId]: itemId }));
    }, []);

    const toggleAddition = useCallback((additionId: number) => {
        setSelectedAdditions((prev) => {
            const next = new Set(prev);
            if (next.has(additionId)) {
                next.delete(additionId);
            } else {
                next.add(additionId);
            }
            return next;
        });
    }, []);

    const incrementQuantity = useCallback(() => {
        setQuantity((q) => q + 1);
    }, []);

    const decrementQuantity = useCallback(() => {
        setQuantity((q) => Math.max(1, q - 1));
    }, []);

    // Check if all required option groups have a selection
    const allOptionsSelected = useMemo(() => {
        if (!product) return false;
        return product.options.every(
            (group) => selectedOptions[group.group_id] !== undefined
        );
    }, [product, selectedOptions]);

    // Calculate total price
    const totalPrice = useMemo(() => {
        if (!product) return 0;

        let total = Number(product.price);

        // Add selected option prices
        for (const group of product.options) {
            const selectedItemId = selectedOptions[group.group_id];
            if (selectedItemId !== undefined) {
                const item = group.items.find((i) => i.id === selectedItemId);
                if (item) {
                    total += Number(item.price);
                }
            }
        }

        // Add selected addition prices
        for (const addition of product.additions) {
            if (selectedAdditions.has(addition.id)) {
                total += Number(addition.price);
            }
        }

        return total * quantity;
    }, [product, selectedOptions, selectedAdditions, quantity]);

    const addItemMutation = useAddCartItem();
    const removeItemMutation = useRemoveCartItem();
    const router = useRouter();
    const { t } = useTranslation(["cart", "general"]);
    const isEditing = !!editCartItemId;

    const buildPayload = useCallback((): AddCartItemPayload | null => {
        if (!product) return null;

        const options = product.options
            .filter((g) => selectedOptions[g.group_id] !== undefined)
            .map((g) => selectedOptions[g.group_id]);

        const additions = product.additions
            .filter((a) => selectedAdditions.has(a.id))
            .map((a) => a.id);

        return {
            branch_id: branchId,
            product_id: product.id,
            quantity,
            options: options.length > 0 ? options : undefined,
            additions: additions.length > 0 ? additions : undefined,
        };
    }, [product, selectedOptions, selectedAdditions, quantity, branchId]);

    const addToCart = useCallback(async () => {
        const payload = buildPayload();
        if (!payload) return;

        try {
            // Edit mode: remove old item first, then add updated one
            if (editCartItemId) {
                await removeItemMutation.mutateAsync(editCartItemId);
            }

            await addItemMutation.mutateAsync(payload);
            router.back();
        } catch (error) {
            const isBranchConflict =
                isAxiosError(error) && error.response?.status === 409;

            if (!isBranchConflict) return;

            AppDialog.alert(
                t("cart:branch_conflict_title"),
                t("cart:branch_conflict_message"),
                [
                    { text: t("general:actions.go_back"), style: "cancel" },
                    {
                        text: t("cart:replace_cart"),
                        style: "destructive",
                        onPress: async () => {
                            try {
                                await addItemMutation.mutateAsync({
                                    ...payload,
                                    force_replace: true,
                                });
                                router.back();
                            } catch {
                                // Replacement failed; leave the user on the page.
                            }
                        },
                    },
                ],
            );
        }
    }, [buildPayload, editCartItemId, addItemMutation, removeItemMutation, router, t]);

    return {
        product,
        isPending,
        error,
        scrollRef,
        showCompactHeader,
        selectedOptions,
        selectedAdditions,
        quantity,
        allOptionsSelected,
        totalPrice,
        handleScroll,
        registerImageHeight,
        selectOption,
        toggleAddition,
        incrementQuantity,
        decrementQuantity,
        addToCart,
        isEditing,
    };
}
