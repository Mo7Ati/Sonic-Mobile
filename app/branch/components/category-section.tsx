import { useAppTheme } from "@/hooks/use-app-theme";
import { Category } from "@/services/branch/types";
import { Product } from "@/services/product/types";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import { Text } from "@react-navigation/elements";
import ProductGridItem from "./product-grid-item";
import ProductListItem from "./product-list-item";

interface CategorySectionProps {
    category: Category;
    products: Product[];
    isFirst: boolean;
    onLayout?: (e: LayoutChangeEvent) => void;
}

export default function CategorySection({
    category,
    products,
    isFirst,
    onLayout,
}: CategorySectionProps) {
    const { colors } = useAppTheme();

    if (!products || products.length === 0) return null;

    return (
        <View style={styles.section} onLayout={onLayout}>
            <Text style={[styles.title, { color: colors.foreground }]}>
                {category.name}
            </Text>
            {category.description ? (
                <Text style={[styles.description, { color: colors.mutedForeground }]}>
                    {category.description}
                </Text>
            ) : null}

            {isFirst ? (
                <GridLayout products={products} />
            ) : (
                <ListLayout products={products} borderColor={colors.border} />
            )}
        </View>
    );
}

function GridLayout({ products }: { products: Product[] }) {
    const rows: Product[][] = [];
    for (let i = 0; i < products.length; i += 2) {
        rows.push(products.slice(i, i + 2));
    }

    return (
        <View style={styles.grid}>
            {rows.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.gridRow}>
                    {row.map((product) => (
                        <ProductGridItem key={product.id} product={product} />
                    ))}
                    {row.length === 1 && <View style={{ flex: 1 }} />}
                </View>
            ))}
        </View>
    );
}

function ListLayout({ products, borderColor }: { products: Product[]; borderColor: string }) {
    return (
        <View>
            {products.map((product, index) => (
                <View key={product.id}>
                    <ProductListItem product={product} />
                    {index < products.length - 1 && (
                        <View style={[styles.divider, { backgroundColor: borderColor }]} />
                    )}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        paddingTop: 24,
    },
    title: {
        fontSize: 22,
        fontWeight: "800",
        textAlign: 'left',
    },
    description: {
        fontSize: 13,
        fontWeight: "400",
        marginTop: 4,
        textAlign: 'left',
    },
    grid: {
        marginTop: 16,
        gap: 16,
    },
    gridRow: {
        flexDirection: "row",
        gap: 12,
    },
    divider: {
        height: StyleSheet.hairlineWidth,
    },
});
