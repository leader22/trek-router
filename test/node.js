import { format } from 'util'
import { Router } from '../index.js'

function prefix(tail, p, on, off) {
  return format('%s%s', p, tail ? on : off)
}

Router.Node.prototype.printTree = function printTree(pfx, tail, method = 'GET') {
  let result = this.map[method]
  let handler = result && result.handler
  let p = prefix(tail, pfx, '└── ', '├── ')
  console.log(
    '%s%s h=%s children=%s',
    p,
    this.prefix,
    handler ? handler.name : '',
    this.children.length
  )

  let nodes = this.children
  let l = nodes.length
  p = prefix(tail, pfx, '    ', '│   ')
  for (let i = 0; i < l - 1; ++i) {
    nodes[i].printTree(p, false)
  }
  if (l > 0) {
    nodes[l - 1].printTree(p, true)
  }
}
