import { useBranchDetail } from "@/hooks/react-query-hooks/use-branch-detail";
import { useCallback, useMemo, useRef, useState } from "react";
import { ScrollView } from "react-native";

export function useBranchPage(branchId: number) {
    const { data: branch, isPending, error } = useBranchDetail(branchId);
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [showCompactHeader, setShowCompactHeader] = useState(false);
    const [showFloatingTabs, setShowFloatingTabs] = useState(false);
    const scrollRef = useRef<ScrollView>(null);

    const sectionRelativeOffsets = useRef<Record<number, number>>({});
    const sectionsContainerY = useRef(0);
    const inlineTabsY = useRef(0);
    const compactHeaderHeight = useRef(0);

    const categories = useMemo(() => branch?.categories ?? [], [branch]);

    const getAbsoluteOffset = useCallback((index: number): number | undefined => {
        const relY = sectionRelativeOffsets.current[index];
        if (relY == null) return undefined;
        return sectionsContainerY.current + relY;
    }, []);

    const isTabPressScrolling = useRef(false);
    const tabPressTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

    const handleTabPress = useCallback((index: number) => {
        setActiveTabIndex(index);

        isTabPressScrolling.current = true;
        clearTimeout(tabPressTimer.current);
        tabPressTimer.current = setTimeout(() => {
            isTabPressScrolling.current = false;
        }, 600);

        const absOffset = getAbsoluteOffset(index);
        if (absOffset != null) {
            const headerH = compactHeaderHeight.current || 110;
            scrollRef.current?.scrollTo({ y: absOffset - headerH, animated: true });
        }
    }, [getAbsoluteOffset]);

    const registerSectionOffset = useCallback((index: number, y: number) => {
        sectionRelativeOffsets.current[index] = y;
    }, []);

    const registerSectionsContainerY = useCallback((y: number) => {
        sectionsContainerY.current = y;
    }, []);

    const registerInlineTabsY = useCallback((y: number) => {
        inlineTabsY.current = y;
    }, []);

    const registerCompactHeaderHeight = useCallback((h: number) => {
        compactHeaderHeight.current = h;
    }, []);

    const handleScroll = useCallback((offsetY: number) => {
        const tabsThreshold = inlineTabsY.current > 0 ? inlineTabsY.current : 180;
        setShowFloatingTabs(offsetY > tabsThreshold);
        setShowCompactHeader(offsetY > tabsThreshold);

        if (isTabPressScrolling.current) return;

        const headerH = compactHeaderHeight.current || 110;
        const indices = Object.keys(sectionRelativeOffsets.current)
            .map(Number)
            .sort((a, b) => a - b);

        let current = 0;
        for (const idx of indices) {
            const absOffset = sectionsContainerY.current + sectionRelativeOffsets.current[idx];
            if (offsetY >= absOffset - headerH - 20) {
                current = idx;
            } else {
                break;
            }
        }
        setActiveTabIndex(current);
    }, []);

    return {
        branch,
        isPending,
        error,
        categories,
        activeTabIndex,
        showCompactHeader,
        showFloatingTabs,
        scrollRef,
        handleTabPress,
        registerSectionOffset,
        registerSectionsContainerY,
        registerInlineTabsY,
        registerCompactHeaderHeight,
        handleScroll,
    };
}
