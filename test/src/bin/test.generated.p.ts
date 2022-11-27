#!/usr/bin/env node

import * as pe from "pareto-core-exe"
import * as pl from "pareto-core-lib"

import * as test from "lib-pareto-test"

import { dependencies } from "../dependencies/dependencies.p"
import { data } from "../data/data.p"
import { createGetTestset } from "../implementation"


pe.runProgram(
    ($, $i) => {
        test.$b.createTestProgram(
            {
                getTestSet: createGetTestset(
                    data,
                    dependencies
                ),
            },
        )(
           $.arguments
        )
    }
)
