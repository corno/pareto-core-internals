#!/usr/bin/env bash

scriptDir=`realpath $(dirname "$0")`
rootDir="$scriptDir/../.."

"$scriptDir/updatePackage.sh" pareto

"$rootDir/pareto/node_modules/pareto-buildenvironment/copyTemplate.sh" "$rootDir"
