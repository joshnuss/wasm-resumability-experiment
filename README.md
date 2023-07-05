# Resumeable Wasm component

This is an experiment to define a resumeable WASM component. It's an example of restoring SSR state in the browser.

## How it works

The component is a incrementing counter.

On each server request the `.wasm` component is loaded, and `increment()` is called multiple times. This modifies the components memory.

Then the state (shared memory) is extracted from the component and sent down to the browser (attached to the `<body>` tag as `data-state` attribute).

The browser then instantiates the same `.wasm` module, and restores the state from the server and uses it to hydrate the module's memory.

This effectively resumes execution.

The next increment call will continue with the server state.

## Usage

Install dependencies:

```sh
pnpm install
```

Build `.wasm` and run server:

```sh
pnpm build && pnpm dev
```
