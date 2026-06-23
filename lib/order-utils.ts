import i18n from "@/lib/i18n";
import type { OrderItem } from "@/services/orders/types";

export function resolveLocalizedName(
    name: string | Record<string, string> | undefined | null,
): string {
    if (!name) {
        return "";
    }
    if (typeof name === "string") {
        return name;
    }

    const lang = i18n.language?.startsWith("ar") ? "ar" : "en";

    return name[lang] ?? name.en ?? name.ar ?? Object.values(name)[0] ?? "";
}

export function resolveOrderItemName(item: OrderItem): string {
    return resolveLocalizedName(item.name);
}

export function formatOrderTime(iso: string): string {
    const date = new Date(iso);

    return date.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function formatItemsBrief(items: OrderItem[] | undefined, maxVisible = 2): string {
    if (!items?.length) {
        return "";
    }

    const parts = items.slice(0, maxVisible).map((item) => {
        const name = resolveOrderItemName(item);

        return item.quantity > 1 ? `${name} ×${item.quantity}` : name;
    });

    const remaining = items.length - maxVisible;

    if (remaining > 0) {
        parts.push(
            i18n.t("orders:items_more", {
                count: remaining,
            }),
        );
    }

    return parts.join(" · ");
}

export function formatOrderItemDescription(item: OrderItem): string {
    const optionsText = item.options_data
        ?.map((option) => resolveLocalizedName(option.name))
        .filter(Boolean)
        .join(", ");

    const additionsText = item.additions_data
        ?.map((addition) => resolveLocalizedName(addition.name))
        .filter(Boolean)
        .join(", ");

    return [optionsText, additionsText].filter(Boolean).join(", ");
}

export function formatOrderAddress(
    addressData: Record<string, unknown> | null | undefined,
): string {
    if (!addressData) {
        return "";
    }

    const name = typeof addressData.name === "string" ? addressData.name : "";
    const fields = Array.isArray(addressData.fields)
        ? addressData.fields
              .map((field) => {
                  if (field && typeof field === "object" && "value" in field) {
                      return String((field as { value?: string }).value ?? "");
                  }

                  return "";
              })
              .filter(Boolean)
              .join(", ")
        : "";

    if (name && fields) {
        return `${name} — ${fields}`;
    }

    return name || fields;
}
