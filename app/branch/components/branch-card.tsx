import { Branch } from "@/services/branch/types";
import { BorderRadius, Spacing } from "@/constants/theme";
import { Pressable, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@react-navigation/elements";
import { Colors } from "@/constants/theme";
import { Image } from "expo-image";


const CARD_WIDTH = 325;

const BranchCard = ({ item, onPress }: {
  item: Branch; onPress?: () => void;
}) => {
  const cardShadow = {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  };

  const ratingText = "4.5";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: Colors.card, borderColor: Colors.border },
        cardShadow,
        pressed && styles.cardPressed,
      ]}>
      <View style={styles.cardRow}>

        {/* Logo */}
        <View style={[styles.logoWrap, { backgroundColor: Colors.muted }]}>
          {item.logo ? (
            <Image source={{ uri: item.logo }} style={styles.logo} resizeMode="cover" />
          ) : (
            <Ionicons name="storefront-outline" size={22} color={Colors.mutedForeground} />
          )}
        </View>


        {/*  Branch Name */}
        <View style={styles.cardTextCol}>
          <Text style={[styles.storeName, { color: Colors.foreground }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.branchName, { color: Colors.mutedForeground }]} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
      </View>

      {/*  Meta Row */}
      <View style={[styles.metaRow, { borderTopColor: Colors.border }]}>
        {/* Rating */}
        {ratingText ? (
          <View style={styles.metaItem}>
            <Ionicons name="star" size={12} color={Colors.primary} />
            <Text style={[styles.metaText, { color: Colors.foreground }]}>{ratingText}</Text>
          </View>
        ) : null}

        {/* prepare time */}
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={12} color={Colors.primary} />
          <Text style={[styles.metaText, { color: Colors.foreground }]}>20-30 min</Text>
        </View>

        {/* delivery type */}
        <View style={styles.metaItem}>
          <Ionicons name="bicycle-outline" size={12} color={Colors.primary} />
          <Text style={[styles.metaText, { color: Colors.foreground }]}>حمامة</Text>
        </View>

        {/* Status */}
        {item.status ? (
          <View style={[styles.metaItem, { backgroundColor: item.status.backgroundColor, paddingHorizontal: Spacing.sm }]}>
            {/* <Ionicons name="time-outline" size={12} /> */}
            <Text style={[styles.metaText, { color: item.status.textColor }]} numberOfLines={1}>
              {item.status.label}
            </Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
};

export default BranchCard;

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.md,
  },
  listContent: {
    paddingStart: Spacing.gutter,
    paddingEnd: Spacing.sm,
  },
  card: {
    width: CARD_WIDTH,
    marginEnd: Spacing.tight,
    borderRadius: BorderRadius["2xl"],
    borderWidth: 1,
    padding: Spacing.sm + Spacing.xs,
    overflow: 'hidden',
  },
  cardFullWidth: {
    width: '100%',
    marginEnd: 0,
  },
  cardPressed: {
    opacity: 0.92,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm + Spacing.xs,
  },
  logoWrap: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  cardTextCol: {
    flex: 1,
    gap: Spacing.xs,
    justifyContent: 'center',
    minWidth: 0,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
    textAlign: 'left',
  },
  branchName: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: Spacing.xs,
    textAlign: 'left',
  },
  address: {
    fontSize: 12,
    lineHeight: 16,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm + Spacing.xs,
    marginTop: Spacing.sm + Spacing.xs,
    paddingTop: Spacing.sm + Spacing.xs,
    borderTopWidth: 1,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius["2xl"],
    gap: Spacing.xs,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
