import regex from './regex'

/** @param {String} prefix */
export function startWith (prefix) {
  const escaped = regex.escape(prefix)
  const reg = new RegExp(`^${escaped}`)
  return {
    validator: value => reg.test(value),
    msg: `{VALUE} doesn't start with '${prefix}'!`
  }
}

export const positiveNumber = {
  validator: value => value >= 0,
  msg: "{VALUE} isn't positive!"
}

export const ipAddress = {
  validator: value => regex.ipAddress,
  msg: "{VALUE} isn't a IP address valid"
}

export const operatingSystem = {
  validator (value) {
    if (typeof value !== 'string') return false

    const os = [
      'windows',
      'mac',
      'linux',
      'other'
    ]
    return os.indexOf(value.toLowerCase()) !== -1
  },
  msg: "{VALUE} isn't a operating system valid"
}
