import { globalIgnores } from 'eslint/config'
import pluginJs from '@eslint/js'
import pluginHtml from 'eslint-plugin-html'
import pluginVue from 'eslint-plugin-vue'
import pluginImport from 'eslint-plugin-import'
import configPrettier from 'eslint-config-prettier'
import parserBabel from '@babel/eslint-parser'

import globals from 'globals'

export default [
  pluginJs.configs.recommended,
  pluginImport.flatConfigs.electron,
  ...pluginVue.configs['flat/strongly-recommended'],
  globalIgnores([
    '**/node_modules',
    '**/dist',
    '**/release',
    '**/static',
    '**/.idea',
    '**/.vscode',
    '**/*-lock.json',
    '**/*-lock.yaml',
    '**/index.ejs'
  ]),
  {
    files: ['**/*.{js,mjs,cjs,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parserOptions: {
        parser: parserBabel,
        requireConfigFile: false
      }
    },
    rules: {
      eqeqeq: 'error',
      'no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'none',
          caughtErrors: 'all',
          ignoreRestSiblings: false,
          reportUsedIgnorePattern: false
        }
      ],
      'no-case-declarations': 'off',
      'no-trailing-spaces': 'error',
      'no-unsafe-optional-chaining': 'off',
      'no-control-regex': 'off',
      'vue/v-on-event-hyphenation': 'off',
      'vue/no-v-text-v-html-on-component': 'off',
      'vue/attribute-hyphenation': 'off'
    }
  },
  {
    files: ['**/*.html'],
    plugins: { pluginHtml }
  },
  configPrettier
]
