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
            color={error ? '#dc2626' : focused ? '#0a7ea4' : '#9ca3af'}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor="#9ca3af"
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
            hitSlop={8}
          >
            <Ionicons
              name={secureEntry ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#9ca3af"
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
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    paddingHorizontal: 14,
    minHeight: 50,
  },
  inputWrapperFocused: {
    borderColor: '#0a7ea4',
    backgroundColor: '#fff',
  },
  inputWrapperError: {
    borderColor: '#dc2626',
    backgroundColor: '#fef2f2',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 12,
  },
  eyeButton: {
    marginLeft: 8,
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#dc2626',
    marginTop: 4,
    marginLeft: 2,
  },
});
