#!/usr/bin/env bash
version=`jq -r .version manifest_ff.json`
cp manifest_ff.json manifest.json
zip encounterbeyond.ff.${version}.zip encounter*.png hostgrab.js manifest.json options.* rollgrabber.js
rm manifest.json
cp manifest_chrome.json manifest.json
zip encounterbeyond.chrome.${version}.zip encounter*.png hostgrab.js manifest.json options.* rollgrabber.js background.js
rm manifest.json