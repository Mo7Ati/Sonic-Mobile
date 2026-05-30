import RemoteImage from '@/components/ui/remote-image'
import { BorderRadius, Spacing } from '@/constants/theme'
import { useAppTheme } from '@/hooks/use-app-theme'
import { StoreCategory } from '@/services/store-categories/types'
import { Text } from '@react-navigation/elements'
import React, { memo } from 'react'
import { FlatList, Pressable, StyleSheet, View } from 'react-native'

function SubCategoryItem({
    item,
    isActive,
    onPress,
}: {
    item: StoreCategory
    isActive: boolean
    onPress: (subCategory: StoreCategory) => void
}) {
    const { colors } = useAppTheme()

    return (
        <Pressable
            onPress={() => onPress(item)}
            style={styles.itemContainer}
        >
            <View style={[styles.imageRing, isActive && { borderColor: colors.primary }]}>
                <View style={[styles.imageWrap, { backgroundColor: colors.muted }]}>
                    <RemoteImage
                        uri={item.image}
                        recyclingKey={`sub-category-${item.id}`}
                        style={styles.image}
                        placeholderIcon="grid-outline"
                        priority="low"
                    />
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
        paddingHorizontal: Spacing.tight,
        gap: Spacing.tight,
        marginBottom: Spacing.md,
    },
    itemContainer: {
        alignItems: 'center',
    },
    imageRing: {
        width: 72,
        height: 72,
        borderRadius: BorderRadius.full,
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

export default memo(SubCategoriesList)
