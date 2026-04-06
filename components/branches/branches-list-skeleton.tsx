import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useThemeColors } from '@/hooks/use-theme-color';

const SKELETON_COUNT = 4;

const BranchCardSkeleton = ({ bone, boneLight }: { bone: string; boneLight: string }) => (
    <View style={[styles.card, { backgroundColor: boneLight, borderColor: bone }]}>
        <View style={styles.cardRow}>
            <View style={[styles.logoWrap, { backgroundColor: bone }]} />
            <View style={styles.textCol}>
                <View style={[styles.pill, styles.nameBar, { backgroundColor: bone }]} />
                <View style={[styles.pill, styles.subBar, { backgroundColor: bone }]} />
            </View>
        </View>
        <View style={[styles.metaRow, { borderTopColor: bone }]}>
            <View style={[styles.pill, styles.metaBar, { backgroundColor: bone }]} />
            <View style={[styles.pill, styles.metaBar, { backgroundColor: bone }]} />
            <View style={[styles.pill, styles.metaBar, { backgroundColor: bone }]} />
        </View>
    </View>
);

const BranchesListSkeleton = () => {
    const colors = useThemeColors();
    const opacity = useRef(new Animated.Value(0.55)).current;

    const bone = colors.border;
    const boneLight = colors.muted;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 700,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.45,
                    duration: 700,
                    useNativeDriver: true,
                }),
            ]),
        );
        loop.start();
        return () => loop.stop();
    }, [opacity]);

    return (
        <Animated.View style={[styles.container, { opacity }]}>
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <BranchCardSkeleton key={i} bone={bone} boneLight={boneLight} />
            ))}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        gap: 12,
    },
    card: {
        borderRadius: 14,
        borderWidth: StyleSheet.hairlineWidth,
        padding: 12,
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    logoWrap: {
        width: 48,
        height: 48,
        borderRadius: 12,
    },
    textCol: {
        flex: 1,
        gap: 8,
    },
    pill: {
        borderRadius: 6,
    },
    nameBar: {
        width: '60%',
        height: 12,
    },
    subBar: {
        width: '40%',
        height: 10,
    },
    metaRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    metaBar: {
        width: 60,
        height: 10,
    },
});

export default BranchesListSkeleton;
