# Copilot instructions for DungeonsOfDaggorath.github.io
## Repo map
- Root Jekyll site drives static pages; layouts in `_layouts/`, includes in `_includes/`, config via `_config.yml`.
- WebAssembly build artifacts (`index.js`, `.wasm`, `.data`) live at repo root and are served by `index.html`; don't hand-edit them.
- Upstream C++ source is vendored under `daggorath/src`; assets (sound, conf, saves) under `daggorath/assets/`.

## Build & serve workflow
- Use `THREAD_POOL_SIZE=<n> make wasm` to rebuild the WebAssembly bundle; defaults to four threads when you set the env var.
- `make site` chains the wasm build then runs `bundle exec jekyll build`; `make serve` serves `_site` via `emrun` with COOP/COEP headers.
- `make serve-local` skips Jekyll and serves `index.local.html` against the freshly built wasm—handy for quick UI checks.
- Ensure the Emscripten SDK env is active so `emmake` and `emrun` resolve; override via `EMMAKE=/path/emmake` and `EMRUN=/path/emrun` if needed.

## Web UI integration
- `index.html` wires the Jekyll shell to the Emscripten `Module`; any UI change here likely needs a mirror update in `index.local.html`.
- DOM helpers rely on `assets/js/domlite.js`, a tiny jQuery subset (supports `.each`, `.css`, `.click`, `.append`, `.ready`, etc. only).
- Command buttons call `Module.ccall('sendinput', 'void', ['string'], [cmd + "\r"])`; inventory/floor fetchers use `Module.cwrap` and expect `|`-delimited strings.

## Native code bridge
- Exported functions are declared in `daggorath/src/Makefile` via `-s EXPORTED_FUNCTIONS` and `EXPORTED_RUNTIME_METHODS`; update that list when exposing new C++ symbols.
- The `WEBSITE` env variable (set by the root `Makefile`) forces the linker output to `../../index.js`; without it the build targets `daggorath/docs/`.
- Threading config lives in `PTHREAD_FLAGS`; tweak `THREAD_POOL_SIZE` at make time instead of editing flags in place.

## Assets & configuration
- Game defaults (`assets/conf/opts.ini`) and save slots ship inside the wasm package via `--preload-file ../assets@/`; rebuild after editing to propagate changes.
- Static site assets live under `assets/`; update responsive images (`dodtext*.png|webp`) together to keep the site consistent.
- PWA pieces (`manifest.json`, `serviceworker.js`) assume the wasm bundle name stays `index.*`; rename cautiously and adjust cache keys if you roll versions.

## Conventions & gotchas
- The service worker caches aggressively—bump the `CACHE` constant or clear browser data when testing wasm changes.
- Cross-origin isolation is mandatory for the threaded build; keep the warning banner logic in `index.html` aligned with the actual headers served.
- Vendor Ruby gems are committed under `vendor/bundle`; avoid editing them directly—update via Bundler instead.
- Logging uses `console.log` within `Module` callbacks; prefer that over alerting to match existing diagnostics.
