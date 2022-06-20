import _ from 'lodash'
import assert from 'power-assert'
import api from './fixtures/github-api.js'
import { Router } from '../index.js'
import './node.js'

const funcPrefix = 'github-api'

function createFunc(name) {
  var a = `(function ${name||''}(){})`
  return eval(a)
}

describe('GitHub API', () => {
  let r

  beforeEach(() => {
    r = new Router()
    _.shuffle(api).forEach((i) => {
      let [method, path] = i
      r.add(method, path, createFunc(_.camelCase(funcPrefix + path)))
    })

  })

  it('GitHub API routes', () => {
    r.tree.printTree('', true)
  })

  _.shuffle(api).forEach((i) => {
    let [method, path, realpath] = i
    it(path, () => {
      let [handler, params] = r.find(method, realpath)
      // console.log(path, realpath, handler, params)
      assert.notEqual(null, handler)
      assert.equal(_.camelCase(funcPrefix + path), handler.name)
      assert.equal((path.match(/\:/g) || []).length, params.length)
    })
  })
})
