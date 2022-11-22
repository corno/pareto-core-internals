import * as test from "lib-pareto-test"
import { DDependencies } from "../dependencies/dependencies.p"

export type FCreateGetTestset = (
    $: null,
    $d: DDependencies,
) => test.FGetTestSet