import fg from 'fast-glob'
import { resolve } from 'path'

export class Container {
  private container: Map<PropertyKey, any>

  constructor() {
    this.container = new Map<PropertyKey, any>()
  }

  load(dir) {
    this.container.clear()

    const files = fg.sync([].concat(dir), {
      onlyFiles: true,
      dot: false
    })
    for (const file of files) {
      const exports = require(resolve(process.cwd(), file))
      for (const m in exports) {
        const mod = exports[m]
        const meta = Reflect.getMetadata('ioc:class', mod)
        if (meta) {
          this.bind(meta.id, mod, meta.args)
        }
      }
    }
  }

  bind(id, target, args?: any[]) {
    this.container.set(id, {
      target,
      args
    })
  }

  use(id: string, args?: any[]) {
    const item = this.container.get(id)

    const factory = (target, args2?) => {
      const instance = Reflect.construct(target, args2 || [])
      const props = Reflect.getMetadata('ioc:props', target)
      if (props) {
        Object.entries(props).map(([k, v]: [string, any]) => {
          instance[k] = this.use(v.id, v.args)
        })
      }
      return instance
    }

    if (item) {
      if (!item.instance) {
        item.instance = factory(item.target, item.args)
      }
      return args ? factory(item.target, args) : item.instance
    } else {
      throw new Error(`'${id}' not registered.`)
    }
  }
}
