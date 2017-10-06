// @flow

import React, { Component } from 'react'
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'

type Props = {
  onPress: Function,
  user: Object,
}

export default class UserRow extends Component<void, Props, any> {
  render() {
    const { onPress, user } = this.props

    return (
      <TouchableHighlight onPress={onPress} underlayColor="whitesmoke">
        <View style={styles.container}>
          <Text>{user.name}xxx</Text>
        </View>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
})
