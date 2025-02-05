import { test } from '@substrate-system/tapzero'
import { WebComponent } from '../src/index.js'

class TestComponent extends WebComponent {
    static NAME = 'test-component'
    NAME = 'test-component'

    connectedCallback () {
        this.innerHTML = `<div>
            hello
        </div>`
    }
}

customElements.define('test-component', TestComponent)

class AnotherElement extends WebComponent.create('another-element') {
    connectedCallback () {
        this.innerHTML = `<div>
            hello again
        </div>`
    }
}

test('can emit namespaced events', t => {
    t.plan(3)
    document.body.innerHTML += '<test-component class="test"></test-component>'

    const el = document.querySelector('test-component')
    t.ok(el, 'should find an element')
    el?.addEventListener(TestComponent.event('test'), listener)
    el?.emit('test', { detail: 'hello' })
    el?.removeEventListener(TestComponent.event('test'), listener)

    function listener (ev) {
        t.ok(ev, 'should get the custom event')
        t.equal(ev.detail, 'hello', 'should emit the event detail')
    }
})

test('emit an event without namespacing', t => {
    const el = document.querySelector('test-component')
    t.plan(2)
    el?.addEventListener('hello', ev => {
        t.equal(ev.type, 'hello', 'should hear the event')
        t.equal(ev.detail, 'example data', 'should get the event detail')
    })
    el?.dispatch('hello', { detail: 'example data' })
})

test('use factory function', t => {
    document.body.innerHTML += '<another-element></another-element>'
    t.ok(document.querySelector('another-element'), 'should find the element')
    t.equal(AnotherElement.NAME, 'another-element',
        'should have the expected NAME property')
})

declare global {
    interface HTMLElementTagNameMap {
        'test-component': TestComponent;
        'another-element': AnotherElement;
    }
}
