# Resumeable Wasm component

This is an experiment to define a resumeable WASM component. It's an example of restoring SSR state in the browser.

## How it works

The component is a incrementing counter. It's state a single number.

On each server request the `.wasm` component is loaded, and `increment()` is called multiple times. This modifies the components memory.

Then the state (shared memory) is extracted from the component and sent down to the browser (attached to the `<body>` tag as `data-state` attribute).

The browser then instantiates the exact same `.wasm` module, and uses the state from the server to hydrate the module's memory.

This effectively resumes execution.

If the browser makes an `increment()` call, it will continue from where the server left off.

## Usage

Install dependencies:

```sh
pnpm install
```

Build `.wasm` and run server:

```sh
pnpm build && pnpm dev
```
