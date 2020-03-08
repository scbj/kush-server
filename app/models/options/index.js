export const transformId = {
  virtuals: true,
  transform (doc, obj) {
    if (!obj.id) {
      obj.id = obj._id
    }
    delete obj._id
    delete obj.__v
    delete obj.user_id

    return obj
  }
}
