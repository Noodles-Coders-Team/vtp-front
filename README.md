# NCT
This is simple Node.js + React + Vite front end site. Depends on [weather-common](https://github.com/Noodles-Coders-Team/weather-common) and uses [weather-backend](https://github.com/Noodles-Coders-Team/weather-backend) as backend

## Set Up

To set up the project run `npm install`. To run locall server run `npm run dev`.

You will need to have `.env` file with backend adress: `VITE_BACKEND_URL=http://localhost:8080`

**NOTE**: documentation for backend api should/will be available under [backend README.md](https://github.com/Noodles-Coders-Team/weather-backend/blob/main/README.md#API)

# Todo

* __ALWAYS__ fix typos :D
* Add user removal to user managment page, either via manual input, or selectbox with available users
* Create same functionality for Temperature Managment page as in user managment (**C**reate **R**ead **U**pdate **D**elete)
  * Displaying temperature split into two category: all, and only for specific user. Selected by checkbox "Display for Selected user". If checked display dropdowns with users.
  * Removal of temperature entry should be done via button next to the row (bttn embeded into row)
* Change styling of app to [BOOTSTRAP](https://getbootstrap.com/docs/5.3/getting-started/introduction/) (easy styling without actually writing it)


# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
