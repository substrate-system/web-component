import { test } from '@substrate-system/tapzero'
import { waitFor, waitForText } from '@substrate-system/dom'
import { WebComponent } from '../src/index.js'

class TestComponent extends WebComponent {
    static TAG = 'test-component'
    TAG = 'test-component'

    static observedAttributes = []

    render () {
        this.innerHTML = `<div>
            hello
        </div>`
    }
}

customElements.define('test-component', TestComponent)

// use factory function
class AnotherElement extends WebComponent.create('another-element') {
    static observedAttributes = ['disabled']

    handleChange_disabled (oldValue, newValue) {
        this.qs('button')?.setAttribute('disabled', newValue)
    }

    render () {
        this.innerHTML = `<div>
            hello again

            <button>hello</button>
        </div>`
    }
}

AnotherElement.define()

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

test('use factory function', async t => {
    document.body.innerHTML += '<another-element></another-element>'
    t.ok(await waitForText('hello again'), 'should find the element')
    t.equal(AnotherElement.TAG, 'another-element',
        'should have the expected TAG property')
})

test('TAG static property', async t => {
    const el = await waitFor(AnotherElement.TAG)
    t.ok(el, 'should find the element')
    t.equal(el?.tagName.toLocaleLowerCase(), AnotherElement.TAG,
        'should have the TAG static property')
})

test('Attribute change events', async t => {
    const el = await waitFor(AnotherElement.TAG)

    el?.setAttribute('disabled', '')
    const btn = el?.querySelector('button')
    t.equal(btn?.hasAttribute('disabled'), true,
        'should handle attribute change with a conventionally named method')
})

declare global {
    interface HTMLElementTagNameMap {
        'test-component': TestComponent;
        'another-element': AnotherElement;
    }
}
