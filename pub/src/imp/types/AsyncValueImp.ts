export type AsyncValueImp<T> = {
    _execute: ($c: ($: T) => void) => void
}
