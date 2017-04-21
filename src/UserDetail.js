import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Relay from 'react-relay';
import ViewerQuery from './ViewerQuery';
import { createRenderer } from './RelayUtils';

class UserDetail extends Component {
  static navigationOptions = {
    title: 'UserDetail',
  };

  render() {
    const { user } = this.props.viewer;

    return (
      <View style={styles.container}>
        <Text>ID: {user.id}</Text>
        <Text>Name: {user.name}</Text>
        <Text>Email: {user.email}</Text>
      </View>
    );
  }
}

// Create a Relay.Renderer container
export default createRenderer(UserDetail, {
  queries: ViewerQuery,
  queriesParams: ({ navigation }) => ({
    id: navigation.state.params.id,
  }),
  initialVariables: {
    id: null,
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        user(id: $id) {
          id
          name
          email
        }
      }
    `,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
