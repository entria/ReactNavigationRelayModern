import React from 'react';
import Relay from 'react-relay';
import { StackNavigator } from 'react-navigation';

import RelayStore from './RelayStore';

import UserList from './UserList';
import UserDetail from './UserDetail';

RelayStore.reset(
  new Relay.DefaultNetworkLayer('http://localhost:5000/graphql'),
);

const RelayApp = StackNavigator(
  {
    UserList: { screen: UserList },
    UserDetail: { screen: UserDetail },
  },
  {
    initialRouteName: 'UserList',
  },
);

export default () => <RelayApp />;
