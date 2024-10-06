export abstract class WebComponent extends HTMLElement {
    static NAME:string = ''
    NAME:string = ''

    static create (elementName:string) {
        const newEl = class extends WebComponent {
            static NAME = elementName
            NAME = elementName
        }

        customElements.define(elementName, newEl)

        return newEl
    }

    qs (selector:string):HTMLElement|null {
        return this.querySelector(selector)
    }

    qsa (selector:string):ReturnType<typeof document.querySelectorAll> {
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
