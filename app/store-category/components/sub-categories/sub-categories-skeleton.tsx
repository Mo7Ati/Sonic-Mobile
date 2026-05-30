import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Easing,
    I18nManager,
    StyleSheet,
    View,
    type StyleProp,
    type ViewStyle,
} from 'react-native';

import { BorderRadius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

const SKELETON_COUNT = 5;
const WIN_W = Dimensions.get('window').width;

type ShimmerBoneProps = {
    height: number;
    width?: number | `${number}%`;
    borderRadius?: number;
    baseColor: string;
    highlight: string;
    translateX: Animated.AnimatedInterpolation<number>;
    style?: StyleProp<ViewStyle>;
};

function ShimmerBone({
    height,
    width = '100%',
    borderRadius = BorderRadius.xl,
    baseColor,
    highlight,
    translateX,
    style,
}: ShimmerBoneProps) {
    return (
        <View
            style={[
                { height, width, borderRadius, backgroundColor: baseColor, overflow: 'hidden' },
                style,
            ]}
        >
            <Animated.View
                pointerEvents="none"
                style={[StyleSheet.absoluteFillObject, { transform: [{ translateX }] }]}
            >
                <LinearGradient
                    colors={['transparent', highlight, 'transparent']}
                    locations={[0.25, 0.5, 0.75]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={{ width: WIN_W * 0.42, height: '100%' }}
                />
            </Animated.View>
        </View>
    );
}

const SubCategoriesSkeleton = () => {
    const { colors } = useAppTheme();
    const shine = useRef(new Animated.Value(0)).current;

    const bone = colors.border;
    const boneMuted = colors.muted;
    const highlight = 'rgba(255,255,255,0.55)';

    useEffect(() => {
        const loop = Animated.loop(
            Animated.timing(shine, {
                toValue: 1,
                duration: 1350,
                easing: Easing.inOut(Easing.quad),
                useNativeDriver: true,
            }),
        );
        loop.start();
        return () => loop.stop();
    }, [shine]);

    const sweep = WIN_W * 1.15;
    const translateX = useMemo(
        () =>
            shine.interpolate({
                inputRange: [0, 1],
                outputRange: I18nManager.isRTL ? [sweep * 0.35, -sweep] : [-sweep, sweep * 0.35],
            }),
        [shine, sweep],
    );

    return (
        <View style={styles.container}>
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <View key={i} style={styles.item}>
                    <View style={styles.imageRing}>
                        <ShimmerBone
                            height={64}
                            width={64}
                            borderRadius={32}
                            baseColor={boneMuted}
                            highlight={highlight}
                            translateX={translateX}
                        />
                    </View>
                    <ShimmerBone
                        height={10}
                        width={48}
                        borderRadius={BorderRadius.md}
                        baseColor={bone}
                        highlight={highlight}
                        translateX={translateX}
                        style={styles.label}
                    />
                </View>
            ))}
        </View>
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
    label: {
        marginTop: 6,
    },
});

export default SubCategoriesSkeleton;
