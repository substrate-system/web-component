/**
 * Check if the given tag name has been registered.
 *
 * @see {@link https://stackoverflow.com/a/28210364 stackoverflow}
 * @param {string} elName The custom element tag name.
 * @returns {boolean} True if the given name has been registered already.
 */
export function isRegistered (elName:string):boolean {
    return document.createElement(elName).constructor !== window.HTMLElement
}

export function define (name:string, element:CustomElementConstructor) {
    if (!window) return
    if (!('customElements' in window)) return

    if (!isRegistered(name)) {
        window.customElements.define(name, element)
    }
}

export const qs = document.querySelector.bind(document)
export const qsa = document.querySelectorAll.bind(document)

/**
 * Transform an object into an HTML attributes string. The object should be
 * like `{ attributeName: value }`.
 *
 * @param attrs An object for the attributes.
 * @returns {string} A string suitable for use as HTML attributes.
 */
export function toAttributes (
    attrs:Record<string, undefined|null|string|number|boolean|(string|number)[]>
):string {
    return Object.keys(attrs).reduce((acc, k) => {
        const value = attrs[k]
        if (!value) return acc

        if (typeof value === 'boolean') {
            if (value) return (acc + ` ${k}`).trim()
            return acc
        }

        if (Array.isArray(value)) {
            return (acc + ` ${k}="${value.join(' ')}"`)
        }

        return (acc + ` ${k}="${value}"`).trim()
    }, '')
}
