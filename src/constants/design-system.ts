/**
 * JeevaLink Design System Tokens — Premium v2
 * Codifying design system specifications for iOS and Android.
 */

export const DesignSystem = {
  style: 'Modern, clean, premium, scalable, mobile-first',
  platform: ['iOS', 'Android'] as const,

  grid: {
    columns: 4,
    base_spacing: 8,
    container_padding: 24,
    section_gap: 32,
    card_gap: 16,
  },

  layout_rules: {
    visual_hierarchy: 'Clean hierarchy',
    one_primary_action_per_screen: true,
    consistent_spacing: true,
    responsive: true,
    edge_alignment: true,
    avoid_clutter: true,
    thumb_friendly_navigation: true,
    less_elements_more_whitespace: true,
  },

  typography: {
    font_family: 'Inter',
    headline: {
      size: 28,
      weight: '700' as const,
    },
    title: {
      size: 20,
      weight: '600' as const,
    },
    subtitle: {
      size: 16,
      weight: '600' as const,
    },
    body: {
      size: 16,
      weight: '400' as const,
    },
    caption: {
      size: 13,
      weight: '400' as const,
    },
    line_height: 1.5,
  },

  colors: {
    primary: '#DC2626',       // Brand Color (JeevaLink Crimson)
    primaryDark: '#B91C1C',   // Darker crimson for gradients
    primaryLight: '#EF4444',  // Lighter crimson for gradients
    secondary: '#111111',     // Support Color (Text Primary)
    background: '#FAFAFA',    // Lightest Gray
    surface: '#FFFFFF',       // White Surface
    surfaceElevated: '#FFFFFF', // Elevated white card
    text_primary: '#0F172A',  // Slate 900
    text_secondary: '#64748B',// Slate 500
    text_tertiary: '#94A3B8', // Slate 400
    success: '#16A34A',       // Success Green
    successLight: '#ECFDF5',  // Success tint
    warning: '#D97706',       // Warning Amber
    warningLight: '#FFFBEB',  // Warning tint
    error: '#DC2626',         // Error Red
    errorLight: '#FEF2F2',    // Error tint
    border: '#EAEAEA',        // Light gray border
    borderSubtle: 'rgba(0,0,0,0.06)', // Ultra-subtle border
    // Medical blue accent
    medicalBlue: '#2563EB',
    medicalBlueLight: '#EFF6FF',
  },

  gradients: {
    heroRed: ['#EF4444', '#DC2626', '#B91C1C'] as const,
    heroCrimsonDeep: ['#DC2626', '#991B1B', '#7F1D1D'] as const,
    cardRed: ['#FEF2F2', '#FEE2E2'] as const,
    buttonPrimary: ['#EF4444', '#DC2626'] as const,
    successGreen: ['#ECFDF5', '#D1FAE5'] as const,
    warmAmber: ['#FFFBEB', '#FEF3C7'] as const,
    coolBlue: ['#EFF6FF', '#DBEAFE'] as const,
  },

  glass: {
    white: 'rgba(255,255,255,0.90)',
    whiteDense: 'rgba(255,255,255,0.96)',
    whiteSemi: 'rgba(255,255,255,0.75)',
    dark: 'rgba(15,23,42,0.7)',
    red: 'rgba(220,38,38,0.12)',
    // Border for glass elements
    border: 'rgba(255,255,255,0.5)',
    borderDark: 'rgba(0,0,0,0.06)',
  },

  elevation: {
    // 5-level elevation system
    e1: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 1,
    },
    e2: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    e3: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 4,
    },
    e4: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.10,
      shadowRadius: 24,
      elevation: 8,
    },
    e5: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.14,
      shadowRadius: 40,
      elevation: 16,
    },
    // Crimson glow shadows for brand elements
    crimsonGlow: {
      shadowColor: '#DC2626',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 12,
    },
    crimsonGlowStrong: {
      shadowColor: '#DC2626',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.35,
      shadowRadius: 28,
      elevation: 16,
    },
    // Floating nav shadow
    floatingNav: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.08,
      shadowRadius: 20,
      elevation: 20,
    },
  },

  animations: {
    duration: {
      fast: 150,
      normal: 250,
      slow: 350,
      splash: 800,
    },
    easing: {
      default: 'ease-out',
      spring: { tension: 80, friction: 8 },
      springBouncy: { tension: 60, friction: 6 },
    },
    micro_interactions: true,
    page_transition: 'smooth',
    loading_skeleton: true,
  },

  buttons: {
    height: 56,
    radius: 16,
    radiusPill: 999,
    shadow: 'subtle' as const,
    primary: {
      filled: true,
    },
    secondary: {
      ghost: true,
    },
    icon_spacing: 8,
  },

  input_fields: {
    height: 56,
    radius: 16,
    border_width: 1,
    label_position: 'top' as const,
    placeholder_opacity: 0.5,
    error_state: true,
    success_state: true,
    focus_state: true,
    left_icon: true,
    right_icon: 'optional' as const,
  },

  cards: {
    radius: 24,
    radiusLarge: 32,
    padding: 20,
    paddingLarge: 24,
    shadow: 'subtle' as const,
    border: true,
  },

  icons: {
    style: 'Rounded Outline',
    size_small: 18,
    size_medium: 24,
    size_large: 32,
    stroke_width: 1.8,
    consistent_family: true,
    pixel_perfect: true,
    minimal: true,
  },

  navigation: {
    bottom_nav: {
      items: 4,
      active_indicator: true,
      icon_size: 24,
      floating: true,
      height: 72,
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 28,
    },
    top_bar: {
      height: 56,
      back_button: true,
      title_centered: false,
    },
  },

  lists: {
    row_height: 64,
    avatar_optional: true,
    divider: true,
    swipe_actions: true,
  },

  accessibility: {
    touch_target: 44,
    contrast_ratio: 'WCAG AA',
    dynamic_text: true,
    screen_reader_support: true,
  },

  design_rules: [
    'Use 8px spacing system',
    'Maintain consistent alignment',
    'Avoid more than 3 visual priorities per screen',
    'Keep primary CTA visible',
    'Use cards to group related content',
    'Minimize cognitive load',
    'Limit color palette to 5 core colors',
    'Use meaningful iconography',
    'Prioritize readability',
    'Maintain visual consistency across all screens',
    'Use crimson glow shadows on brand elements',
    'Use glass morphism sparingly for overlays',
    'Every interactive element must have press feedback',
  ],
} as const;
