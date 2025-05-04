# JSR React CommonJS

A minimal working example to test if dependencies that are CommonJS are converted in the context of Vite.

When you run `npm run dev` the jsr module `@danielbeeke/mwe-jsr-react-commonjs` is loaded,
it's dependency `jsonld-context-parser` which is a commonjs module fails to be transpiled by vite and is not correctly loaded.
