import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useThemeColors } from '@/hooks/use-theme-color';

const SKELETON_COUNT = 5;

const SubCategoriesSkeleton = () => {
    const colors = useThemeColors();
    const opacity = useRef(new Animated.Value(0.55)).current;

    const bone = colors.border;

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
                <View key={i} style={styles.item}>
                    <View style={[styles.circle, { backgroundColor: bone }]} />
                    <View style={[styles.label, { backgroundColor: bone }]} />
                </View>
            ))}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 16,
        marginBottom: 14,
    },
    item: {
        alignItems: 'center',
        gap: 6,
    },
    circle: {
        width: 64,
        height: 64,
        borderRadius: 32,
    },
    label: {
        width: 48,
        height: 10,
        borderRadius: 5,
    },
});

export default SubCategoriesSkeleton;
