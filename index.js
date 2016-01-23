'use strict'

const _ = require('lodash')

function extra (graph) {
	_(graph)
	.values()
	.uniq()
	.flatten()
	.value()
	.forEach(function (label) {
		if (!_.includes(_.keys(graph), label)) {
			const extension = {}
			extension[label] = []
			graph = _.extend(graph, extension)
		}
	})

	return graph
}

function cleanup (data) {
	const graph = {}

	_(data).keys().forEach(function (label) {
		graph[label] = []

		_.map(data[label], function (dependency) {
			if (dependency !== label) {
				graph[label].push(dependency)
			}
			return dependency
		})

		graph[label] = _.uniq(graph[label])
	})

	return extra(graph)
}

function order (graph) {
	const ordered = []

	_(graph).keys().forEach(function (label) {
		const dependencies = graph[label]
		if (dependencies.length === 0) {
			ordered.push(label)
		}
	})

	return _.uniq(ordered)
}

function walk (graph, ordered) {
	const result = {}

	_(graph).keys().forEach(function (label) {
		if (!_.includes(ordered, label)) {
			const dependencies = graph[label]
			result[label] = _.uniq(_.difference(dependencies, ordered))
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

	if (_.values(graph).length !== 0) {
		throw new CircularDependencyError('Two or more modules are mutually recursive', graph)
	}
}

module.exports = topolysis
module.exports.CircularDependencyError = CircularDependencyError
