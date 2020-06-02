#!/bin/bash
mkdir web-monetization-simulator
cp -R LICENSE README.md {background,content,popup}.js popup.html manifest.json icons web-monetization-simulator
zip -r -X chrome-extension.zip web-monetization-simulator
zip -r -X firefox-extension.zip LICENSE README.md {background,content,popup}.js popup.html manifest.json icons
rm -rf web-monetization-simulator
