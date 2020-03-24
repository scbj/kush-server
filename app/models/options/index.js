/**
 * Create a transform object to be use in Mongoose at Schema.set('toJson', [here]).
 * @param {Object} keepingOptions Use 0 or 1 (false or true) for each value
 */
export function createTransform (keepingOptions) {
  return {
    virtuals: true,
    transform (doc, obj) {
      // If there is at least one true value then start from an empty object
      // and add only the specified attributes (with the true value).
      const isKeepOnlyWhatIsSpecified = Object.values(keepingOptions)
        .some(b => b)
      if (isKeepOnlyWhatIsSpecified) {
        return Object.keys(keepingOptions)
          .filter(key => keepingOptions[key])
          .reduce((prev, key) => Object.assign(prev, { [key]: obj[key] }), {})
      }

      // Here we can claims that there is no value to true so we delete
      // only those specified.
      Object.keys(keepingOptions)
        .forEach(key => delete obj[key])
      return obj
    }
  }
}
