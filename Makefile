# See: http://clarkgrubb.com/makefile-style-guide
SHELL             := bash
.SHELLFLAGS       := -eu -o pipefail -c
.DEFAULT_GOAL     := default
.DELETE_ON_ERROR:
.SUFFIXES:

# Constants, these can be overwritten in your Makefile.local
BUILD_SERVER := magneticio/buildserver
DIR_SBT	     := $(HOME)/.sbt
DIR_IVY	     := $(HOME)/.ivy2

# if Makefile.local exists, include it.
ifneq ("$(wildcard Makefile.local)", "")
	include Makefile.local
endif

# Don't change these
VERSION := $(shell git describe --tags)

# Targets
.PHONY: default
default: pack

.PHONY: pack
pack:
	npm install
	npm upgrade
	npm prune
	npm run ng build -- -prod

	docker run \
		--rm \
		--volume $(CURDIR)/dist:/usr/local/src \
		--volume packer:/usr/local/stash \
		$(BUILD_SERVER) \
			push vamp-lifter-ui $(VERSION)

pack-local:
	ng build -prod

	docker run \
		--rm \
		--volume $(CURDIR)/dist:/usr/local/src \
		--volume packer:/usr/local/stash \
		$(BUILD_SERVER) \
			push vamp-lifter-ui $(VERSION)
