import {
  Cairo_400Regular,
  Cairo_500Medium,
  Cairo_600SemiBold,
  Cairo_700Bold,
} from "@expo-google-fonts/cairo";

/** Pass to `useFonts` from `expo-font`. */
export const CairoFontsToLoad = {
  Cairo_400Regular,
  Cairo_500Medium,
  Cairo_600SemiBold,
  Cairo_700Bold,
};

/** Post-load fontFamily names */
export const FontFamily = {
  regular: "Cairo_400Regular",
  medium: "Cairo_500Medium",
  semiBold: "Cairo_600SemiBold",
  bold: "Cairo_700Bold",
} as const;