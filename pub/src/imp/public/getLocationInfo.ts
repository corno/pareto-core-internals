import * as process from "process"
import * as path from "path"

export type SourceLocation = {
    'file': string,
    'line': number,
    'column': number,
}

export function getLocationInfo(depth: number): SourceLocation {

    const e = new Error(); //don't move this statement to another function, it will change the depth of its stack


    function getLine(): string {
        const regex = /\((.*)\)$/
        //const regex = /\((.*):(\d+):(\d+)\)$/ //further splitted; file,line,column,
        if (e.stack === undefined) {
            throw new Error("NO STACK INFO")
        } const line = e.stack.split("\n")[depth + 2]
        const match = regex.exec(line);
        return path.relative(process.cwd(), (() => {
            if (match === null) {
                const begin = "    at /"
                if (line.startsWith(begin)) {
                    return path.relative(process.cwd(), line.substring(begin.length - 1));
                } else {
                    throw new Error(`COULD NOT PARSE STACK LINE: ${line}`)
                }
            } else {
                return match[1]
            }
        })())

    }
    const line = getLine()
    const split = line.split(":")
    if (split.length !== 3) {
        throw new Error(`UNEXPECTED LOCATION FORMAT (CHECK THE DEPTH PARAMETER): ${line} (Expected 'file:line:column')`)
    }
    return {
        'file': split[0],
        'line': Number(split[1]),
        'column': Number(split[2]),
    }
}
