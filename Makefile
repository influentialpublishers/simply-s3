
NODE_BIN=./node_modules/.bin

install:
	npm install

test:
	$(NODE_BIN)/nyc --reporter=lcov $(NODE_BIN)/ava test

.PHONY: install test
