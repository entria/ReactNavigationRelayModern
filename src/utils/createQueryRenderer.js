// @flow

import React from 'react'
import { QueryRenderer } from 'react-relay'
import { Text } from 'react-native'

import type { ReactClass } from 'react'
import type { GraphQLTaggedNode, Variables, Environment } from 'react-relay'

type Config = {
  query: ?GraphQLTaggedNode,
  queriesParams?: ?(props: Object) => Object,
  variables?: Variables,
  environment: Environment,
  loading: ReactClass<*>,
  error: ReactClass<*>,
}

export default function createQueryRenderer(
  FragmentComponent: ReactClass<*>,
  config: Config
): ReactClass<*> {
  const { query, queriesParams, variables, environment } = config

  const Error = config.error || (error => <Text>{`${error}`}</Text>)
  const Loading = config.loading || (() => <Text>Loading</Text>)

  const QueryRendererWrapper = wrapperProps => {
    const queryVariables = queriesParams
      ? queriesParams(wrapperProps)
      : variables

    return (
      <QueryRenderer
        query={query}
        variables={queryVariables}
        environment={environment}
        render={({ error, retry, props }) => {
          if (error) {
            return <Error error={error} retry={retry} />
          }

          if (props) {
            return <FragmentComponent {...wrapperProps} query={props} />
          }

          return <Loading />
        }}
      />
    )
  }

  return QueryRendererWrapper
}
