# koa-queries

Convent URL query to mongoose queries


### Installation

`$ npm install koa-queries`


### Usage

```js
const app = require('koa')()
const koaQueries = require('koa-quires')
 
app.use(koaQueries())

app.user(async (ctx) => {
    const { query, filter, sort,  } = ctx.state

    // other
    if (ctx.user.is_admin) {
        query.state = 4
    }

    ctx.body = await ctx.db.News.find(query, filter)
        // TODO: v 1.0.2 add pagination
        // .skip(skip)
        // .limit(limit)
        .sort(sort)
        
})
```


### Quick Start

***GET:***

```bash
/api/v1/news?catalog_is=commom
&title_startsWith=today
&viewCount_gte=100
&content.markdown_is=isNull
&_asc=createdAt
&_filter=-content,-description
```

***Queries:***

```js
// ctx.state.query
{
    catalog: 'common',
    title: /^today/,
    viewCount: { $gte: 100 },
    'content.markdown': null,
    // content: { markdown: null },
}

// filter
// mongoose remove/select fields
'-content -description'

// ctx.state.sort
{
    createdAt: 1
}
```


### API

```js
// read source..
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
          const $gte = Number(value)
          if (!isNaN($gte)) {
            query[key] = {
              $gte
            }
          }
          break
        case 'lte':
          const $lte = Number(value)
          if (!isNaN($lte)) {
            query[key] = {
              $lte
            }
          }
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
```

