.PHONY: help install dev build preview clean

help:
	@echo "Targets:"
	@echo "  make install   - npm install"
	@echo "  make dev       - dev server (http://localhost:5173)"
	@echo "  make build     - production build to dist/"
	@echo "  make preview   - serve dist/ after build"
	@echo "  make clean     - remove dist/ and node_modules/.vite"

install:
	npm install

dev:
	npm run dev

build:
	npm run build

preview:
	npm run preview

clean:
	rm -rf dist node_modules/.vite
