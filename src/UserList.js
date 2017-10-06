// @flow

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import hoistStatics from 'hoist-non-react-statics';
import environment from './createRelayEnvironment';
import createQueryRenderer from './utils/createQueryRenderer'

import {
  createPaginationContainer,
  graphql,
} from 'react-relay';

import { type UserList_query } from './__generated__/UserList_query.graphql';
import { type UserRowFragment } from './__generated__/UserRowFragment.graphql';
import UserRow from './UserRow'

type Props = {
  query: UserDetail_query,
};

type State = {
  isFetchingTop: boolean,
};

@withNavigation
class UserList extends Component<any, Props, State> {
  static navigationOptions = {
    title: 'UserList',
  };

  state = {
    isFetchingTop: false,
  };

  onRefresh = () => {
    const { users } = this.props.query;

    if (this.props.relay.isLoading()) {
      return;
    }

    this.setState({
      isFetchingTop: true,
    })

    this.props.relay.refetchConnection(users.edges.length, (err) => {
      this.setState({
        isFetchingTop: false,
      });
    });
  };

  onEndReached = () => {
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
      return;
    }

    // fetch more 2
    this.props.relay.loadMore(2, (err) => {
      console.log('loadMore: ', err);
    });
  };

  renderItem = ({ item }) => {
    const { node: user } = item;

    return (
      <UserRow user={user} onPress={() => this.goToUserDetail(user)} />
    );
  };

  goToUserDetail = user => {
    const { navigate } = this.props.navigation;

    navigate('UserDetail', { id: user.id });
  };

  render() {
    const { users } = this.props.query;

    return (
      <View style={styles.container}>
        <FlatList
          data={users.edges}
          renderItem={this.renderItem}
          keyExtractor={item => item.node.id}
          onEndReached={this.onEndReached}
          onRefresh={this.onRefresh}
          refreshing={this.state.isFetchingTop}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListFooterComponent={this.renderFooter}
        />
      </View>
    );
  }
}

const UserListPaginationContainer = createPaginationContainer(
  UserList,
  {
    query: graphql`
      fragment UserList_query on Query {
        users(
          first: $count
          after: $cursor
        ) @connection(key: "UserList_users") {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id # remove this after fix UserRowFragment
              name # remove this after fix UserRowFragment
              ...UserRowFragment
            }
          }
        }
      } 
    `,
  },
  {
    direction: 'forward',
    getConnectionFromProps(props) {
      return props.query && props.query.users;
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      };
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
      };
    },
    variables: { cursor: null },
    query: graphql`
      query UserListPaginationQuery (
        $count: Int!,
        $cursor: String
      ) {
        ...UserList_query
      }
    `,
  },
);

const UserListQueryRenderer = props => {
  const QueryRenderer = createQueryRenderer(UserListPaginationContainer, {
    query: graphql`
      query UserListQuery(
        $count: Int!,
        $cursor: String
      ) {
        ...UserList_query
      }
    `,
    variables: { cursor: null, count: 1 },
    environment,
  })

  return <QueryRenderer {...props} />
}

export default hoistStatics(UserListQueryRenderer, UserList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#cccccc',
  },
});
