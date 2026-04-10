import { Branch } from "@/services/branch/types";
import { useThemeColors } from "@/hooks/use-theme-color";
import { Pressable, View, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@react-navigation/elements";


const CARD_WIDTH = 272;

const BranchCard = ({
  item,
  onPress,
  fullWidth = false,
}: {
  item: Branch;
  onPress?: () => void;
  fullWidth?: boolean;
}) => {
  const colors = useThemeColors();

  const cardShadow = {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  };

  const feeLabel = 15;
  // item.delivery_fee === undefined || item.delivery_fee === null
  //   ? null
  //   : item.delivery_fee === 0
  //     ? 'Free'
  //     : `$${item.delivery_fee.toFixed(2)}`;

  const ratingText = "4.5";
  // item.rating != null
  //     ? item.ratings_count != null
  //         ? `${item.rating.toFixed(1)} (${item.ratings_count})`
  //         : item.rating.toFixed(1)
  //     : null;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        fullWidth && styles.cardFullWidth,
        { backgroundColor: colors.card, borderColor: colors.border },
        cardShadow,
        pressed && styles.cardPressed,
      ]}>
      <View style={styles.cardRow}>
        <View style={[styles.logoWrap, { backgroundColor: colors.muted }]}>
          {item.logo ? (
            <Image source={{ uri: item.logo }} style={styles.logo} resizeMode="cover" />
          ) : (
            <Ionicons name="storefront-outline" size={22} color={colors.mutedForeground} />
          )}
        </View>
        <View style={styles.cardTextCol}>
          <Text style={[styles.storeName, { color: colors.foreground }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.branchName, { color: colors.mutedForeground }]} numberOfLines={1}>
            {item.name}
          </Text>
        </View>
      </View>

      <View style={[styles.metaRow, { borderTopColor: colors.border }]}>
        {ratingText ? (
          <View style={styles.metaItem}>
            <Ionicons name="star" size={12} color={colors.primary} />
            <Text style={[styles.metaText, { color: colors.foreground }]}>{ratingText}</Text>
          </View>
        ) : null}
        {item.delivery_time ? (
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={12} color={colors.primary} />
            <Text style={[styles.metaText, { color: colors.mutedForeground }]} numberOfLines={1}>
              {item.delivery_time}
            </Text>
          </View>
        ) : null}
        {feeLabel ? (
          <View style={styles.metaItem}>
            <Ionicons name="bicycle-outline" size={12} color={colors.primary} />
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{feeLabel}</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
};

export default BranchCard;

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  listContent: {
    paddingLeft: 20,
    paddingRight: 8,
  },
  card: {
    width: CARD_WIDTH,
    marginRight: 12,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 12,
    overflow: 'hidden',
  },
  cardFullWidth: {
    width: '100%',
    marginRight: 0,
  },
  cardPressed: {
    opacity: 0.92,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  logoWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
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
    gap: 4,
    justifyContent: 'center',
    minWidth: 0,
  },
  storeName: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 2,
  },
  branchName: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4,
  },
  address: {
    fontSize: 12,
    lineHeight: 16,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    fontWeight: '500',
  },
});
