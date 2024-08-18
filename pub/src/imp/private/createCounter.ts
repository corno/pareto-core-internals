import { ICounter } from "../types/Counter"


/**
 * this function provides a callback with a counter as parameter
 * when the counter reaches 0, the onEnd callback is called
 * 
 * this function is specifically useful for async map functions
 * 
 * @param callback this callback creates a scope within which the counter is provided
 * @param onEnd this callback will be called when the counter reaches 0
 */
export function createCounter(
    callback: ($: ICounter) => void,
    onEnd: () => void
): void {

    let counter = 0

    /*
     * we need to keep track of if the registration phase is ended or not.
     * it can happen that the counter reaches 0 during the registration phase, specifically if there is no real async call being made
     * in that case the decrement counter is als called during the registration phase.
     * If that happens there should not yet be a call to onEnd().
     */
    let registrationPhaseEnded = false


    let onEndHasBeenCalled = false
    function wrapup() {
        if (registrationPhaseEnded && counter === 0) {
            if (onEndHasBeenCalled === true) {
                throw new Error("CORE: already ended")
            }
            onEndHasBeenCalled = true
            onEnd()
        }
    }
    callback({
        increment: () => {
            if (onEndHasBeenCalled) {
                throw new Error("CORE: async call done after context is ready")
            }
            counter += 1

        },
        decrement: () => {
            if (counter === 0) {
                throw new Error("CORE: decrement while counter is 0")
            }
            counter -= 1
            wrapup()
        },
    })
    registrationPhaseEnded = true
    wrapup()
}
