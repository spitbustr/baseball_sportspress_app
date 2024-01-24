export function clone(object) {
    if (typeof object === "undefined") return object
    return JSON.parse(JSON.stringify(object))
  }
  