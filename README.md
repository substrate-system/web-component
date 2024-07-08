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

## Example

### Create a component
Use the factory function to create a new web componenet:

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
Events are dispatched by DOM nodes.

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

This will dispatch a [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events), namespaced according to a convention.

That way we can use event bubbling while minimizing event name collisions.

The convention is to take the `NAME` property, appended with `:event-name`.

So `emit('test')` dispatches an event like `my-element:test`.

In practice this looks like:

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

### `event (name:string):string`
Return the namespaced event name.

#### `event` example

```js
MyElement.event('change')  // => 'my-element:change'
```

### `dispatch(name:string, opts{ bubbles?, cancelable?, detail? }):boolean`

Emit a plain string; don't namespace the event name.

```js
const el = document.querySelector('my-element')
el.dispatch('change')  // => 'change' event
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
