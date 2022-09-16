#!/usr/bin/env bash

scriptDir=`realpath $(dirname "$0")`

npx npm-check-updates -u --packageFile "$scriptDir/package.json" && \
npx npm-safe-install -t "$scriptDir"

"$scriptDir/node_modules/pareto-buildenvironment/initialize.sh" "$scriptDir/.."
