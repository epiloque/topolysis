'use strict'

const values = require('object-values')
const unique = require('array-unique')
const extend = require('xtend')

function extra (graph) {
	const dependencies = unique(values(graph).reduce( function (p, c) {
		return [].concat(p, c)
	}))

	dependencies.filter(function (i) {
		return Object.keys(graph).indexOf(i) < 0
	}).forEach(function (label) {
		const extension = {}
		extension[label] = []
		graph = extend(graph, extension)
	})

	return graph
}

function cleanup (object) {
	const graph = {}

	Object.keys(object).forEach(function (label) {
		graph[label] = []

		object[label].map(function (dependency) {
			if (dependency !== label) {
				graph[label].push(dependency)
			}
			return dependency
		})

		graph[label] = unique(graph[label])
	})

	return extra(graph)
}

function order (graph) {
	const ordered = []
	Object.keys(graph).forEach(function (label) {
		const dependencies = graph[label]
		if (dependencies.length === 0) {
			ordered.push(label)
		}
	})

	return unique(ordered)
}

function walk (graph, ordered) {
	const result = {}
	Object.keys(graph).forEach(function (label) {
		if (ordered.indexOf(label) === -1) {
			const dependencies = graph[label]
			result[label] = unique(dependencies.filter(function (i) {
				return ordered.indexOf(i) === -1
			}))
		}
	})

	return result
}

function CircularDependencyError (message, extra) {
	Error.captureStackTrace(this, this.constructor)
	this.name = this.constructor.name
	this.message = message
	this.extra = extra
}

function *topolysis (data) {
	let graph = cleanup(data)

	do {
		const ordered = order(graph)
		graph = walk(graph, ordered)

		if (ordered.length === 0) {
			break
		}

		yield ordered.sort()
	}
	while (true)

	if (values(graph).length !== 0) {
		throw new CircularDependencyError('Two or more modules are mutually recursive', graph)
	}
}

module.exports = topolysis
module.exports.CircularDependencyError = CircularDependencyError
