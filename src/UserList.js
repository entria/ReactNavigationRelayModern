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
import ViewerQuery from './ViewerQuery';
import { createRenderer } from './RelayUtils';

type Props = {};

type State = {
  isFetchingTop: boolean,
  isFetchinEnd: boolean,
};

class UserList extends Component<any, Props, State> {
  static navigationOptions = {
    title: 'UserList',
  };

  state = {
    isFetchingTop: false,
    isFetchingEnd: false,
  };

  onRefresh = () => {
    const { isFetchingTop } = this.state;

    if (isFetchingTop) return;

    this.setState({ isFetchingTop: true });

    this.props.relay.forceFetch({}, readyState => {
      if (readyState.done || readyState.aborted) {
        this.setState({
          isFetchingTop: false,
          isFetchingEnd: false,
        });
      }
    });
  };

  onEndReached = () => {
    const { isFetchingEnd } = this.state;
    const { users } = this.props.viewer;

    if (isFetchingEnd) return;
    if (!users.pageInfo.hasNextPage) return;

    this.setState({ isFetchingEnd: true });

    this.props.relay.setVariables(
      {
        count: this.props.relay.variables.count + 10,
      },
      readyState => {
        if (readyState.done || readyState.aborted) {
          this.setState({ isFetchingEnd: false });
        }
      },
    );
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
          refreshing={this.state.isFetchingTop}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListFooterComponent={this.renderFooter}
        />
      </View>
    );
  }
}

// Create a Relay.Renderer container
export default createRenderer(UserList, {
  queries: ViewerQuery,
  initialVariables: {
    count: 5,
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        users(first: $count) {
          pageInfo {
            hasNextPage
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
});

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
