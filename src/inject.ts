
export function injectable(id: string, args?: any[]) {
  return function (target) {
    Reflect.defineMetadata('ioc:class', { id, args }, target)
    return target
  }
}

export function inject(id: string, args?: any[]) {
  return function (target, key) {
    const annotationTarget = target.constructor
    let meta = {}
    if (Reflect.hasMetadata('ioc:props', annotationTarget)) {
      meta = Reflect.getMetadata('ioc:props', annotationTarget)
    }

    meta[key] = { id, args }

    Reflect.defineMetadata('ioc:props', meta, annotationTarget)
  }
}
