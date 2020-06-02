#!/bin/bash
mkdir web-monetization-simulator
cp -R LICENSE README.md {background,content,popup}.js popup.html manifest.json icons web-monetization-simulator
zip -r -X web-monetization-simulator.zip web-monetization-simulator
rm -rf web-monetization-simulator
