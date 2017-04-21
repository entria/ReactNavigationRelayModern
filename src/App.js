import React from 'react';
import { StackNavigator } from 'react-navigation';

import UserList from './UserList';
import UserDetail from './UserDetail';

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
