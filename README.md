# web component
![tests](https://github.com/substrate-system/web-component/actions/workflows/nodejs.yml/badge.svg)
[![types](https://img.shields.io/npm/types/@substrate-system/web-component?style=flat-square)](README.md)
[![module](https://img.shields.io/badge/module-ESM%2FCJS-blue?style=flat-square)](README.md)
[![semantic versioning](https://img.shields.io/badge/semver-2.0.0-blue?logo=semver&style=flat-square)](https://semver.org/)
[![dependencies](https://img.shields.io/badge/dependencies-zero-brightgreen.svg?style=flat-square)](package.json)
[![license](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE)

An extra minimal parent class for [web components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components).

This extends the native `HTMLElement`, adding some methods for events.

[See a live demonstration](https://substrate-system.github.io/web-component/)

## install

```sh
npm i -S @substrate-system/web-component
```

## tl;dr

* [use `.emit` to emit a namepsaced event](#emit-a-namespaced-event-from-the-instance)
* [use `.dispatch` to emit a non-namespaced event](#emit-a-plain-string-not-namespaced-event)
* [use `.event(name)` to get the namespaced event type](#listen-for-events)
* [extend the factory function's return value to create a web component](#create-a-component)

## Example

### Create a component
Use the factory function to create a new web component.

```js
import { WebComponent } from '@substrate-system/web-component'

class AnotherElement extends WebComponent.create('another-element') {
    constructor () {
        super()
        this.innerHTML = `<div>
            hello again
        </div>`
    }
}

customElements.define('another-element', AnotherElement)
```

### Add the component to the DOM
```js
document.body.innerHTML += '<another-element></another-element>'
```

### Listen for events

Use a helper method, `WebComponent.event(name:string)`, to get the full,
namespaced event name.

```js
// find the instance
const el = document.querySelector('my-element')

// listen for namespaced events
el?.addEventListener(MyElement.event('hello'), ev => {
    console.log(ev.detail)  // => 'some data'
})

// listen for non-namespaced events
el?.addEventListener('hello', ev => {
    console.log(ev.detail)  // => 'some data again'
})
```

### Emit a namespaced event from the instance

```js
// find the instance
const el = document.querySelector('my-element')

// dispatch an event
el?.emit('hello', { detail: 'some data' })  // => `my-element:hello`
```

### Emit a plain string (not namespaced) event
Don't namespace the event name, just emit the literal string.

```js
const el = document.querySelector('my-element')

// dispatch an event as plain string, not namespaced
el?.dispatch('hello', { detail: 'some data again' })  // => `hello`
```

## API

This exposes ESM and common JS via [package.json `exports` field](https://nodejs.org/api/packages.html#exports).

### ESM
```js
const { WebComponent } = import '@substrate-system/web-component'
```

### Common JS
```js
const { WebCompponent } = require('@substrate-system/web-component')
```

## methods

### `emit(name:string, opts:{ bubbles?, cancelable?, detail? }):boolean`

This will emit a [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events), namespaced according to a convention.

The return value is [the same as the native `.dispatchEvent` method](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent),

> returns `true` if either event's `cancelable` attribute value is false or its `preventDefault()` method was not invoked, and `false` otherwise.

Because the event is namespaced, we can use event bubbling while minimizing event name collisions.

The naming convention is to take the `NAME` property of the class, and append a string `:event-name`.

So `emit('test')` dispatches an event like `my-element:test`.

```js
class MyElement {
    NAME = 'my-element'  // <-- for event namespace
    // ...
}

// ... then use the element in markup ...

const el = document.querySelector('my-element')

// 'my-element:test' event
el.addEventListener(MyElement.event('test'), ev => {
    console.log(ev.detail)  // => 'some data'
})

// ... in the future ...

el.emit('test', 'some data')  // dispatch `my-element:test` event
```

-------------------------------------------------------------------

### `dispatch (type, opts)`
Create and emit an event, no namespacing. The return value is the same as the
native `.dispatchEvent` method,

> returns `true` if either event's `cancelable` attribute value is false or its `preventDefault()` method was not invoked, and `false` otherwise.

```ts
dispatch (type:string, opts:Partial<{
    bubbles,
    cancelable,
    detail
}>):boolean
```

#### `dispatch` example
```js
const el = document.querySelector('my-element')
el.dispatch('change')  // => 'change' event
```

-------------------------------------------------------------------

### `event (name:string):string`
Return the namespaced event name.

#### `event` example

```js
MyElement.event('change')  // => 'my-element:change'
```

## Develop
Start a localhost server:

```sh
npm start
```

## Test

```sh
npm test
```

## See also

* [Custom events in Web Components](https://gomakethings.com/custom-events-in-web-components/)
