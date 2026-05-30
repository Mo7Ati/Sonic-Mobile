import { IMAGE_BLURHASH } from "@/constants/placeholders";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image, type ImageProps } from "expo-image";
import { memo } from "react";
import { StyleProp, StyleSheet, View, type ImageStyle } from "react-native";

type RemoteImageProps = {
  uri: string | null | undefined;
  recyclingKey: string;
  style?: StyleProp<ImageStyle>;
  contentFit?: ImageProps["contentFit"];
  priority?: ImageProps["priority"];
  placeholderIcon?: keyof typeof Ionicons.glyphMap;
  transition?: number;
};

function RemoteImage({
  uri,
  recyclingKey,
  style,
  contentFit = "cover",
  priority = "low",
  placeholderIcon = "image-outline",
  transition = 150,
}: RemoteImageProps) {
  if (!uri) {
    return (
      <View style={[styles.fallback, style]}>
        <Ionicons name={placeholderIcon} size={22} color={Colors.mutedForeground} />
      </View>
    );
  }

  return (
    <Image
      source={uri}
      style={style}
      contentFit={contentFit}
      cachePolicy="memory-disk"
      recyclingKey={recyclingKey}
      priority={priority}
      transition={transition}
      placeholder={{ blurhash: IMAGE_BLURHASH }}
      placeholderContentFit="cover"
    />
  );
}

export default memo(RemoteImage);

const styles = StyleSheet.create({
  fallback: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.muted,
  },
});
