import { test } from '@substrate-system/tapzero'
import { render, renderComponents, wrapInContainer } from '../src/html.js'
import type { ServerRenderable } from '../src/html.js'

// Mock web component for testing
class MockComponent implements ServerRenderable {
    static TAG = 'mock-component'
    TAG = 'mock-component'
}

// Mock component with custom renderToString
class CustomRenderComponent implements ServerRenderable {
    static TAG = 'custom-component'
    TAG = 'custom-component'

    static renderToString (_attrs = {}, children = '') {
        return `<custom-component data-custom="true">${children}</custom-component>`
    }
}

test('render basic component', t => {
    const result = render(MockComponent)
    t.equal(result, '<mock-component></mock-component>',
        'should render basic component without attributes or children')
})

test('render component with attributes', t => {
    const result = render(MockComponent, {
        class: 'test-class',
        'data-id': '123',
        disabled: true
    })
    t.equal(result, '<mock-component class="test-class" data-id="123" disabled></mock-component>',
        'should render component with attributes')
})

test('render component with children', t => {
    const result = render(MockComponent, {}, '<span>Hello World</span>')
    t.equal(result, '<mock-component><span>Hello World</span></mock-component>',
        'should render component with children content')
})

test('render component with attributes and children', t => {
    const result = render(MockComponent, {
        class: 'container'
    }, '<p>Content</p>')
    t.equal(result, '<mock-component class="container"><p>Content</p></mock-component>',
        'should render component with both attributes and children')
})

test('render component with custom renderToString method', t => {
    const result = render(CustomRenderComponent, { ignored: 'value' }, 'test content')
    t.equal(result, '<custom-component data-custom="true">test content</custom-component>',
        'should use custom renderToString method when available')
})

test('renderComponents multiple components', t => {
    const components = [
        { component: MockComponent, attrs: { class: 'first' } },
        { component: MockComponent, attrs: { class: 'second' }, children: 'content' }
    ]
    const result = renderComponents(components)
    t.equal(result,
        '<mock-component class="first"></mock-component><mock-component class="second">content</mock-component>',
        'should render multiple components')
})

test('wrapInContainer default div', t => {
    const content = '<mock-component></mock-component>'
    const result = wrapInContainer(content)
    t.equal(result, '<div><mock-component></mock-component></div>',
        'should wrap content in default div container')
})

test('wrapInContainer custom tag and attributes', t => {
    const content = '<mock-component></mock-component>'
    const result = wrapInContainer(content, 'section', { class: 'wrapper', id: 'main' })
    t.equal(result, '<section class="wrapper" id="main"><mock-component></mock-component></section>',
        'should wrap content in custom tag with attributes')
})

test('render handles empty and whitespace children', t => {
    const emptyResult = render(MockComponent, {}, '')
    t.equal(emptyResult, '<mock-component></mock-component>',
        'should render without children for empty string')

    const whitespaceResult = render(MockComponent, {}, '   ')
    t.equal(whitespaceResult, '<mock-component></mock-component>',
        'should render without children for whitespace-only string')
})

test('render handles complex attributes', t => {
    const result = render(MockComponent, {
        'data-list': ['item1', 'item2', 'item3'],
        hidden: false,
        visible: true,
        count: 42
    })
    t.equal(result, '<mock-component data-list="item1 item2 item3" visible count="42"></mock-component>',
        'should handle array attributes and filter out false booleans')
})
