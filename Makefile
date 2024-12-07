# Variables
JEKYLL_BUILD_CMD = bundle exec jekyll build --config _config.yml,_config_testing.yml
JEKYLL_SERVE_CMD = bundle exec jekyll serve --watch --trace --port 4004 --future --host localhost --baseurl=""
PROJECT_DIR = D:/github.com/rpapub/dotgithub
GIT_TEST_REMOTE = test
GIT_BRANCH = gh-pages
COMMIT_MSG = 'auto build'

# Targets
all: build serve

# Build the site with the specified configurations
build:
	$(JEKYLL_BUILD_CMD)

# Serve the site from the specified directory
serve:
	cd "$(PROJECT_DIR)" && $(JEKYLL_SERVE_CMD)

# Clean up generated files (optional)
clean:
	rm -rf _site

# Build and deploy to the test remote
test: build
	git add .\docs -f
	git commit -m $(COMMIT_MSG)
	git push $(GIT_TEST_REMOTE) $(GIT_BRANCH)

# Run both build and serve steps in sequence
run: build serve

.PHONY: all build serve clean test run
