// @flow

import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  graphql,
  createFragmentContainer,
  QueryRenderer,
} from 'react-relay';
import environment from './createRelayEnvironment';

import { type UserDetail_query } from './__generated__/UserDetail_query.graphql';

type Props = {
  query: UserDetail_query,
};

class UserDetail extends Component<void, Props, any> {
  static navigationOptions = {
    title: 'UserDetail',
  };

  render() {
    const { user } = this.props.query;

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
    fragment UserDetail_query on Query {
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
      environment={environment}
      query={graphql`
      query UserDetailQuery($id: ID!) {
        ...UserDetail_query
      }
    `}
      variables={{id: navigation.state.params.id}}
      render={({error, props}) => {
        if (props) {
          return <UserDetailFragmentContainer query={props} />;
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
