import { test } from '@bicycle-codes/tapzero'
import { WebComponent } from '../src/index.js'

class TestComponent extends WebComponent {
    static NAME = 'test-component'
    NAME = 'test-component'

    constructor () {
        super()
        this.innerHTML = `<div>
            hello
        </div>`
    }
}

customElements.define('test-component', TestComponent)

test('can emit namespaced events', t => {
    t.plan(3)
    document.body.innerHTML += '<test-component class="test"></test-component>'

    const el = document.querySelector('test-component')
    t.ok(el, 'should find an element')
    el?.addEventListener(TestComponent.event('test'), ev => {
        t.ok(ev, 'should get the custom event')
        t.equal(ev.detail, 'hello', 'should emit the event detail')
    })
    el?.emit('test', 'hello')
})

declare global {
    interface HTMLElementTagNameMap {
        'test-component': TestComponent;
    }
}
