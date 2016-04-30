#!/bin/bash

set -e

cp browser/* build/
cp node_modules/systemjs/dist/system{,-polyfills}.js build/
cp node_modules/react/dist/react.js build/
cp node_modules/react-dom/dist/react-dom.js build/
node_modules/.bin/tsc $1 $2 $3 $4
