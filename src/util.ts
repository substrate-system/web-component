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
