// // app/onboarding.tsx
// import { AuthButton } from "@/components/ui/auth-button";
// import {
//     BorderRadius,
//     Colors,
//     Spacing,
// } from "@/constants/theme";
// import { FontFamily } from "@/constants/fonts";
// import { useOnboardingSlides } from "@/stores/platform-config-store";
// import { Image } from "expo-image";
// import { useRouter } from "expo-router";
// import { useRef, useState } from "react";
// import { useTranslation } from "react-i18next";
// import {
//     ActivityIndicator,
//     Button,
//     I18nManager,
//     Pressable,
//     StyleSheet,
//     Text,
//     useWindowDimensions,
//     View,
// } from "react-native";
// import Carousel, { type ICarouselInstance } from "react-native-reanimated-carousel";
// import { SafeAreaView } from "react-native-safe-area-context";

// export default function OnboardingSlidesScreen() {
//     const { t } = useTranslation("onboarding");
//     const router = useRouter();
//     const carouselRef = useRef<ICarouselInstance>(null);
//     const [activeIndex, setActiveIndex] = useState(0);
//     const { width, height } = useWindowDimensions();

//     const slides = useOnboardingSlides();
//     const isRTL = I18nManager.isRTL;

//     if (slides.length === 0) {
//         return (
//             <View style={styles.center}>
//                 <ActivityIndicator size="large" color={Colors.primary} />
//             </View>
//         );
//     }

//     const isLast = activeIndex === slides.length - 1;
//     const currentSlide = slides[activeIndex];
//     const screenBg = currentSlide.background_color || Colors.background;

//     const goNext = () => {
//         if (isLast) {
//             router.replace("/login");
//             return;
//         }

//         carouselRef.current?.next();
//     };

//     const skip = () => {
//         router.replace("/login");
//     };

//     return (
//         <SafeAreaView style={[styles.safe, { backgroundColor: screenBg }]}>
//             <Carousel
//                 ref={carouselRef}
//                 width={width}
//                 height={height * 0.62}
//                 data={slides}
//                 loop={false}
//                 pagingEnabled
//                 snapEnabled
//                 onSnapToItem={setActiveIndex}
//                 renderItem={({ item }) => (
//                     <View style={styles.slide}>
//                         <Image
//                             source={{ uri: item.image }}
//                             style={styles.image}
//                             contentFit="contain"
//                             transition={200}
//                         />

//                         <Text style={[styles.title, isRTL && styles.rtlText]}>
//                             {item.title}
//                         </Text>

//                         <Text style={[styles.description, isRTL && styles.rtlText]}>
//                             {item.description}
//                         </Text>
//                     </View>
//                 )}
//             />

//             <View style={styles.footer}>
//                 <View style={styles.dotsContainer}>
//                     {slides.map((_, index) => (
//                         <View
//                             key={index}
//                             style={[
//                                 styles.dot,
//                                 activeIndex === index && styles.activeDot,
//                             ]}
//                         />
//                     ))}
//                 </View>
//             </View>
//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     safe: {
//         flex: 1,
//     },

//     topBar: {
//         height: 44,
//         alignItems: "flex-end",
//         justifyContent: "center",
//         paddingHorizontal: Spacing.gutter,
//     },

//     skipButton: {
//         paddingVertical: Spacing.xs,
//         paddingHorizontal: Spacing.sm,
//     },

//     skipText: {
//         fontSize: 15,
//         fontFamily: FontFamily.semiBold,
//         color: Colors.foreground,
//     },

//     slide: {
//         width: "100%",
//         flex: 1,
//         alignItems: "center",
//         justifyContent: "center",
//         paddingHorizontal: Spacing.gutter,
//     },

//     image: {
//         width: "88%",
//         height: "58%",
//         marginBottom: Spacing.lg,
//     },

//     title: {
//         fontSize: 34,
//         lineHeight: 42,
//         fontFamily: FontFamily.bold,
//         color: "#1F2937",
//         textAlign: "center",
//         marginBottom: Spacing.sm,
//     },

//     description: {
//         fontSize: 16,
//         lineHeight: 26,
//         fontFamily: FontFamily.regular,
//         color: "#6B7280",
//         textAlign: "center",
//         paddingHorizontal: Spacing.sm,
//     },

//     rtlText: {
//         writingDirection: "rtl",
//     },

//     footer: {
//         marginTop: "auto",
//         paddingHorizontal: Spacing.gutter,
//         paddingBottom: Spacing.lg,
//         paddingTop: Spacing.md,
//     },

//     dotsContainer: {
//         flexDirection: "row",
//         justifyContent: "center",
//         alignItems: "center",
//         gap: Spacing.sm,
//         marginBottom: Spacing.lg,
//     },

//     dot: {
//         width: 8,
//         height: 8,
//         borderRadius: BorderRadius.full,
//         backgroundColor: Colors.border,
//     },

//     activeDot: {
//         width: 28,
//         backgroundColor: Colors.primary,
//     },

//     cta: {
//         // alignItems: "center",
//         backgroundColor: Colors.primary,
//         marginTop: Spacing.xs,
//         paddingVertical: Spacing.sm,
//         paddingHorizontal: Spacing.md,
//         borderRadius: BorderRadius.full,
//     },

//     ctaButtonText: {
//         fontSize: 16,
//         fontFamily: FontFamily.semiBold,
//         color: "#FFFFFF",
//     },

//     center: {
//         flex: 1,
//         alignItems: "center",
//         justifyContent: "center",
//         backgroundColor: Colors.background,
//     },
// });



// app/onboarding.tsx
import { BorderRadius, Colors, Spacing } from "@/constants/theme";
import { FontFamily } from "@/constants/fonts";
import { useOnboardingSlides } from "@/stores/platform-config-store";
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

export default function OnboardingSlidesScreen() {
    const { t } = useTranslation("onboarding");
    const router = useRouter();
    const carouselRef = useRef<ICarouselInstance>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const progress = useSharedValue(0);
    const { width, height } = useWindowDimensions();

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
        router.replace("/login");
    };

    const goNext = () => {
        const lastIndex = slides.length - 1;
        if (progress.value >= lastIndex - 0.3) {
            router.replace("/login");
            return;
        }
        carouselRef.current?.next();
    };

    if (slides.length === 0) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    const screenBg = slides[activeIndex]?.background_color || "#FFF7ED";

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: screenBg }]}>
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
        paddingHorizontal: Spacing.lg,
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