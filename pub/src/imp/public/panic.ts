
/**
 * call this function if an error is en encountered that is unrecoverable
 * and the application should terminate immediately
 * this avoids throwing an Error because those can always be caught, which could lead to
 * misuse of library functionality
 * 
 * @param message message to be printed on stderr
 */
export function panic(message: string): never {
    console.error(`PANIC: ${message}`)
    process.exit(1)
}