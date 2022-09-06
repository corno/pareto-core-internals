#!/usr/bin/env bash
workspaceDir=$1


for f in $workspaceDir/*; do
    cd "$f/pareto" && \
    "./scripts/updatePackage.sh" "pareto" && \
    "./node_modules/pareto-buildenvironment/copyTemplate.sh" "$f"
done
