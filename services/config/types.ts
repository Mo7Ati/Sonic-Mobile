import type { OnboardingSlide } from "@/services/onboarding/types";

export interface CustomPage {
    title: string;
    content: string;
}

export interface PlatformConfig {
    onboardingSlides: OnboardingSlide[];
    customPages: CustomPage[];
}
