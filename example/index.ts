import './index.css'
import { WebComponent } from '../src/index.js'
import Debug from '@bicycle-codes/debug'
const debug = Debug()

// for docuement.querySelector
declare global {
    interface HTMLElementTagNameMap {
        'my-element': MyElement;
    }
}

class MyElement extends WebComponent.create('my-element') {
    constructor () {
        super()
        this.innerHTML = `<div class="example">
            <p>example element</p>
            <button class="namespaced">emit a namespaced event</button>
            <button class="regular">emit a regular event</button>
        </div>`
    }

    connectedCallback () {
        this.querySelector('button.namespaced')?.addEventListener('click', ev => {
            ev.preventDefault()
            ev.stopPropagation()
            this.emit('click', { detail: 'some data' })
        })

        this.querySelector('button.regular')?.addEventListener('click', ev => {
            ev.preventDefault()
            ev.stopPropagation()
            this.dispatch('click', { detail: 'some more data' })
        })
    }
}

customElements.define('my-element', MyElement)

document.body.innerHTML += `
    <my-element></my-element>
`

const el = document.querySelector('my-element')
debug('the namespaced event....', MyElement.event('aaa'))

el?.addEventListener('my-element:click', ev => {
    debug('got a namespaced click', ev.detail)
    debug('the full event name: ', ev.type)
})

el?.addEventListener(MyElement.event('click'), ev => {
    debug('got the click by using .event method', ev.detail)

    document.querySelector('.last-event-content')!.innerHTML = `
        <pre>${ev.type}</pre>
        <pre>${ev.detail}</pre>
    `
})

el?.addEventListener('click', ev => {
    debug('got a regular click', ev.type)
    debug('event data: ', ev.detail)
    document.querySelector('.last-event-content')!.innerHTML = `
        <pre>${ev.type}</pre>
        <pre>${ev.detail}</pre>
    `
})
