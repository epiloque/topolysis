import {
  difference,
  extend,
  flatten,
  forEach,
  includes,
  keys,
  map,
  uniq,
  values
} from 'lodash'

export interface TopolysisInterface {
  test?: string[]
  [key: string]: string[]
}

function extra (graph: TopolysisInterface): TopolysisInterface {
  forEach(flatten(uniq(values(graph))), (label: string) => {
    if (!includes(keys(graph), label)) {
      const extension = {}
      extension[label] = []
      graph = extend(graph, extension)
    }
  })

  return graph
}

function cleanup (data: TopolysisInterface): TopolysisInterface {
  const graph: TopolysisInterface = {}

  forEach(keys(data), (label: string) => {
    graph[label] = []

    map(data[label], (dependency: string) => {
      if (dependency !== label) {
        graph[label].push(dependency)
      }

      return dependency
    })

    graph[label] = uniq(graph[label])
  })

  return extra(graph)
}

function order (graph: TopolysisInterface): string[] {
  const ordered: string[] = []

  forEach(keys(graph), (label: string) => {
    const dependencies: string[] = graph[label]

    if (dependencies.length === 0) {
      ordered.push(label)
    }
  })

  return uniq(ordered)
}

function walk (graph: TopolysisInterface, ordered: string[]) {
  const result = {}

  forEach(keys(graph), (label: string) => {
    if (!includes(ordered, label)) {
      const dependencies: string[] = graph[label]
      result[label] = uniq(difference(dependencies, ordered))
    }
  })

  return result
}

export class CircularDependencyError extends Error {
  data: TopolysisInterface

  constructor (message: string, data: TopolysisInterface) {
    super(message)

    this.data = data

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, CircularDependencyError.prototype)
  }
}

export function* topolysis (data: TopolysisInterface): IterableIterator<string[]> {
  let graph = cleanup(data)

  do {
    const ordered = order(graph)
    graph = walk(graph, ordered)

    if (ordered.length === 0) {
      break
    }

    yield ordered.sort()
  } while (true)

  if (values(graph).length !== 0) {
    throw new CircularDependencyError(
      `topolysis: circular dependency detected`,
      graph
    )
  }
}

// tslint:disable-next-line
export default topolysis
