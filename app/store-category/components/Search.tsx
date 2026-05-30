import { Ionicons } from "@expo/vector-icons";
import { TextInput, View, TouchableOpacity, StyleProp, ViewStyle } from "react-native";
import { Colors, Spacing } from "@/constants/theme";

type Props = {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    onClear?: () => void;
    style?: StyleProp<ViewStyle>;
};

export default function SearchInput({
    value,
    onChangeText,
    placeholder = "Search...",
    onClear,
    style,
}: Props) {
    return (
        <View
            style={[
                {
                    height: 52,
                    borderRadius: 16,
                    backgroundColor: Colors.muted,
                    paddingHorizontal: Spacing.md,
                    paddingVertical: Spacing.md,
                    flexDirection: "row",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: Colors.border,
                }, style]}
        >
            <Ionicons name="search" size={20} color={Colors.mutedForeground} />

            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={Colors.mutedForeground}
                style={{
                    flex: 1,
                    marginHorizontal: 10,
                    fontSize: 15,
                    color: Colors.foreground,
                }}
            />

            {
                value.length > 0 && (
                    <TouchableOpacity onPress={onClear}>
                        <Ionicons name="close-circle" size={20} color={Colors.primary} />
                    </TouchableOpacity>
                )
            }
        </View >
    );
}