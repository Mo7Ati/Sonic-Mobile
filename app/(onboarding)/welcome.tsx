import Svg, { Path } from 'react-native-svg';
import { BorderRadius, Colors, Spacing } from "@/constants/theme";
import { FontFamily } from "@/constants/fonts";
import { useOnboardingSlides } from "@/hooks/react-query-hooks/use-config";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, ActivityIndicator, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import Animated, {
    Extrapolation,
    interpolate,
    type SharedValue,
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";
import Carousel, { type ICarouselInstance } from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppPrefsStore } from '@/stores/app-prefs-store';

export default function OnboardingSlidesScreen() {
    const { t } = useTranslation("onboarding");
    const router = useRouter();
    const carouselRef = useRef<ICarouselInstance>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const progress = useSharedValue(0);
    const { width, height } = useWindowDimensions();

    const { setOnboardingCompleted } = useAppPrefsStore();

    const slides = useOnboardingSlides();
    const isRTL = I18nManager.isRTL;

    const nextLabelStyle = useAnimatedStyle(() => {
        const lastIndex = slides.length - 1;
        return {
            opacity: interpolate(
                progress.value,
                [lastIndex - 0.6, lastIndex - 0.3],
                [1, 0],
                Extrapolation.CLAMP,
            ),
        };
    });

    const getStartedLabelStyle = useAnimatedStyle(() => {
        const lastIndex = slides.length - 1;
        return {
            opacity: interpolate(
                progress.value,
                [lastIndex - 0.6, lastIndex - 0.3],
                [0, 1],
                Extrapolation.CLAMP,
            ),
        };
    });

    const skip = () => {
        setOnboardingCompleted(true);
        router.replace("/login");
    };

    const goNext = () => {
        const lastIndex = slides.length - 1;
        if (progress.value >= lastIndex - 0.3) {
            setOnboardingCompleted(true);
            router.replace("/login");
            return;
        }
        carouselRef.current?.next();
    };

    // if (slides.length === 0) {
    //     return (
    //         <View style={styles.center}>
    //             <ActivityIndicator size="large" color={Colors.primary} />
    //         </View>
    //     );
    // }

    const screenBg = slides[activeIndex]?.background_color || "#FFF7ED";

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: screenBg }]}>
            <Svg
                width="100%"
                height={180}
                viewBox="0 0 1440 320"
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                }}
                preserveAspectRatio="none"
            >
                <Path
                    fill={Colors.primary}
                    fillOpacity={0.6}
                    d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                />
            </Svg>
            <Carousel
                ref={carouselRef}
                width={width}
                height={height * 0.72}
                data={slides}
                loop={false}
                pagingEnabled
                snapEnabled
                onSnapToItem={setActiveIndex}
                onProgressChange={(_, absoluteProgress) => {
                    progress.value = absoluteProgress;
                }}
                renderItem={({ item }) => (
                    <View style={styles.slide}>
                        <Image
                            source={{ uri: item.image }}
                            style={styles.image}
                            contentFit="contain"
                            transition={200}
                        />
                        <Text style={[styles.title, isRTL && styles.rtlText]}>
                            {item.title}
                        </Text>

                        <Text style={[styles.description, isRTL && styles.rtlText]}>
                            {item.description}
                        </Text>
                    </View>
                )}
            />

            <View style={styles.footer}>
                <Pressable
                    onPress={skip}
                    hitSlop={12}
                    style={({ pressed }) => [styles.skipButton, pressed && styles.skipButtonPressed]}
                >
                    <Text style={styles.skipButtonText}>
                        {t("slides.skip")}
                    </Text>
                </Pressable>

                <View style={styles.dotsContainer}>
                    {slides.map((_, index) => (
                        <AnimatedDot key={index} index={index} progress={progress} />
                    ))}
                </View>

                <Pressable
                    onPress={goNext}
                    hitSlop={12}
                    style={({ pressed }) => [
                        styles.nextButton,
                        pressed && styles.nextButtonPressed,
                    ]}
                >
                    <Animated.Text style={[styles.nextButtonText, getStartedLabelStyle]}>
                        {t("slides.get_started")}
                    </Animated.Text>
                    <Animated.Text
                        style={[styles.nextButtonText, styles.nextLabelOverlay, nextLabelStyle]}
                    >
                        {t("slides.next")}
                    </Animated.Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

function AnimatedDot({
    index,
    progress,
}: {
    index: number;
    progress: SharedValue<number>;
}) {
    const animatedStyle = useAnimatedStyle(() => {
        const width = interpolate(
            progress.value,
            [index - 1, index, index + 1],
            [8, 28, 8],
            Extrapolation.CLAMP
        );

        const opacity = interpolate(
            progress.value,
            [index - 1, index, index + 1],
            [0.3, 1, 0.3],
            Extrapolation.CLAMP
        );

        return {
            width,
            opacity,
        };
    });

    return <Animated.View style={[styles.dot, animatedStyle]} />;
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
    },

    slide: {
        width: "100%",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: Spacing.gutter,
    },

    image: {
        width: "88%",
        height: "58%",
        marginBottom: Spacing.lg,
    },

    title: {
        fontSize: 34,
        lineHeight: 42,
        fontFamily: FontFamily.bold,
        color: "#1F2937",
        textAlign: "center",
        marginBottom: Spacing.sm,
    },

    description: {
        fontSize: 16,
        lineHeight: 26,
        fontFamily: FontFamily.regular,
        color: "#6B7280",
        textAlign: "center",
        paddingHorizontal: Spacing.sm,
    },

    rtlText: {
        writingDirection: "rtl",
    },

    footer: {
        marginTop: "auto",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: Spacing.gutter,
        paddingBottom: Spacing.lg,
        paddingTop: Spacing.md,
    },

    dotsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: Spacing.sm,
    },

    skipButton: {
        paddingVertical: Spacing.xs,
        paddingHorizontal: Spacing.sm,
        minWidth: 72,
    },

    skipButtonPressed: {
        opacity: 0.5,
    },

    skipButtonText: {
        fontSize: 15,
        fontFamily: FontFamily.medium,
        color: Colors.mutedForeground,
        letterSpacing: 0.2,
    },

    nextButton: {
        minWidth: 72,
        height: 30,
        paddingVertical: Spacing.xs,
        paddingHorizontal: Spacing.sm,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.28,
        shadowRadius: 12,
        elevation: 6,
    },

    nextButtonPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.97 }],
    },

    nextButtonText: {
        fontSize: 15,
        fontFamily: FontFamily.semiBold,
        color: Colors.mutedForeground,
        letterSpacing: 0.3,
        textAlign: "center",
    },

    nextLabelOverlay: {
        position: "absolute",
        left: 0,
        right: 0,
    },

    dot: {
        height: 8,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.primary,
    },

    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.background,
    },
});