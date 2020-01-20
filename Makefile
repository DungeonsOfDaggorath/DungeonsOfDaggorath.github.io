WEBSITE:=1
export WEBSITE

all: daggorath daggorath/Makefile
	$(MAKE) -C daggorath

clean:
	$(MAKE) -C daggorath clean
