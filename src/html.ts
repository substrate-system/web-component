const _data = {}

export function html (strings:string[], ...values) {
    const refs = o => {
        if (o && o.__children__) return this._placehold(o)
        if (o && o.isTonicTemplate) return o.rawText

        switch (Object.prototype.toString.call(o)) {
            case '[object HTMLCollection]':
            case '[object NodeList]': return this._placehold([...o])
            case '[object Array]': {
                if (o.every(x => x.isTonicTemplate && !x.unsafe)) {
                    return new TonicTemplate(o.join('\n'), null, false)
                }
                return _prop(o)
            }
            case '[object Object]':
            case '[object Function]':
            case '[object AsyncFunction]':
            case '[object Set]':
            case '[object Map]':
            case '[object WeakMap]':
            case '[object File]':
                return this._prop(o)
            case '[object NamedNodeMap]':
                return this._prop(Tonic._normalizeAttrs(o))
            case '[object Number]': return `${o}__float`
            case '[object String]': return Tonic.escape(o)
            case '[object Boolean]': return `${o}__boolean`
            case '[object Null]': return `${o}__null`
            case '[object HTMLElement]':
                return this._placehold([o])
        }

        if (typeof o === 'object' && o && o.nodeType === 1 &&
            typeof o.cloneNode === 'function'
        ) {
            return this._placehold([o])
        }
        return o
    }

    const out = []
    for (let i = 0; i < strings.length - 1; i++) {
        out.push(strings[i], refs(values[i]))
    }
    out.push(strings[strings.length - 1])

    const htmlStr = out.join('').replace(Tonic.SPREAD, (_, p) => {
        const o = Tonic._data[p.split('__')[1]][p]
        return Object.entries(o).map(([key, value]) => {
            const k = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
            if (value === true) return k
            else if (value) return `${k}="${Tonic.escape(String(value))}"`
            else return ''
        }).filter(Boolean).join(' ')
    })

    return new TonicTemplate(htmlStr, strings, false)
}

function _prop (o) {
    const id = this._id
    const p = `__${id}__${Tonic._createId()}__`
    _data[id] = _data[id] || {}
    Tonic._data[id][p] = o
    return p
}
