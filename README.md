# web component
[![tests](https://img.shields.io/github/actions/workflow/status/substrate-system/web-component/nodejs.yml?style=flat-square)](https://github.com/substrate-system/web-component/actions/workflows/nodejs.yml)
[![types](https://img.shields.io/npm/types/@substrate-system/web-component?style=flat-square)](README.md)
[![module](https://img.shields.io/badge/module-ESM%2FCJS-blue?style=flat-square)](README.md)
[![semantic versioning](https://img.shields.io/badge/semver-2.0.0-blue?logo=semver&style=flat-square)](https://semver.org/)
[![dependencies](https://img.shields.io/badge/dependencies-zero-brightgreen.svg?style=flat-square)](package.json#L33)
[![install size](https://flat.badgen.net/packagephobia/install/@substrate-system/web-component?cache-control=no-cache)](https://packagephobia.com/result?p=@substrate-system/web-component)
[![gzip size](https://img.shields.io/bundlephobia/minzip/@substrate-system/web-component?style=flat-square)](https://bundlephobia.com/package/@substrate-system/web-component)
[![Common Changelog](https://nichoth.github.io/badge/common-changelog.svg)](https://common-changelog.org)
[![license](https://img.shields.io/badge/license-Big_Time-blue?style=flat-square)](LICENSE)


A minimal parent class for [web components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components).

This extends the native `HTMLElement`, and adds
[some methods to help with events](#emitnamestring-opts-bubbles-cancelable-detail-boolean).

[See a live demonstration](https://substrate-system.github.io/web-component/)

<details><summary><h2>Contents</h2></summary>

<!-- toc -->

- [install](#install)
- [tl;dr](#tldr)
- [Example](#example)
  * [Create a component](#create-a-component)
  * [Add the component to the DOM](#add-the-component-to-the-dom)
  * [Listen for events](#listen-for-events)
  * [Emit a namespaced event from the instance](#emit-a-namespaced-event-from-the-instance)
  * [Listen for a namespaced event](#listen-for-a-namespaced-event)
  * [Emit a plain string (not namespaced) event](#emit-a-plain-string-not-namespaced-event)
- [Modules](#modules)
  * [ESM](#esm)
  * [Common JS](#common-js)
- [methods](#methods)
  * [`emit(name:string, opts:{ bubbles?, cancelable?, detail? }):boolean`](#emitnamestring-opts-bubbles-cancelable-detail-boolean)
  * [`dispatch (type, opts)`](#dispatch-type-opts)
  * [`event (name:string):string`](#event-namestringstring)
  * [`qs`](#qs)
  * [`qsa`](#qsa)
  * [element.qs & element.qsa](#elementqs--elementqsa)
- [Misc](#misc)
  * [`/util`](#util)
- [Develop](#develop)
- [Test](#test)
- [See also](#see-also)

<!-- tocstop -->

</details>

## install

```bash
npm i -S @substrate-system/web-component
```

## tl;dr

* [use `.emit` to emit a namepsaced event](#emit-a-namespaced-event-from-the-instance)
* [use `.dispatch` to emit a non-namespaced event](#emit-a-plain-string-not-namespaced-event)
* [use `.event(name)` to get the namespaced event type](#listen-for-events)
* [extend the factory function to create a web component](#create-a-component)

## Examples

### Hide undefined elements

>
> [!TIP]
> Use the CSS [`:defined`](https://developer.mozilla.org/en-US/docs/Web/CSS/:defined)
> pseudo-class to hide elements until they have been defined in JS, to prevent
> a [FOUCE](https://www.abeautifulsite.net/posts/flash-of-undefined-custom-elements/#awaiting-customelements.whendefined).
>

```css
my-element:not(:defined) {
  visibility: hidden;
}
```

>
> [!CAUTION]
> JS must exist on the device for the custom elements to be defined.
> A better option might be to [set a single class when everything is defined](https://www.abeautifulsite.net/posts/revisiting-fouce).
>

### Create a component
Use the factory function to create a new web component.

```js
import { WebComponent } from '@substrate-system/web-component'

class AnotherElement extends WebComponent.create('another-element') {
    connectedCallback () {
        this.innerHTML = `<div>
            hello again
        </div>`
    }
}

// call custom customElements.define with the right tag name
AnotherElement.define()
```

The new component will have a property `NAME` on the class that is equal to
[the name you passed in](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define#valid_custom_element_names).
The [component name should be kebab case](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#name).


### Add the component to the DOM
```js
document.body.innerHTML += '<another-element></another-element>'
```


### Listen for events

Use a helper method, `WebComponent.event(name:string)`, to get a
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

### Listen for a namespaced event

Use the static method `.event` to get a namespaced event name.

```js
class ExampleComponent extends WebComponent {
    tag = 'example-component'
    // ...
}

const ev = ExampleComponent.event('click')
// => 'example-component:click'
```

### Emit a plain string (not namespaced) event
Don't namespace the event name, just emit the literal string.

```js
const el = document.querySelector('my-element')

// dispatch an event as plain string, not namespaced
el?.dispatch('hello', { detail: 'some data again' })  // => `hello`
```

## Modules

### ESM

This exposes ESM and common JS via [package.json `exports` field](https://nodejs.org/api/packages.html#exports).

```js
const { WebComponent } = import '@substrate-system/web-component'
```

### Common JS
```js
const { WebCompponent } = require('@substrate-system/web-component')
```

## methods

### `emit(name:string, opts:{ bubbles?, cancelable?, detail? }):boolean`

This will emit a [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events),
namespaced according to a convention.

The return value is
[the same as the native `.dispatchEvent` method](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent),

> returns `true` if either event's `cancelable` attribute value is false or its `preventDefault()` method was not invoked, and `false` otherwise.

Because the event is namespaced, we can use event bubbling while minimizing
event name collisions.

The naming convention is to take the `NAME` property of the class, and append a
string `:event-name`.

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

See also, [Custom events in Web Components](https://gomakethings.com/custom-events-in-web-components/)

-------------------------------------------------------------------

### `dispatch (type, opts)`
Create and emit an event, no namespacing. The return value is the same as the
native `.dispatchEvent` method,

> returns `true` if either event's `cancelable` attribute value is false or
its `preventDefault()` method was not invoked, and `false` otherwise.

That is, it returns true if it was not `preventDetault`ed.

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


### `qs`
A convenient shortcut to `element.querySelector`.

```ts
qs (selector:string):HTMLElement|null
```



### `qsa`
Shortcut to `document.querySelectorAll`

```ts
qsa (selector:string):ReturnType<typeof document.querySelectorAll>
```

### element.qs & element.qsa

A shortcut to `element.querySelector` & `element.querySelectorAll`.

#### example

```js
const myElement = document.querySelector('my-element')
debug('the namespaced event...', MyElement.event('aaa'))

// query inside the element 
const buttons = myElement?.qsa('button')
```

---------------------------------------------------------------------

## Misc

### `/util`

Various functions.

#### `qs`
A convenient shortcut to `document.querySelector`.

```js
import { qs } from 'substrate-system/web-component/qs'
```

#### `qsa`
A shortcut to `document.querySelectorAll`.

```js
import { qsa } from 'substrate-system/web-component/qsa'
```

#### `isRegistered(name:string)`
Check if an element name has been used already.

```ts
function isRegistered (elName:string):boolean
```

```js
import { isRegistered } from '@substrate-system/web-component/util'
```

##### example
```js
import { isRegistered } from '@substrate-system/web-component/util'

if (!isRegistered('example-component')) {
    customElements.define('example-component', ExampleComponent)
}
```

#### `define(name:string, element:CustomElementConstructor)`

Add a component to the [custom element registry](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry).

This uses `isRegistered`, so it will not throw if the name has been
taken already.

```js
import { define } from '@substrate-system/web-component/util'
```

```ts
function define (name:string, element:CustomElementConstructor) {
```


---------------------------------------------------------------------

## Develop
Start a localhost server:

```bash
npm start
```

------------------------------------------------------------------------

## Test

```bash
npm test
```

-------------------------------------------------


## See also

* [Custom events in Web Components](https://gomakethings.com/custom-events-in-web-components/)
* [Web Component lifecycle methods](https://gomakethings.com/the-web-component-lifecycle-methods/)
* [How to detect when attributes change on a Web Component](https://gomakethings.com/how-to-detect-when-attributes-change-on-a-web-component/)
* [Handling asychronous rendering in Web Components](https://gomakethings.com/handling-asychronous-rendering-in-web-components/)
* [Accessible Icon Buttons](https://www.sarasoueidan.com/blog/accessible-icon-buttons/)
* [Inclusively Hidden](https://www.scottohara.me/blog/2017/04/14/inclusively-hidden.html)
