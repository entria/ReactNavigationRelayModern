// @flow

import React, { Component } from 'react'
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'

import { graphql, createFragmentContainer, QueryRenderer } from 'react-relay'
import environment from './createRelayEnvironment'

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
          <Text>{user.name}xxx</Text>
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
const UserRowQueryRenderer = ({ onPress, userId }) => {
  return (
    <QueryRenderer
      environment={environment}
      query={graphql`
      query UserRowQuery($id: ID!) {
        ...UserRow_query
      }
    `}
      variables={{ id: userId }}
      render={({ error, props }) => {
        if (props) {
          return <UserRowFragmentContainer query={props} onPress={onPress} />
        } else {
          return <Text>Loading</Text>
        }
      }}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
})

export default UserRowQueryRenderer
