export default {
  // eslint-disable-next-line max-len
  ipAddress: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,

  escape (value) {
    if (typeof value !== 'string') return null
    return value.replace(/[-[\]{}()*+?.,\\^$|]/g, '\\$&')
  }
}
