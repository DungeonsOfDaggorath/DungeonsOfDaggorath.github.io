WEBSITE:=1
export WEBSITE

EMRUN ?= emrun
EMMAKE ?= emmake
JEKYLL ?= bundle exec jekyll
SERVE_PORT ?= 8080

.PHONY: all clean wasm site serve serve-local

all: daggorath daggorath/Makefile
	$(MAKE) -C daggorath

wasm: daggorath daggorath/Makefile
	@command -v $(EMMAKE) >/dev/null 2>&1 || { echo "emmake not found. Activate the Emscripten SDK or set EMMAKE=<path-to-emmake>."; exit 1; }
	$(EMMAKE) make -C daggorath

site: wasm
	@$(JEKYLL) --version >/dev/null 2>&1 || { echo "Jekyll not found. Install Jekyll or set JEKYLL=<command>."; exit 1; }
	$(JEKYLL) build

serve: site
	@command -v $(EMRUN) >/dev/null 2>&1 || { echo "emrun not found. Activate the Emscripten SDK or set EMRUN=<path-to-emrun>."; exit 1; }
	$(EMRUN) --no_browser --port $(SERVE_PORT) --serve_root _site _site/index.html

serve-local: wasm
	@command -v $(EMRUN) >/dev/null 2>&1 || { echo "emrun not found. Activate the Emscripten SDK or set EMRUN=<path-to-emrun>."; exit 1; }
	$(EMRUN) --no_browser --port $(SERVE_PORT) --serve_root . index.local.html

clean:
	$(RM) index.js index.wasm index.data
	$(RM) -rf _site
	$(MAKE) -C daggorath clean
