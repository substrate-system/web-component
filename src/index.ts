import Debug from '@bicycle-codes/debug'
const debug = Debug()

export abstract class WebComponent extends HTMLElement {
    static NAME:string = ''
    NAME:string = ''

    static event (evType:string) {
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
        detail:CustomEvent['detail'] = {},
        opts:Partial<{ bubbles:boolean, cancelable:boolean }> = {}
    ):boolean {
        const namespace = this.NAME
        const event = new CustomEvent(`${namespace}:${type}`, {
            bubbles: (opts.bubbles === undefined) ? true : opts.bubbles,
            cancelable: (opts.cancelable === undefined) ? true : opts.cancelable,
            detail
        })

        debug('event', event.type)

        return this.dispatchEvent(event)
    }
}

function eventName (namespace:string, evType:string) {
    return `${namespace}:${evType}`
}
