GIT_TAG := $(shell git describe --always --tags --abbrev=0 | tail -c+2)
GIT_COMMIT := $(shell git rev-list v${GIT_TAG}..HEAD --count)
VERSION := ${GIT_TAG}.${GIT_COMMIT}
VENDOR := "SKB Kontur"
URL := "https://github.com/moira-alert/web2.0"
LICENSE := "MIT"

.PHONY: default
default: lint build

.PHONY: prepare
prepare:
	yarn install

.PHONY: build
build: prepare
	yarn run build

.PHONY: lint
lint: prepare
	yarn run lint

.PHONY: clean
clean:
	rm -rf build

.PHONY: tar
tar:
	mkdir -p build/root/var/www/moira || true
	cp -rf favicon.ico build/root/var/www/moira/
	cp -rf config.json.example build/root/var/www/moira/
	cp -rf dist/* build/root/var/www/moira/
	tar -czvPf build/moira-web2-${VERSION}.tar.gz -C build/root  .

.PHONY: rpm
rpm:
	fpm -t rpm \
		-s "tar" \
		--description "Moira web2" \
		--vendor ${VENDOR} \
		--url ${URL} \
		--license ${LICENSE} \
		--name "moira-web2" \
		--version "${VERSION}" \
		--iteration "1" \
		-p build \
		build/moira-web2-${VERSION}.tar.gz

.PHONY: deb
deb:
	fpm -t deb \
		-s "tar" \
		--description "Moira web2" \
		--vendor ${VENDOR} \
		--url ${URL} \
		--license ${LICENSE} \
		--name "moira-web2" \
		--version "${VERSION}" \
		--iteration "1" \
		-p build \
		build/moira-web2-${VERSION}.tar.gz

.PHONY: packages
packages: clean build tar rpm deb

.PHONY: docker_image
docker_image:
	docker build -t moira/moira-web2:${VERSION} -t moira/moira-web2:latest .

.PHONY: docker_push
docker_push:
	docker push moira/moira-web2:latest

.PHONY: docker_push_release
docker_push_release:
	docker push moira/moira-web2:${VERSION}
