/**
 * @file tailwind.config.ts
 * @description Tailwind CSS 4.0 configuration for BeatForge.
 * Dark mode by default, music-first design system.
 * CSS variables for easy theming.
 */

import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Color palette (music-first, dark mode optimized)
      colors: {
        border: 'hsl(var(--color-border) / <alpha-value>)',
        input: 'hsl(var(--color-input) / <alpha-value>)',
        ring: 'hsl(var(--color-ring) / <alpha-value>)',
        background: 'hsl(var(--color-background) / <alpha-value>)',
        foreground: 'hsl(var(--color-foreground) / <alpha-value>)',

        primary: {
          DEFAULT: 'hsl(var(--color-primary) / <alpha-value>)',
          foreground: 'hsl(var(--color-primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'hsl(var(--color-secondary) / <alpha-value>)',
          foreground: 'hsl(var(--color-secondary-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'hsl(var(--color-destructive) / <alpha-value>)',
          foreground: 'hsl(var(--color-destructive-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'hsl(var(--color-muted) / <alpha-value>)',
          foreground: 'hsl(var(--color-muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--color-accent) / <alpha-value>)',
          foreground: 'hsl(var(--color-accent-foreground) / <alpha-value>)',
        },

        // Music-specific colors
        beat: {
          DEFAULT: 'hsl(var(--color-beat) / <alpha-value>)',
          hover: 'hsl(var(--color-beat-hover) / <alpha-value>)',
          light: 'hsl(var(--color-beat-light) / <alpha-value>)',
        },
        wave: {
          DEFAULT: 'hsl(var(--color-wave) / <alpha-value>)',
          hover: 'hsl(var(--color-wave-hover) / <alpha-value>)',
          cursor: 'hsl(var(--color-wave-cursor) / <alpha-value>)',
        },
        success: {
          DEFAULT: 'hsl(var(--color-success) / <alpha-value>)',
          foreground: 'hsl(var(--color-success-foreground) / <alpha-value>)',
        },
        warning: {
          DEFAULT: 'hsl(var(--color-warning) / <alpha-value>)',
          foreground: 'hsl(var(--color-warning-foreground) / <alpha-value>)',
        },
      },

      // Typography
      fontFamily: {
        sans: 'var(--font-sans)',
        display: 'var(--font-display)',
        mono: 'var(--font-mono)',
      },

      // Spacing (music-inspired, powers of 2 where possible)
      spacing: {
        0: '0',
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        7: '1.75rem',
        8: '2rem',
        9: '2.25rem',
        10: '2.5rem',
        12: '3rem',
        14: '3.5rem',
        16: '4rem',
        20: '5rem',
        24: '6rem',
        28: '7rem',
        32: '8rem',
        36: '9rem',
        40: '10rem',
        44: '11rem',
        48: '12rem',
        52: '13rem',
        56: '14rem',
        60: '15rem',
        64: '16rem',
        72: '18rem',
        80: '20rem',
        96: '24rem',
        128: '32rem',
      },

      // Border radius (music-friendly)
      borderRadius: {
        none: '0',
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        full: '9999px',
        beat: 'var(--radius-beat, 0.75rem)',
        card: 'var(--radius-card, 1rem)',
      },

      // Animations
      animation: {
        bounce: 'bounce 1s infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        spin: 'spin 1s linear infinite',
        ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        fadeIn: 'fadeIn 0.3s ease-in-out',
        slideIn: 'slideIn 0.3s ease-out',
        slideUp: 'slideUp 0.3s ease-out',
        shimmer: 'shimmer 2s infinite',
        waveform: 'waveform 0.5s ease-in-out',
        beat: 'beatPulse 0.6s ease-in-out',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        waveform: {
          '0%': { transform: 'scaleY(0.5)', opacity: '0.5' },
          '50%': { transform: 'scaleY(1)', opacity: '1' },
          '100%': { transform: 'scaleY(0.5)', opacity: '0.5' },
        },
        beatPulse: {
          '0%': { boxShadow: '0 0 0 0 currentColor' },
          '70%': { boxShadow: '0 0 0 10px rgba(0, 0, 0, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)' },
        },
      },

      // Transitions
      transitionDuration: {
        0: '0ms',
        75: '75ms',
        100: '100ms',
        150: '150ms',
        200: '200ms',
        300: '300ms',
        500: '500ms',
        700: '700ms',
        1000: '1000ms',
      },

      // Shadows (music-friendly depth)
      boxShadow: {
        xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.1)',
        base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '3xl': '0 35px 60px -15px rgb(0 0 0 / 0.3)',
        inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        beat: '0 0 20px 0 rgb(0 0 0 / 0.2)',
      },

      // Backdrops
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },

      // Min/max dimensions
      minHeight: {
        128: '32rem',
      },
      maxHeight: {
        128: '32rem',
      },

      // Z-index (modal stacking)
      zIndex: {
        0: '0',
        10: '10',
        20: '20',
        30: '30',
        40: '40',
        50: '50',
        auto: 'auto',
        dropdown: '1000',
        sticky: '1020',
        fixed: '1030',
        backdrop: '1040',
        offcanvas: '1050',
        modal: '1060',
        popover: '1070',
        tooltip: '1080',
      },

      // Aspect ratio
      aspectRatio: {
        auto: 'auto',
        square: '1',
        video: '16 / 9',
        cover: '1.5 / 1',
        wave: '3 / 1',
      },
    },
  },

  // Plugin: Custom utilities and components
  plugins: [
    require('tailwindcss-animate'),

    // Music player utilities
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.player-controls': {
          '@apply flex items-center justify-center gap-2 p-4 bg-background border border-border rounded-lg':
            '',
        },
        '.beat-card-hover': {
          '@apply transition-all duration-200 hover:shadow-lg hover:scale-105': '',
        },
        '.waveform-container': {
          '@apply w-full h-16 bg-gradient-to-r from-beat-light to-beat rounded-md': '',
        },
        '.glass-morphism': {
          '@apply bg-white/10 backdrop-blur-md border border-white/20 rounded-xl': '',
        },
      });
    }),

    // Music-first component classes
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'beat-shadow': (value) => ({
            boxShadow: `0 0 20px 0 ${value}`,
          }),
        },
        {
          values: theme('colors'),
        }
      );
    }),
  ],
};

export default config;
