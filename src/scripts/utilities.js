export function clone(object) {
  if (typeof object === "undefined") return object
    return JSON.parse(JSON.stringify(object))
}
export function removeAccents(str) {
    return  str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}