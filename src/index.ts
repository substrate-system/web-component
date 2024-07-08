// import Debug from '@bicycle-codes/debug'
// const debug = Debug()

export abstract class WebComponent extends HTMLElement {
    static get NAME ():string
    // NAME:string = 'aaa'
    // get NAME ():string {
    //     return ''
    // }

    static event (evType:string) {
        const namespace = this.NAME
        return `${namespace}:${evType}`
    }

    // Define the attributes to observe
    // static observedAttributes = ['exmaple', 'attribute']

    // attributeChangedCallback (name:string, oldValue:string, newValue:string) {
    //     debug('an attribute changed', name, oldValue, newValue)
    // }

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

        return this.dispatchEvent(event)
    }

    // disconnectedCallback () {
    //     debug('disconnected')
    // }

    // connectedCallback () {
    //     debug('connected')

    //     const observer = new MutationObserver(function (mutations) {
    //         mutations.forEach((mutation) => {
    //             if (mutation.addedNodes.length) {
    //                 debug('Node added: ', mutation.addedNodes)
    //             }
    //         })
    //     })

    //     observer.observe(this, { childList: true })
    // }
}
