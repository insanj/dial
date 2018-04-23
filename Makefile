#	(c) 2018 Julian Weiss // insanj
#	dial
#	https://github.com/insanj/dial
#
# Requires:
#	- Python https://python.org/
#	- Node.js & npm https://nodejs.org/en/
#
MAKE="C:\Program Files (x86)\GnuWin32\bin\make.exe"
UGLIFY=uglifyjs
LESS=lessc --strict-math=on --strict-units=on
LESS_COMPRESS=--clean-css="--s1 --advanced --compatibility=ie8"

all: deps windows

windows: clean_windows compress replace_windows
	python -m http.server
	explorer "localhost:8000/deploy.html"

mac: clean_mac compress replace_mac
	python -m http.server
	open -a Safari.app "localhost:8000/deploy.html"

clean_windows:
	del deploy.html
	del example.min.js
	del example.less

clean_mac:
	rm deploy.html
	rm example.min.js
	rm example.less

replace_windows:
	COPY /Y index.html deploy.html
	get-content deploy.html | %{$_ -replace "example.css","example.less.css"}
	get-content deploy.html | %{$_ -replace "example.js","example.min.js"}

replace_mac:
	cp index.html deploy.html
	sed -i 's/example.css/example.less.css/g' deploy.html
	sed -i 's/example.js/example.min.js/g' deploy.html

compress: compress_js compress_css 

compress_js:
	$(UGLIFY) example.js >> example.min.js

compress_css:
	$(LESS) example.css $(LESS_COMPRESS) >> example.less 

deps:
	npm install -g uglify-js
	npm install -g less@2.7.1
	npm install -g less-plugin-clean-css