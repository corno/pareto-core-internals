#!/usr/bin/env node

import * as pe from "pareto-core-exe"

import * as test from "lib-pareto-test"

import { createGetTestset } from "../implementation"
import { dependencies } from "../dependencies/dependencies.p"
import { data } from "../data/data.p"


pe.runProgram(
    test.f_createTester(
        null,
        {
            getTestSet: createGetTestset(
                data,
                dependencies
            ),
            dependencies: test.dependencies,
        },
    )
)
