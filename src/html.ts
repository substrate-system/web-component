import type { Attrs } from './attributes.js'
import { toAttributes } from './attributes.js'

/**
 * Interface for components that can be rendered to HTML strings
 */
export interface ServerRenderable {
    TAG: string
    renderToString?: (attrs?: Attrs, children?: string) => string
}

/**
 * Default server-side rendering function for web components.
 * Renders a web component as an HTML string with optional attributes and children.
 *
 * @param component The web component class with a TAG property
 * @param attrs Optional attributes object
 * @param children Optional inner HTML content as string
 * @returns HTML string representation of the component
 */
export function render<T extends ServerRenderable> (
    component: T,
    attrs: Attrs = {},
    children: string = ''
): string {
    // If the component has a custom renderToString method, use it
    if (component.renderToString) {
        return component.renderToString(attrs, children)
    }

    // Default rendering: create the custom element tag with attributes and children
    const tagName = component.TAG
    const attributesString = toAttributes(attrs)
    const attributesWithSpace = attributesString ? ` ${attributesString}` : ''

    // Self-closing tag if no children
    if (!children.trim()) {
        return `<${tagName}${attributesWithSpace}></${tagName}>`
    }

    return `<${tagName}${attributesWithSpace}>${children}</${tagName}>`
}

/**
 * Helper function to render multiple components
 *
 * @param components Array of component render configurations
 * @returns Combined HTML string
 */
export function renderComponents (components: Array<{
    component: ServerRenderable,
    attrs?: Attrs,
    children?: string
}>): string {
    return components.map(({ component, attrs, children }) =>
        render(component, attrs, children)
    ).join('')
}

/**
 * Utility function to wrap rendered content in a container
 *
 * @param content The HTML content to wrap
 * @param containerTag The container tag name (default: 'div')
 * @param containerAttrs Optional attributes for the container
 * @returns Wrapped HTML string
 */
export function wrapInContainer (
    content: string,
    containerTag: string = 'div',
    containerAttrs: Attrs = {}
): string {
    const attributesString = toAttributes(containerAttrs)
    const attributesWithSpace = attributesString ? ` ${attributesString}` : ''
    return `<${containerTag}${attributesWithSpace}>${content}</${containerTag}>`
}
