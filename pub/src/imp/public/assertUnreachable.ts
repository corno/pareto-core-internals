
/**
 * au means 'assert unreachable'. Used in the 'default' clause of while statements to ensure that
 * all possible cases have been handled
 * @param _x 
 */
 export function au<RT>(_x: never): RT {
    throw new Error("unreachable")
}