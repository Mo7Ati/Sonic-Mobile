import React from 'react'
import { Branch } from '../home/types'
import { FlatList, StyleSheet, View } from 'react-native'
import BranchCard from './branch-card'


const BranchesList = ({ branches, horizontal = true }: { branches: Branch[], horizontal?: boolean }) => {
    return (
        <FlatList
            data={branches}
            renderItem={({ item }) => <BranchCard item={item} fullWidth={!horizontal} />}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            horizontal={horizontal}
            scrollEnabled={horizontal}
            contentContainerStyle={horizontal ? styles.listContentHorizontal : styles.listContentVertical}
            {...(!horizontal && {
                ItemSeparatorComponent: () => <View style={{ height: 12 }} />,
            })}
        />
    )
}

const styles = StyleSheet.create({
    listContentHorizontal: {
        paddingHorizontal: 20,
    },
    listContentVertical: {
        paddingHorizontal: 20,
    },
})

export default BranchesList
