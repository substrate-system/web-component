export abstract class WebComponent extends window.HTMLElement {
    static NAME:string = ''
    NAME:string = ''

    static create (elementName:string) {
        return class extends WebComponent {
            static NAME = elementName
            NAME = elementName
            render () {}
        }
    }

    static define<T extends { new (...args:any[]):WebComponent; NAME:string }>(this:T) {
        if (!window) return
        if (!('customElements' in window)) return

        if (!isRegistered(this.NAME)) {
            window.customElements.define(this.NAME, this)
        }
    }

    /**
     * Runs when the value of an attribute is changed.
     *
     * Depends on `static observedAttributes`.
     *
     * Should name methods like `handleChange_disabled`.
     *
     * @param  {string} name     The attribute name
     * @param  {string} oldValue The old attribute value
     * @param  {string} newValue The new attribute value
     */
    async attributeChangedCallback (name:string, oldValue:string, newValue:string) {
        const handler = this[`handleChange_${name}`]
        if (handler) {
            await handler.call(this, oldValue, newValue)
        }
        this.render()
    }

    connectedCallback () {
        this.render()
    }

    abstract render ():any

    qs<K extends keyof HTMLElementTagNameMap>(selector:K):HTMLElementTagNameMap[K]|null;
    qs<E extends Element = Element>(selector:string):E|null;
    qs (selector:string):Element|null {
        return this.querySelector(selector)
    }

    qsa<K extends keyof HTMLElementTagNameMap>(selector:K):HTMLElementTagNameMap[K]|null;
    qsa<E extends Element = Element>(selector:string):E|null;
    qsa (selector:string):NodeListOf<Element> {
        return this.querySelectorAll(selector)
    }

    /**
     * Take a non-namepsaced event name, return namespace event name.
     *
     * @param {string} evType The non-namespace event name
     * @returns {string} Namespaced event name, eg, `my-component:click`
     */
    static event (evType:string):string {
        return eventName(this.NAME, evType)
    }

    /**
     * Emit a namespaced event.
     *
     * @param type (non-namespaced) event type string
     * @param opts `bubbles`, `detail`, and `cancelable`. Default is
     * `{ bubbles: true, cancelable: true }`
     * @returns {boolean}
     */
    emit<T = any> (type:string, opts:Partial<{
        bubbles:boolean,
        cancelable:boolean,
        detail:CustomEvent<T>['detail']
    }> = {}):boolean {
        const namespace = this.NAME
        const event = new CustomEvent<T>(`${namespace}:${type}`, {
            bubbles: (opts.bubbles === undefined) ? true : opts.bubbles,
            cancelable: (opts.cancelable === undefined) ? true : opts.cancelable,
            detail: opts.detail
        })

        return this.dispatchEvent(event)
    }

    /**
     * Create and emit an event, no namespacing.
     */
    dispatch<T> (type:string, opts:Partial<{
        bubbles:boolean,
        cancelable:boolean,
        detail:CustomEvent<T>['detail']
    }> = {}):boolean {
        const event = new CustomEvent(type, {
            bubbles: (opts.bubbles === undefined) ? true : opts.bubbles,
            cancelable: (opts.cancelable === undefined) ? true : opts.cancelable,
            detail: opts.detail
        })

        return this.dispatchEvent(event)
    }
}

function eventName (namespace:string, evType:string) {
    return `${namespace}:${evType}`
}

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
