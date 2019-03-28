MARK_NIGHTLY := "nightly"
MARK_UNSTABLE := "unstable"
GIT_BRANCH := "unknown"
GIT_HASH := $(shell git log --pretty=format:%H -n 1)
GIT_HASH_SHORT := $(shell echo "${GIT_HASH}" | cut -c1-7)
GIT_TAG := $(shell git describe --always --tags --abbrev=0 | tail -c+2)
GIT_COMMIT := $(shell git rev-list v${GIT_TAG}..HEAD --count)
GIT_COMMIT_DATE := $(shell git show -s --format=%ci | cut -d\  -f1)
VERSION_FEATURE := ${GIT_TAG}-${GIT_BRANCH}
VERSION_DEVELOP := ${GIT_COMMIT_DATE}-${GIT_HASH_SHORT}
VERSION_RELEASE := ${GIT_TAG}.${GIT_COMMIT}
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
	cp -rf dist/* build/root/var/www/moira/
	tar -czvPf build/moira-web2-${VERSION_RELEASE}.tar.gz -C build/root  .

.PHONY: rpm
rpm:
	fpm -t rpm \
		-s "tar" \
		--description "Moira web2" \
		--vendor ${VENDOR} \
		--url ${URL} \
		--license ${LICENSE} \
		--name "moira-web2" \
		--version "${VERSION_RELEASE}" \
		--iteration "1" \
		-p build \
		build/moira-web2-${VERSION_RELEASE}.tar.gz

.PHONY: deb
deb:
	fpm -t deb \
		-s "tar" \
		--description "Moira web2" \
		--vendor ${VENDOR} \
		--url ${URL} \
		--license ${LICENSE} \
		--name "moira-web2" \
		--version "${VERSION_RELEASE}" \
		--iteration "1" \
		-p build \
		build/moira-web2-${VERSION_RELEASE}.tar.gz

.PHONY: packages
packages: clean build tar rpm deb

.PHONY: docker_feature_image
docker_feature_image:
	docker build -t moira/web2-${MARK_UNSTABLE}:${VERSION_FEATURE} .
	docker push moira/web2-${MARK_UNSTABLE}:${VERSION_FEATURE}

.PHONY: docker_develop_image
docker_develop_image:
	docker build -t moira/web2-${MARK_NIGHTLY}:${VERSION_DEVELOP} .
	docker push moira/web2-${MARK_NIGHTLY}:${VERSION_DEVELOP}

.PHONY: docker_release_image
docker_release_image:
	docker build -t moira/web2:${VERSION_RELEASE} -t moira/web2:latest .
	docker push moira/web2:${VERSION_RELEASE}
