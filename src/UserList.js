// @flow

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  FlatList,
} from 'react-native';
import Relay from 'react-relay/classic';
import { withNavigation } from 'react-navigation';
import hoistStatics from 'hoist-non-react-statics';

const {
  createPaginationContainer,
  graphql,
  QueryRenderer,
} = require('react-relay/compat');

@withNavigation
class UserList extends Component {
  static navigationOptions = {
    title: 'UserList',
  };

  state = {
    isFetchingTop: false,
    isFetchingEnd: false,
  };

  onRefresh = () => {
    const { users } = this.props.viewer;

    if (this.props.relay.isLoading()) {
      return;
    }

    this.props.relay.refetchConnection(users.edges.length, (err) => {
      console.log('refetchConnection: ', err);
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
    const { node } = item;

    return (
      <TouchableHighlight
        onPress={() => this.goToUserDetail(node)}
        underlayColor="whitesmoke"
      >
        <View style={styles.userContainer}>
          <Text>{node.name}</Text>
        </View>
      </TouchableHighlight>
    );
  };

  goToUserDetail = user => {
    const { navigate } = this.props.navigation;

    navigate('UserDetail', { id: user.id });
  };

  render() {
    const { users } = this.props.viewer;

    return (
      <View style={styles.container}>
        <FlatList
          data={users.edges}
          renderItem={this.renderItem}
          keyExtractor={item => item.node.id}
          onEndReached={this.onEndReached}
          onRefresh={this.onRefresh}
          refreshing={this.props.relay.isLoading()}
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
    viewer: graphql`
      fragment UserList_viewer on Viewer {
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
              id
              name
            }
          }
        }
      } 
    `,
  },
  {
    direction: 'forward',
    getConnectionFromProps(props) {
      console.log('conn: ', props);

      return props.viewer && props.viewer.users;
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
        viewer {
          ...UserList_viewer
        }
      }
    `,
  },
);

const UserListQueryRenderer = () => {
  return (
    <QueryRenderer
      environment={Relay.Store}
      query={graphql`
      query UserListQuery(
        $count: Int!,
        $cursor: String
      ) {
        viewer {
          ...UserList_viewer
        }
      }
    `}
      variables={{cursor: null, count: 1}}
      render={({error, props}) => {
        console.log('UserListQueryRenderer: ', error,  props);
        if (props) {
          return <UserListPaginationContainer viewer={props.viewer} />;
        } else {
          return (
            <Text>Loading</Text>
          )
        }
      }}
    />
  )
};

export default hoistStatics(UserListQueryRenderer, UserList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#cccccc',
  },
  userContainer: {
    margin: 20,
  },
});
