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
     * @param detail detail property for event
     * @param opts `bubbles` and `cancelable`, default to true for both
     * @returns {boolean}
     */
    emit (
        type:string,
        opts:Partial<{
            bubbles:boolean,
            cancelable:boolean,
            detail:CustomEvent['detail']
        }> = {}
    ):boolean {
        const namespace = this.NAME
        const event = new CustomEvent(`${namespace}:${type}`, {
            bubbles: (opts.bubbles === undefined) ? true : opts.bubbles,
            cancelable: (opts.cancelable === undefined) ? true : opts.cancelable,
            detail: opts.detail
        })

        return this.dispatchEvent(event)
    }

    /**
     * Create and emit an event, no namespacing.
     */
    dispatch (type:string, opts:Partial<{
        bubbles,
        cancelable,
        detail
    }>):boolean {
        return this.dispatchEvent(new CustomEvent(type, opts))
    }
}

function eventName (namespace:string, evType:string) {
    return `${namespace}:${evType}`
}
