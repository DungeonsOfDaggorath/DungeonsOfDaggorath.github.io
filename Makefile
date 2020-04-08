WEBSITE:=1
export WEBSITE

all: daggorath daggorath/Makefile
	$(MAKE) -C daggorath

clean:
	$(RM) index.js index.wasm index.data
	$(MAKE) -C daggorath clean
