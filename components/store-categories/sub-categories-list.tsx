import React from 'react'
import { FlatList, Image, Pressable, StyleSheet, View } from 'react-native'
import { Text } from '@react-navigation/elements'
import { StoreCategory } from '@/services/store-category'
import { useThemeColors } from '@/hooks/use-theme-color'

function SubCategoryItem({
    item,
    isActive,
    onPress,
}: {
    item: StoreCategory
    isActive: boolean
    onPress: (subCategory: StoreCategory) => void
}) {
    const colors = useThemeColors()

    return (
        <Pressable
            onPress={() => onPress(item)}
            style={styles.itemContainer}
        >
            <View style={[styles.imageRing, isActive && { borderColor: colors.primary }]}>
                <View style={[styles.imageWrap, { backgroundColor: colors.muted }]}>
                    {item.image ? (
                        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
                    ) : (
                        <View style={[styles.image, { backgroundColor: colors.muted }]} />
                    )}
                </View>
            </View>
            <Text
                style={[
                    styles.label,
                    { color: isActive ? colors.primary : colors.foreground },
                ]}
                numberOfLines={1}
            >
                {item.name}
            </Text>
        </Pressable>
    )
}

const SubCategoriesList = ({
    subCategories,
    onPress,
    activeSubCategory,
}: {
    subCategories: StoreCategory[]
    onPress: (subCategory: StoreCategory) => void
    activeSubCategory: StoreCategory | null
}) => {
    return (
        <FlatList
            data={subCategories}
            renderItem={({ item }) => (
                <SubCategoryItem
                    item={item}
                    isActive={activeSubCategory?.id === item.id}
                    onPress={onPress}
                />
            )}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
        />
    )
}

const styles = StyleSheet.create({
    listContent: {
        paddingHorizontal: 20,
        gap: 16,
        marginBottom: 14,
    },
    itemContainer: {
        alignItems: 'center',
    },
    imageRing: {
        width: 72,
        height: 72,
        borderRadius: 36,
        borderWidth: 2,
        borderColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageWrap: {
        width: 64,
        height: 64,
        borderRadius: 32,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    label: {
        marginTop: 6,
        fontSize: 12,
        fontWeight: '500',
        textAlign: 'center',
        maxWidth: 72,
    },
})

export default SubCategoriesList
