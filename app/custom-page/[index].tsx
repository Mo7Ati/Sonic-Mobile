import { BackButton } from '@/components/ui/back-button';
import { Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useCustomPages } from '@/hooks/react-query-hooks/use-config';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CustomPageScreen() {
    const { colors, font } = useAppTheme();
    const router = useRouter();
    const { index } = useLocalSearchParams<{ index: string }>();
    const customPages = useCustomPages();

    const pageIndex = Number(index);
    const page = Number.isInteger(pageIndex) ? customPages[pageIndex] : undefined;

    useEffect(() => {
        if (!page) {
            router.back();
        }
    }, [page, router]);

    if (!page) {
        return null;
    }

    return (
        <SafeAreaView
            style={[styles.screen, { backgroundColor: colors.background }]}
            edges={['top']}
        >
            <View style={styles.header}>
                <BackButton />
                <Text
                    style={[styles.headerTitle, { color: colors.foreground, fontFamily: font.bold }]}
                    numberOfLines={1}
                >
                    {page.title}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <Text style={[styles.body, { color: colors.foreground, fontFamily: font.regular }]}>
                    {page.content}
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.gutter,
        paddingVertical: Spacing.tight,
    },
    headerTitle: {
        flex: 1,
        fontSize: 18,
        textAlign: 'center',
        marginHorizontal: Spacing.sm,
    },
    headerSpacer: { width: 38 },
    content: {
        paddingHorizontal: Spacing.gutter,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.xl,
    },
    body: {
        fontSize: 15,
        lineHeight: 24,
    },
});
