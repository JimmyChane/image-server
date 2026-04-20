export function wrapBlack(text: string) {
  return `\u001B[30m${text}\u001B[0m`;
}
export function wrapRed(text: string) {
  return `\u001B[31m${text}\u001B[0m`;
}
export function wrapGreen(text: string) {
  return `\u001B[32m${text}\u001B[0m`;
}
export function wrapYellow(text: string) {
  return `\u001B[33m${text}\u001B[0m`;
}
export function wrapBlue(text: string) {
  return `\u001B[34m${text}\u001B[0m`;
}
export function wrapPurple(text: string) {
  return `\u001B[35m${text}\u001B[0m`;
}
export function wrapCyan(text: string) {
  return `\u001B[36m${text}\u001B[0m`;
}
export function wrapWhite(text: string) {
  return `\u001B[37m${text}\u001B[0m`;
}
