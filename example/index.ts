import './index.css'
import { WebComponent } from '../src/index.js'
import Debug from '@substrate-system/debug'
const debug = Debug(import.meta.env.dev)

// for docuement.querySelector
declare global {
    interface HTMLElementTagNameMap {
        'my-element': MyElement;
    }
}

// use the factory function
class MyElement extends WebComponent.create('my-element') {
    connectedCallback () {
        this.render()

        this.querySelector('button.namespaced')?.addEventListener('click', ev => {
            ev.preventDefault()
            ev.stopPropagation()
            this.emit<string>('click', { detail: 'some data' })
        })

        this.querySelector('button.regular')?.addEventListener('click', ev => {
            ev.preventDefault()
            ev.stopPropagation()
            this.dispatch('click', { detail: 'some more data' })
        })
    }

    render () {
        this.innerHTML = `<div class="example">
            <p>hello example element</p>
            <button class="namespaced">emit a namespaced event</button>
            <button class="regular">emit a regular event</button>
        </div>`
    }
}

if ('customElements' in window) {
    MyElement.define()
}

document.body.innerHTML += `
    <my-element></my-element>
`

const el = document.querySelector('my-element')
debug('the namespaced event...', MyElement.event('aaa'))

const buttons = el?.qsa('button')
debug('the buttons', buttons)

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
