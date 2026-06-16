import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { DesignSystem } from '@/constants/design-system';
import { Button } from './button';
import { Input } from './input';
import { Card } from './card';
import { Heart, Mail, Lock, CheckCircle2, AlertCircle, Eye, EyeOff, Search } from 'lucide-react-native';

export function DesignSystemShowcase({ onClose }: { onClose?: () => void }) {
  const [inputText, setInputText] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [inputError, setInputError] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Design System Showcase</Text>
          <Text style={styles.headerSubtitle}>JeevaLink Premium UI kit</Text>
        </View>
        {onClose && (
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Style & Philosophy */}
        <Card>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.bodyText}>
            Style: <Text style={styles.bold}>{DesignSystem.style}</Text>
          </Text>
          <Text style={styles.bodyText}>
            Platforms: <Text style={styles.bold}>{DesignSystem.platform.join(', ')}</Text>
          </Text>
        </Card>

        {/* Color Swatches */}
        <Text style={styles.groupTitle}>Colors</Text>
        <Card>
          <View style={styles.colorGrid}>
            {Object.entries(DesignSystem.colors).map(([name, hex]) => (
              <View key={name} style={styles.colorItem}>
                <View style={[styles.colorSwatch, { backgroundColor: hex }]} />
                <Text style={styles.colorLabel}>{name}</Text>
                <Text style={styles.colorHex}>{hex}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Typography */}
        <Text style={styles.groupTitle}>Typography (Inter)</Text>
        <Card>
          <View style={styles.typoContainer}>
            <View style={styles.typoRow}>
              <Text style={styles.captionLabel}>Headline (32px, Bold)</Text>
              <Text style={styles.headlineText}>JeevaLink App</Text>
            </View>

            <View style={styles.typoRow}>
              <Text style={styles.captionLabel}>Title (24px, Semibold)</Text>
              <Text style={styles.titleText}>Blood Request Details</Text>
            </View>

            <View style={styles.typoRow}>
              <Text style={styles.captionLabel}>Subtitle (18px, Medium)</Text>
              <Text style={styles.subtitleText}>Available Donors Nearby</Text>
            </View>

            <View style={styles.typoRow}>
              <Text style={styles.captionLabel}>Body (16px, Regular)</Text>
              <Text style={styles.bodyText}>
                Every donation saves lives. Please share or respond if you match the blood group request.
              </Text>
            </View>

            <View style={styles.typoRow}>
              <Text style={styles.captionLabel}>Caption (12px, Regular)</Text>
              <Text style={styles.captionText}>90-day cooldown period applies after donation.</Text>
            </View>
          </View>
        </Card>

        {/* Buttons */}
        <Text style={styles.groupTitle}>Buttons (48px height, 12px radius)</Text>
        <Card>
          <View style={styles.demoContainer}>
            <Text style={styles.captionLabel}>Primary (Filled)</Text>
            <Button
              label="Primary CTA Button"
              variant="primary"
              onPress={() => alert('Primary Pressed!')}
            />

            <View style={styles.spacingBox} />

            <Text style={styles.captionLabel}>Primary with Left Icon</Text>
            <Button
              label="Donate Now"
              variant="primary"
              leftIcon={<Heart color="#FFFFFF" size={18} fill="#FFFFFF" />}
              onPress={() => alert('Left Icon Pressed!')}
            />

            <View style={styles.spacingBox} />

            <Text style={styles.captionLabel}>Secondary (Outlined)</Text>
            <Button
              label="Cancel / Back"
              variant="secondary"
              onPress={() => alert('Secondary Pressed!')}
            />

            <View style={styles.spacingBox} />

            <Text style={styles.captionLabel}>Secondary with Right Icon</Text>
            <Button
              label="Search Donors"
              variant="secondary"
              rightIcon={<Search color={DesignSystem.colors.text_primary} size={18} />}
              onPress={() => alert('Right Icon Pressed!')}
            />

            <View style={styles.spacingBox} />

            <Text style={styles.captionLabel}>Loading State</Text>
            <Button label="Submitting..." loading variant="primary" />

            <View style={styles.spacingBox} />

            <Text style={styles.captionLabel}>Disabled State</Text>
            <Button label="Unavailable" disabled variant="primary" />
          </View>
        </Card>

        {/* Input Fields */}
        <Text style={styles.groupTitle}>Inputs (52px height, Top Label)</Text>
        <Card>
          <View style={styles.demoContainer}>
            <Input
              label="Standard Email Input"
              placeholder="Enter your email"
              value={inputText}
              onChangeText={setInputText}
              leftIcon={<Mail color={DesignSystem.colors.text_secondary} size={18} />}
            />

            <Input
              label="Password Input (Toggle Visibility)"
              placeholder="Enter password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              leftIcon={<Lock color={DesignSystem.colors.text_secondary} size={18} />}
              rightIcon={
                showPassword ? (
                  <EyeOff color={DesignSystem.colors.text_secondary} size={18} />
                ) : (
                  <Eye color={DesignSystem.colors.text_secondary} size={18} />
                )
              }
              onRightIconPress={() => setShowPassword(!showPassword)}
            />

            <Input
              label="Success State Input"
              placeholder="Valid username"
              value="jeeva_lifesaver"
              success
              leftIcon={<CheckCircle2 color={DesignSystem.colors.success} size={18} />}
            />

            <Input
              label="Error State Input"
              placeholder="Enter phone number"
              value="12345"
              error="Phone number must be at least 10 digits"
              leftIcon={<AlertCircle color={DesignSystem.colors.error} size={18} />}
            />
          </View>
        </Card>

        {/* Grid and Spacing Rules */}
        <Text style={styles.groupTitle}>Spacing Rules</Text>
        <Card>
          {DesignSystem.design_rules.map((rule, idx) => (
            <View key={idx} style={styles.ruleItem}>
              <View style={styles.ruleBullet} />
              <Text style={styles.ruleText}>{rule}</Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: DesignSystem.grid.container_padding, // 16px
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: DesignSystem.colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: DesignSystem.typography.title.size, // 24px
    fontWeight: DesignSystem.typography.title.weight, // 600
    color: DesignSystem.colors.text_primary,
  },
  headerSubtitle: {
    fontSize: DesignSystem.typography.caption.size, // 12px
    fontWeight: DesignSystem.typography.caption.weight, // 400
    color: DesignSystem.colors.text_secondary,
    marginTop: 2,
  },
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: DesignSystem.colors.surface,
    borderWidth: 1,
    borderColor: DesignSystem.colors.border,
  },
  closeButtonText: {
    color: DesignSystem.colors.text_primary,
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    padding: DesignSystem.grid.container_padding, // 16px
    paddingBottom: 40,
  },
  groupTitle: {
    fontSize: DesignSystem.typography.subtitle.size, // 18px
    fontWeight: DesignSystem.typography.headline.weight, // 700
    color: DesignSystem.colors.text_primary,
    marginTop: DesignSystem.grid.section_gap, // 24px
    marginBottom: DesignSystem.grid.card_gap, // 12px
  },
  sectionTitle: {
    fontSize: DesignSystem.typography.subtitle.size,
    fontWeight: DesignSystem.typography.title.weight,
    color: DesignSystem.colors.text_primary,
    marginBottom: 12,
  },
  bold: {
    fontWeight: '600',
    color: DesignSystem.colors.text_primary,
  },
  bodyText: {
    fontSize: DesignSystem.typography.body.size,
    fontWeight: DesignSystem.typography.body.weight,
    color: DesignSystem.colors.text_secondary,
    lineHeight: 22,
    marginBottom: 8,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  colorItem: {
    width: '48%',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  colorSwatch: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 6,
  },
  colorLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: DesignSystem.colors.text_primary,
  },
  colorHex: {
    fontSize: 11,
    color: DesignSystem.colors.text_secondary,
    fontFamily: 'monospace',
    marginTop: 1,
  },
  typoContainer: {
    gap: 16,
  },
  typoRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 12,
  },
  captionLabel: {
    fontSize: 12,
    color: DesignSystem.colors.text_secondary,
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headlineText: {
    fontSize: DesignSystem.typography.headline.size, // 32px
    fontWeight: DesignSystem.typography.headline.weight, // 700
    color: DesignSystem.colors.text_primary,
  },
  titleText: {
    fontSize: DesignSystem.typography.title.size, // 24px
    fontWeight: DesignSystem.typography.title.weight, // 600
    color: DesignSystem.colors.text_primary,
  },
  subtitleText: {
    fontSize: DesignSystem.typography.subtitle.size, // 18px
    fontWeight: DesignSystem.typography.subtitle.weight, // 500
    color: DesignSystem.colors.text_primary,
  },
  captionText: {
    fontSize: DesignSystem.typography.caption.size, // 12px
    fontWeight: DesignSystem.typography.caption.weight, // 400
    color: DesignSystem.colors.text_secondary,
  },
  demoContainer: {
    width: '100%',
  },
  spacingBox: {
    height: 16,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ruleBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: DesignSystem.colors.primary,
    marginRight: 10,
  },
  ruleText: {
    fontSize: 14,
    color: DesignSystem.colors.text_primary,
  },
});
