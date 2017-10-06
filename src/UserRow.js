// @flow

import React, { Component } from 'react'
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'

import { graphql, createFragmentContainer } from 'react-relay'
import environment from './createRelayEnvironment'
import createQueryRenderer from './utils/createQueryRenderer'

import { type UserRow_query } from './__generated__/UserRow_query.graphql'

type Props = {
  onPress: Function,
  query: UserRow_query,
}

class UserRow extends Component<void, Props, any> {
  render() {
    const { onPress, query: { user } } = this.props

    return (
      <TouchableHighlight onPress={onPress} underlayColor="whitesmoke">
        <View style={styles.container}>
          <Text>{user.name}</Text>
        </View>
      </TouchableHighlight>
    )
  }
}

// UserRowFragmentContainer
const UserRowFragmentContainer = createFragmentContainer(
  UserRow,
  graphql`
    fragment UserRow_query on Query {
      user(id: $id) {
        name
      }
    }
  `
)

// UserRowQueryRenderer
const UserRowQueryRenderer = ({ userId, ...props }) => {
  const QueryRenderer = createQueryRenderer(UserRowFragmentContainer, {
    query: graphql`
    query UserRowQuery($id: ID!) {
      ...UserRow_query
    }
  `,
    variables: { id: userId },
    environment,
  })

  return <QueryRenderer {...props} />
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
})

export default UserRowQueryRenderer
