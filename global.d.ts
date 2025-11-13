// Allow importing plain CSS files as side-effect imports in TypeScript files.
// This prevents the error: "Cannot find module or type declarations for side-effect import"
declare module '*.css'
declare module '*.module.css'

export {}
