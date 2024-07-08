# web component
![tests](https://github.com/substrate-system/icons/actions/workflows/nodejs.yml/badge.svg)
[![types](https://img.shields.io/npm/types/@substrate-system/icons?style=flat-square)](README.md)
[![module](https://img.shields.io/badge/module-ESM%2FCJS-blue?style=flat-square)](README.md)
[![semantic versioning](https://img.shields.io/badge/semver-2.0.0-blue?logo=semver&style=flat-square)](https://semver.org/)
[![dependencies](https://img.shields.io/badge/dependencies-zero-brightgreen.svg?style=flat-square)](package.json)
[![license](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE)

A minimal base class to inherit from for [web components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components).

This adds a method, `emit` to the component, that will dispatch a namespaced
event name, so to avoid name collisions amongst events.

The short version is that it turns a plain string, `change` into a string
like this:

```
my-element:change
```

```js
// get an instance
const el = document.querySelector('my-element')
// dispatch an event
el?.emit('hello', 'some data')  // => `my-element:hello`
```

## install

```sh
npm i -S @substrate-system/web-component
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

## Example

Extend the class returned by the factory function, `.create`. This will make
sure that your web component has the right property set as `.NAME`.

```js
import { WebComponent } from '@susbtrate-system/web-component'

class MyElement extends WebComponent.create('my-element') {
    // ...
}

customElements.define(MyElement.NAME, MyElement)

// ...sometime in the future...

const el = document.querySelector('my-element')
el.emit('test', 'some data')
// => emit an event like `my-element:test`
```

## methods

### `emit(name, data)`
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

### `event(name)`
Return the namespaced event name.

##### `event` example
```js
MyElement.event('change')  // => 'my-element:change'
```

## Develop

Start a localhost server:

```sh
npm start
```
