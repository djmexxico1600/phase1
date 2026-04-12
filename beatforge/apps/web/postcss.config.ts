/**
 * @file postcss.config.ts
 * @description PostCSS configuration with Tailwind CSS 4.0 and Autoprefixer.
 */

import type { Config } from 'postcss-load-config';

const config: Config = {
  plugins: {
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {
      overrideBrowserslist: [
        'last 2 versions',
        '> 1%',
        'not dead',
        'Chrome >= 100',
        'Safari >= 14',
        'Firefox >= 97',
        'Edge >= 100',
      ],
    },
  },
};

export default config;
