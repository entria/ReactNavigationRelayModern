import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Relay from 'react-relay/classic';

import {
  graphql,
  createFragmentContainer,
  QueryRenderer,
} from 'react-relay/compat';

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

// UserDetailFragmentContainer
const UserDetailFragmentContainer = createFragmentContainer(
  UserDetail,
  graphql`
    fragment UserDetail_viewer on Viewer {
      user(id: $id) {
        id
        name
        email
      }
    }
  `,
);

// UserDetailQueryRenderer
const UserDetailQueryRenderer = ({ navigation }) => {
  return (
    <QueryRenderer
      environment={Relay.Store}
      query={graphql`
      query UserDetailQuery($id: ID!) {
        viewer {
          ...UserDetail_viewer
        }
      }
    `}
      variables={{id: navigation.state.params.id}}
      render={({error, props}) => {
        if (props) {
          return <UserDetailFragmentContainer viewer={props.viewer} />;
        } else {
          return (
            <Text>Loading</Text>
          )
        }
      }}
    />
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default UserDetailQueryRenderer;
