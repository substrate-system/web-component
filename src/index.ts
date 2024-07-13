export abstract class WebComponent extends HTMLElement {
    static NAME:string = ''
    NAME:string = ''

    static create (elementName:string) {
        return class extends WebComponent {
            static NAME = elementName
            NAME = elementName
        }
    }

    static event (evType:string):string {
        return eventName(this.NAME, evType)
    }

    /**
     * Emit a namespaced event.
     *
     * @param type event type string
     * @param opts `bubbles`, `detail`, and `cancelable`. Default is
     * `{ bubbles: true, cancelable: true }`
     * @returns {boolean}
     */
    emit<T = any> (
        type:string,
        opts:Partial<{
            bubbles:boolean,
            cancelable:boolean,
            detail:CustomEvent<T>['detail']
        }> = {}
    ):boolean {
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
    }>):boolean {
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
