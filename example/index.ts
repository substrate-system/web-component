import './index.css'
import { WebComponent } from '../src/index.js'
import Debug from '@substrate-system/debug'
const debug = Debug()

// for docuement.querySelector
declare global {
    interface HTMLElementTagNameMap {
        'my-element': MyElement;
    }
}

// use the factory function
class MyElement extends WebComponent.create('my-element') {
    connectedCallback () {
        this.innerHTML = `<div class="example">
            <p>hello example element</p>
            <button class="namespaced" 
                    aria-describedby="namespaced-help">
                Emit a namespaced event
            </button>
            <p id="namespaced-help" class="button-help">
                Triggers a custom event with namespace prefix (my-element:click)
            </p>
            
            <button class="regular" 
                    aria-describedby="regular-help">
                Emit a regular event
            </button>
            <p id="regular-help" class="button-help">
                Triggers a standard click event without namespace
            </p>
        </div>`

        // Set up accessible button interactions
        const namespacedBtn = this.querySelector('button.namespaced')
        const regularBtn = this.querySelector('button.regular')

        namespacedBtn?.addEventListener('click', ev => {
            ev.preventDefault()
            ev.stopPropagation()
            this.emit<string>('click', { detail: 'some data' })
            // Announce to screen readers
            this.announceToScreenReader('Namespaced event emitted')
        })

        regularBtn?.addEventListener('click', ev => {
            ev.preventDefault()
            ev.stopPropagation()
            this.dispatch('click', { detail: 'some more data' })
            // Announce to screen readers
            this.announceToScreenReader('Regular event emitted')
        })

        // Set ARIA labels for better accessibility
        this.setAria('label', 'Interactive web component example')
        this.setAria('role', 'region')
    }

    /**
     * Announce message to screen readers
     */
    announceToScreenReader (message: string) {
        const announcement = document.createElement('div')
        announcement.setAttribute('aria-live', 'assertive')
        announcement.setAttribute('aria-atomic', 'true')
        announcement.className = 'sr-only'
        announcement.textContent = message

        document.body.appendChild(announcement)

        // Remove after announcement
        setTimeout(() => {
            document.body.removeChild(announcement)
        }, 1000)
    }
}

if ('customElements' in window) {
    MyElement.define()
}

// Insert component into the designated section
const componentSection = document.querySelector('section[aria-labelledby="component-section"]')
if (componentSection) {
    componentSection.innerHTML += '<my-element></my-element>'
}

const el = document.querySelector('my-element')
debug('the namespaced event...', MyElement.event('aaa'))

const buttons = el?.qsa('button')
debug('the buttons', buttons)

el?.addEventListener('my-element:click', ev => {
    debug('got a namespaced click', ev.detail)
    debug('the full event name: ', ev.type)
})

el?.addEventListener(MyElement.event('click'), ev => {
    debug('got the click by using .event method', ev.detail)

    const eventContent = document.querySelector('.last-event-content')
    if (eventContent) {
        eventContent.innerHTML = `
            <div>
                <strong>Event Type:</strong> <code>${ev.type}</code>
            </div>
            <div>
                <strong>Event Data:</strong> <code>${ev.detail}</code>
            </div>
        `
        // Update accessible description
        eventContent.setAttribute('aria-label', `Latest event: ${ev.type} with data: ${ev.detail}`)
    }
})

el?.addEventListener('click', ev => {
    debug('got a regular click', ev.type)
    debug('event data: ', ev.detail)

    const eventContent = document.querySelector('.last-event-content')
    if (eventContent) {
        eventContent.innerHTML = `
            <div>
                <strong>Event Type:</strong> <code>${ev.type}</code>
            </div>
            <div>
                <strong>Event Data:</strong> <code>${ev.detail}</code>
            </div>
        `
        // Update accessible description
        eventContent.setAttribute('aria-label', `Latest event: ${ev.type} with data: ${ev.detail}`)
    }
})
