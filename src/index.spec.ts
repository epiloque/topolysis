import chai = require('chai')

import {
  CircularDependencyError,
  topolysis
} from '../src'

import {
  noop
} from 'lodash'

const caseA = {
  'tie your shoes': ['put on your shoes'],
  'put on your shoes': ['put on your shorts'],
  'put on your jacket': ['put on your shirt', 'put on your shorts']
}

const caseB = {
  abe: ['herb', 'homer'],
  gaby: ['herb'],
  mona: ['homer'],
  homer: ['bart', 'lisa', 'maggie'],
  marge: ['bart', 'lisa', 'maggie'],
  clancy: ['selma', 'patty', 'marge'],
  jackie: ['selma', 'patty', 'marge'],
  selma: ['ling'],
  bart: ['stampy']
}

const nested = {
  foo_rbody: {
    query: {
      info: {
        acme_no: '444444',
        road_runner: '123'
      },
      error: 'no_lunch',
      message: 'runner problem.'
    }
  }
}

const error = {
  a: ['b'],
  b: ['c'],
  c: ['d'],
  d: ['a']
}

describe('Topologically sort directed acyclic graph', () => {
  it('with the correct order', () => {
    const result = []
    for (const x of topolysis(caseA)) {
      result.push(x)
    }

    const expectation = [
      ['put on your shirt', 'put on your shorts'],
      ['put on your jacket', 'put on your shoes'],
      ['tie your shoes']
    ]

    return chai.expect(result).deep.equal(expectation)
  })

  it('with the correct order (case B)', () => {
    const result = []
    for (const x of topolysis(caseB)) {
      result.push(x)
    }

    const expectation = [
      ['herb', 'ling', 'lisa', 'maggie', 'patty', 'stampy'],
      ['bart', 'gaby', 'selma'],
      ['homer', 'marge'],
      ['abe', 'clancy', 'jackie', 'mona']
    ]

    return chai.expect(result).deep.equal(expectation)
  })

  it('error on circular dependencies', () => {
    function circular () {
      for (const x of topolysis(error)) {
        noop()
      }
    }

    return chai.expect(circular).to.throw(CircularDependencyError)
  })
})
