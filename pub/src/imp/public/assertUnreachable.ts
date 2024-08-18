
/**
 * au means 'assert unreachable'. Used in the 'default' clause of switch statements to ensure
 * during compile time that all possible cases have been implemented
 * 
 * example: 
 * 
 * switch (x) {
 *     case "5":
 *         break
 *     default: au(x)
 * }
 * 
 * @param _x 
 */
 export function au<RT>(_x: never): RT {
    throw new Error("unreachable")
}