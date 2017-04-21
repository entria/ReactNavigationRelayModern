import React from 'react';
import RelayClassic from 'react-relay/classic';
import { StackNavigator } from 'react-navigation';

import UserList from './UserList';
import UserDetail from './UserDetail';

RelayClassic.injectNetworkLayer(
  new RelayClassic.DefaultNetworkLayer('http://localhost:5000/graphql')
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
