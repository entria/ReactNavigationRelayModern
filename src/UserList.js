// @flow

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  RefreshControl,
  TouchableHighlight,
} from 'react-native';
import Relay from 'react-relay';
import ViewerQuery from './ViewerQuery';
import { createRenderer } from './RelayUtils';

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

type State = {
  isFetchingTop: boolean,
  isFetchinEnd: boolean,
}

class UserList extends Component {
  static navigationOptions = {
    title: 'UserList',
  };

  state: State = {
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

    this.props.relay.setVariables({
      count: this.props.relay.variables.count + 10,
    }, readyState => {
      if (readyState.done || readyState.aborted) {
        this.setState({ isFetchingEnd: false });
      }
    });
  };

  renderRow = ({ node }) => {
    return (
      <TouchableHighlight onPress={() => this.goToUserDetail(node)} underlayColor="whitesmoke">
        <View style={{ margin: 20 }}>
          <Text>{node.name}</Text>
        </View>
      </TouchableHighlight>
    )
  };

  goToUserDetail = (user) => {
    const { navigate } = this.props.navigation;

    navigate('UserDetail', { id: user.id });
  };

  render() {
    const { users } = this.props.viewer;

    console.log('UserList: ', users);

    return (
      <View style={styles.container}>
        <ListView
          pageSize={2}
          scrollRenderAheadDistance={1000}
          initialListSize={2}
          dataSource={ds.cloneWithRows(users.edges)}
          renderRow={this.renderRow}
          onEndReached={this.onEndReached}
          renderSeparator={ (secID, rowID ) => <View style={styles.separator} key={rowID}/> }
          enableEmptySections={true}
          removeClippedSubviews={true}
          refreshControl={
              <RefreshControl
                refreshing={this.state.isFetchingTop}
                onRefresh={this.onRefresh}
              />
            }
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
});
