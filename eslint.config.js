import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import hooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
  { ignores: ['dist/**', 'node_modules/**', 'coverage/**'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      '@stylistic': stylistic,
      import: importPlugin,
      'react-hooks': hooks,
      react,
    },
    rules: {
      ...hooks.configs.recommended.rules,
      'react/jsx-uses-vars': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'import/newline-after-import': ['error', { count: 1, exactCount: true }],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
  // Prettier отвечает за форматирование строк, ESLint — за логические разделители.
  prettier,
  {
    files: ['**/*.{js,jsx}'],
    rules: {
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        {
          blankLine: 'any',
          prev: ['singleline-const', 'singleline-let', 'singleline-var'],
          next: ['singleline-const', 'singleline-let', 'singleline-var'],
        },
        {
          blankLine: 'always',
          prev: '*',
          next: [
            'return',
            'throw',
            'if',
            'switch',
            'try',
            'for',
            'while',
            'do',
            'function',
            'class',
            'export',
          ],
        },
        {
          blankLine: 'always',
          prev: [
            'block-like',
            'multiline-expression',
            'export',
            'if',
            'switch',
            'try',
            'for',
            'while',
            'do',
          ],
          next: '*',
        },
      ],
    },
  },
];
