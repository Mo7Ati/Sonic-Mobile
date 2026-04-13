import { useProductDetail } from "@/hooks/react-query-hooks/use-product-detail";
import { useCallback, useMemo, useRef, useState } from "react";
import { ScrollView } from "react-native";

export function useProductPage(productId: number) {
    const { data: product, isPending, error } = useProductDetail(productId);

    const scrollRef = useRef<ScrollView>(null);
    const [showCompactHeader, setShowCompactHeader] = useState(false);

    // Option selections: { [group_id]: option_item_id }
    const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
    // Addition selections: Set of addition ids
    const [selectedAdditions, setSelectedAdditions] = useState<Set<number>>(new Set());
    // Quantity
    const [quantity, setQuantity] = useState(1);

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
    };
}
