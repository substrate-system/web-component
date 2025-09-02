# Server-Side HTML Rendering for Web Components

This example demonstrates how to add server-side rendering support to web components using the `/html` export.

## Basic Usage

```javascript
import { render } from '@substrate-system/web-component/html'

// Define a component
class MyComponent {
    static TAG = 'my-component'
}

// Render to HTML string
const html = render(MyComponent, { class: 'example' }, 'Hello World')
// Output: <my-component class="example">Hello World</my-component>
```

## Advanced Usage with Custom Rendering

```javascript
import { render } from '@substrate-system/web-component/html'

class ButtonComponent {
    static TAG = 'custom-button'
    
    // Optional: Custom server-side rendering
    static renderToString(attrs = {}, children = '') {
        const disabled = attrs.disabled ? ' disabled' : ''
        const className = attrs.class ? ` class="${attrs.class}"` : ''
        return `<button${className}${disabled}>${children}</button>`
    }
}

// This will use the custom renderToString method
const buttonHtml = render(ButtonComponent, 
    { class: 'btn btn-primary', disabled: true }, 
    'Click me'
)
// Output: <button class="btn btn-primary" disabled>Click me</button>
```

## Multiple Components

```javascript
import { renderComponents } from '@substrate-system/web-component/html'

const html = renderComponents([
    { component: HeaderComponent, attrs: { class: 'header' } },
    { component: MainComponent, children: '<p>Content</p>' },
    { component: FooterComponent }
])
```

## Wrapping Content

```javascript
import { wrapInContainer } from '@substrate-system/web-component/html'

const content = render(MyComponent)
const wrappedHtml = wrapInContainer(content, 'div', { class: 'container' })
// Output: <div class="container"><my-component></my-component></div>
```

## Integration with Existing WebComponent Class

To make your existing WebComponent classes compatible with server-side rendering:

```javascript
import { WebComponent } from '@substrate-system/web-component'
import { render } from '@substrate-system/web-component/html'

class MyWebComponent extends WebComponent.create('my-web-component') {
    render() {
        this.innerHTML = `<div class="content">
            <h1>Hello World</h1>
        </div>`
    }
    
    // Add server-side rendering support
    static renderToString(attrs = {}, children = '') {
        return `<my-web-component${Object.keys(attrs).length ? ' ' + Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(' ') : ''}>
            <div class="content">
                <h1>Hello World</h1>
                ${children}
            </div>
        </my-web-component>`
    }
}

// Use in browser
MyWebComponent.define()

// Use in Node.js server
const serverHtml = render(MyWebComponent, { id: 'main' })
```

This approach allows the same component to work in both browser and server environments.