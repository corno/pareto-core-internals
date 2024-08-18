/**
 * cc means 'change context'. It creates a new scope in which a variable name can be used again
 * (usually '$', a variable name that indicates the current context in pareto)
 * 
 * example: 
 * 
 * cc($[1], ($) => {
 *     //here $[1] has become $
 * })
 * 
 * @param input 
 * @param callback 
 * @returns 
 */
export function cc<T, RT>(input: T, callback: (output: T) => RT): RT {
    return callback(input)
}