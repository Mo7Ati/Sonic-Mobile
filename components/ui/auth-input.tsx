import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  type TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { BorderRadius, Colors, Spacing } from '@/constants/theme';

interface AuthInputProps extends TextInputProps {
  label: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
}

export function AuthInput({
  label,
  error,
  icon,
  isPassword,
  style,
  ...props
}: AuthInputProps) {
  const [focused, setFocused] = useState(false);
  const [secureEntry, setSecureEntry] = useState(isPassword);

  const iconColor = error
    ? Colors.destructive
    : focused
      ? Colors.foreground
      : Colors.placeholder;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputWrapper,
          focused && styles.inputWrapperFocused,
          error ? styles.inputWrapperError : null,
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={iconColor}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={Colors.placeholder}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={secureEntry}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        {isPassword && (
          <Pressable
            onPress={() => setSecureEntry((v) => !v)}
            style={styles.eyeButton}
            hitSlop={Spacing.sm}
          >
            <Ionicons
              name={secureEntry ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={Colors.placeholder}
            />
          </Pressable>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.secondaryForeground,
    marginBottom: Spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.secondary,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.muted,
    paddingHorizontal: Spacing.md,
    minHeight: 50,
  },
  inputWrapperFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.background,
  },
  inputWrapperError: {
    borderColor: Colors.destructive,
    backgroundColor: Colors.surfaceError,
  },
  icon: {
    marginEnd: Spacing.sm + Spacing.xs,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.foreground,
    paddingVertical: Spacing.tight,
    textAlign: 'auto',
  },
  eyeButton: {
    marginStart: Spacing.sm,
    padding: Spacing.xs,
  },
  errorText: {
    fontSize: 12,
    color: Colors.destructive,
    marginTop: Spacing.xs,
    marginStart: 2,
  },
});
