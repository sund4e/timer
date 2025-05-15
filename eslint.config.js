// eslint.config.js
import globals from 'globals';
import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';
import jestPlugin from 'eslint-plugin-jest';

export default [
  // Global ignores
  {
    ignores: [
      'node_modules/',
      '.next/',
      'out/',
      // Add other directories or files to ignore here
      // "*.js" // Keep this if you truly want to ignore ALL .js files, otherwise remove
    ],
  },

  // Base JS configuration (eslint:recommended)
  js.configs.recommended,

  // TypeScript configurations
  {
    files: ['**/*.ts', '**/*.tsx'], // Apply only to TS/TSX files
    plugins: {
      '@typescript-eslint': tseslint,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: './tsconfig.json', // Link to your tsconfig for type-aware rules
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        NodeJS: 'readonly',
      },
    },
    rules: {
      ...tseslint.configs['eslint-recommended'].rules, // Override JS recommended rules with TS equivalents
      ...tseslint.configs.recommended.rules, // Apply TS recommended rules
      // Add any specific TS rule overrides here
      // Example: "@typescript-eslint/no-unused-vars": "warn",
    },
  },

  // React configurations
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'], // Apply to all relevant files
    plugins: {
      react: reactPlugin,
      'react-hooks': hooksPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        React: 'readonly',
      },
    },
    settings: {
      react: {
        version: 'detect', // Detect React version automatically
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules, // Apply React recommended rules
      ...hooksPlugin.configs.recommended.rules, // Apply React Hooks recommended rules
      // Add any specific React rule overrides here
      'react/react-in-jsx-scope': 'off', // Keep your override for Next.js
      'react/prop-types': 'off', // Often not needed with TypeScript
    },
  },

  // Next.js specific configurations (using eslint-config-next implicitly via extends might be simpler if needed)
  // Or apply specific rules directly if preferred:
  /*
  {
    files: ["**\/*.{js,jsx,mjs,cjs,ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      // Add specific Next.js rule overrides if needed
    },
  }
  */

  // You might still want to extend Next.js config if the above isn't enough.
  // Flat config doesn't have `extends` exactly like legacy. You might need
  // to import and spread the config object from 'eslint-config-next' if available,
  // or manually replicate its settings if not directly exportable for flat config.
  // For now, the above covers the core React/TS setup.

  // Config files override (ensure they are treated as CommonJS if needed, although type:module might handle this)
  // This might not be strictly necessary with type:module, but for clarity:
  {
    files: [
      '*.config.js',
      '*.config.cjs',
      'jest.setup.js',
      'setupTests.js',
      'jest.setup.cjs',
      'setupTests.cjs',
    ], // Target .js and potential .cjs versions
    languageOptions: {
      // sourceType: "commonjs", // This might not be needed if globals are set
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // "no-undef": "error" // Turn off no-undef here, rely on globals.node
      'no-undef': 'off',
    },
  },

  // Jest test file configurations
  {
    files: [
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/tests/**/*.ts',
      '**/tests/**/*.tsx',
      '**/__mocks__/**',
    ],
    plugins: {
      jest: jestPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      ...jestPlugin.configs.recommended.rules, // Apply Jest recommended rules
      // Allow describe, it, etc.
      '@typescript-eslint/no-explicit-any': 'off', // Often needed in tests
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': true,
          'ts-nocheck': true,
          'ts-check': false,
        },
      ], // Adjust ts-comment rule for tests
    },
  },

  // Specific file rule overrides
  {
    files: ['styled.d.ts'],
    rules: {
      // Target the rule reported in the error message
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
];
