import { test } from '@substrate-system/tapzero'
import { waitFor, waitForText } from '@substrate-system/dom'
import { toAttributes } from '../src/util.js'
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

    connectedCallback () {
        this.render()
    }

    handleChange_disabled (_oldValue, newValue) {
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

test('to attributes', t => {
    const attrs = toAttributes({ hello: 'world', disabled: true })
    t.equal(attrs, 'hello="world" disabled')
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
    t.plan(2)
    document.body.innerHTML += '<another-element></another-element>'

    // Wait for the element to be defined and rendered
    await waitFor('another-element')

    t.ok(await waitForText({
        text: 'hello again',
        timeout: 3000
    }), 'should find the element')

    t.equal(AnotherElement.TAG, 'another-element',
        'should have the expected TAG property')
})

test('TAG static property', async t => {
    t.plan(2)
    const el = await waitFor(AnotherElement.TAG)
    t.ok(el, 'should find the element')
    t.equal(el?.tagName.toLocaleLowerCase(), AnotherElement.TAG,
        'should have the TAG static property')
})

test('Attribute change events', async t => {
    t.plan(1)
    const el = await waitFor(AnotherElement.TAG)

    el?.setAttribute('disabled', '')
    const btn = el?.querySelector('button')
    t.equal(btn?.hasAttribute('disabled'), true,
        'should handle attribute change with a conventionally named method')
})

test('all done', () => {
    // @ts-expect-error explicitly end
    window.testsFinished = true
})

test('accessibility utilities', t => {
    t.plan(6)
    const el = document.querySelector('test-component')

    // Test ARIA utilities
    el?.setAria('label', 'Test component')
    t.equal(el?.getAttribute('aria-label'), 'Test component',
        'should set aria-label attribute')

    t.equal(el?.getAria('label'), 'Test component',
        'should get aria-label value')

    // Test convenience methods
    el?.setLabel('New label')
    t.equal(el?.getAttribute('aria-label'), 'New label',
        'setLabel should update aria-label')

    el?.setDescription('help-id')
    t.equal(el?.getAttribute('aria-describedby'), 'help-id',
        'setDescription should set aria-describedby')

    // Test removing ARIA attributes
    el?.setAria('label', null)
    t.equal(el?.hasAttribute('aria-label'), false,
        'should remove aria attribute when set to null')

    // Test focus method exists
    t.ok(typeof el?.focus === 'function',
        'should have focus method available')
})

declare global {
    interface HTMLElementTagNameMap {
        'test-component': TestComponent;
        'another-element': AnotherElement;
    }
}
