module.exports = (opt = {}) => {
  return async (ctx, next) => {
    ctx.state.query = {}
    const query = {}
    const sort = {
      _id: -1
    }
    if (ctx.query._desc) {
      delete sort._id
      sort[ctx.query._desc] = -1
    }
    if (ctx.query._asc) {
      delete sort._id
      sort[ctx.query._asc] = 1
    }
    let filter = ''
    Object.keys(ctx.query).forEach((_key) => {
      const [key, option] = _key.split('__')
      const value = ctx.query[_key]
      switch (option) {
        case 'filter':
          filter = value.split(',').join(' ')
          break
        case 'startsWith':
          query[key] = new RegExp(`^${value}`)
          break
        case 'like':
          query[key] = new RegExp(value, 'i')
          break
        case 'ilike':
          query[key] = new RegExp(['.*', ...value.split('').join('.*'), '.*'].join(''), 'gim')
          break
        case 'is':
          query[key] = value
          break
        case 'isNull':
          query[key] = null
          break
        case 'gte':
          const $gte = Number(value) || value
          query[key] = query[key] || {}
          query[key].$gte = $gte
          break
        case 'lte':
          const $lte = Number(value) || value
          query[key] = query[key] || {}
          query[key].$lte = $lte
          break
        case 'in':
          const $in = value.split(',')
          if ($in.length > 0) {
            query[key] = {
              $in
            }
          }
          break
        case 'nin':
          const $nin = value.split(',')
          if ($nin.length > 0) {
            query[key] = {
              $nin
            }
          }
          break
        case 'fresh':
          query.expiredAt = {
            $gte: Date.now()
          }
          break
      }
    })
    ctx.state.query = query
    ctx.state.sort = sort
    ctx.state.filter = filter
    await next()
  }
}
