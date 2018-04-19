# See: http://clarkgrubb.com/makefile-style-guide
SHELL             := bash
.SHELLFLAGS       := -eu -o pipefail -c
.DEFAULT_GOAL     := default
.DELETE_ON_ERROR  :
.SUFFIXES         :

STASH     := stash
PROJECT   := vamp-lifter-ui
FABRICATOR:= node:9.11.1

# if Makefile.local exists, include it.
ifneq ("$(wildcard Makefile.local)", "")
	include Makefile.local
endif

.PHONY: clean
clean:
	rm -rf "$(CURDIR)"/dist

.PHONY: purge
purge: clean
	rm -rf "$(CURDIR)"/node_modules

.PHONY: update
update:
	yarn install
	yarn upgrade

.PHONY: local
local:
	yarn install
	yarn run ng build -- -prod

.PHONY: stash
stash:
	rm -Rf $$HOME/.stash/$(PROJECT) || true
	mkdir -p $$HOME/.stash
	cp -r $(CURDIR)/dist $$HOME/.stash/$(PROJECT)

.PHONY: build
build:
	docker run \
         --rm \
         --volume $(STASH):/root \
         --volume $(CURDIR):/$(PROJECT) \
         --workdir=/$(PROJECT) -it \
         $(FABRICATOR) make local stash

.PHONY: default
default: clean build
