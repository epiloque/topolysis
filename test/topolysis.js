'use strict'

const chai = require('chai')
const topolysis = require('../')

const data = {
	'tie your shoes': ['put on your shoes'],
	'put on your shoes': ['put on your shorts'],
	'put on your jacket': ['put on your shirt', 'put on your shorts']
}

const error = {
	a: ['b'],
	b: ['c'],
	c: ['d'],
	d: ['a']
}

describe('Topologically sort directed acyclic graph', function () {
	it('with the correct order', function () {
		const result = []
		for (const x of topolysis(data)) {
			result.push(x)
		}

		const expectation = [
			['put on your shirt', 'put on your shorts'],
			['put on your jacket', 'put on your shoes'],
			['tie your shoes']
		]

		chai.expect(result).deep.equal(expectation)
	})

	it('error on circular dependencies', function () {
		function circular () {
			for (const x of topolysis(error)) {	}
		}
		chai.expect(circular).to.throw(topolysis.CircularDependencyError)
	})
})
