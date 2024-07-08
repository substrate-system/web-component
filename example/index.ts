import './index.css'
import { WebComponent } from '../src/index.js'
// import { waitFor } from '@bicycle-codes/dom'
import Debug from '@bicycle-codes/debug'
const debug = Debug()

declare global {
    interface HTMLElementTagNameMap {
        'my-element': MyElement;
    }
}

class MyElement extends WebComponent {
    static NAME = 'my-element'
    NAME = 'my-element'

    constructor () {
        super()
        this.innerHTML = `<div class="example">
            <p>example element</p>
            <button>click</button>
        </div>`
    }

    connectedCallback () {
        this.querySelector('button')?.addEventListener('click', ev => {
            ev.preventDefault()
            debug('click')
            this.emit('special-click', 'some data')
        })
    }
}

customElements.define('my-element', MyElement)

document.body.innerHTML += `
    <my-element></my-element>
`

const el = document.querySelector('my-element')
// console.log('the element', el)
debug('el instance of', el instanceof MyElement)
el?.addEventListener(MyElement.event('special-click'), ev => {
    debug('the event', ev)
})

debug('namespaced event....', MyElement.event('aaa'))

el?.addEventListener('my-element:special-click', ev => {
    debug('got a special click!!!', ev)
})
el?.addEventListener(MyElement.event('special-click'), ev => {
    debug('got the click by using .event method', ev.detail)
})
