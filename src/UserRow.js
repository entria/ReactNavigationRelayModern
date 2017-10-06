// @flow

import React, { Component } from 'react'
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'

import { graphql, createFragmentContainer } from 'react-relay'

type Props = {
  onPress: Function,
  user: Object,
}

export default class UserRow extends Component<void, Props, any> {
  render() {
    const { onPress, user } = this.props

    return (
      <TouchableHighlight
        key={user.id}
        onPress={onPress}
        underlayColor="whitesmoke"
      >
        <View style={styles.container}>
          <Text>{user.name}</Text>
        </View>
      </TouchableHighlight>
    )
  }
}

// UserRowFragmentContainer
export const UserRowFragmentContainer = createFragmentContainer(
  UserRow,
  graphql`
    fragment UserRowFragment on User {
      id
      name
    }
  `
)

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
})
