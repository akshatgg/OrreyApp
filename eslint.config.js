import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        fetch: "readonly",
        URL: "readonly",
        requestAnimationFrame: "readonly",
        cancelAnimationFrame: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        performance: "readonly",
        HTMLElement: "readonly",
        CustomEvent: "readonly",
        Event: "readonly",
        MouseEvent: "readonly",
        KeyboardEvent: "readonly",
        ResizeObserver: "readonly",
        IntersectionObserver: "readonly",
        MutationObserver: "readonly",
        navigator: "readonly",
        location: "readonly",
        history: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        alert: "readonly",
        confirm: "readonly",
        prompt: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
    },
  },
  {
    ignores: ["dist/**", "node_modules/**"],
  },
];
