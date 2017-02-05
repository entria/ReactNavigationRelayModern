// @flow

import { Environment } from 'react-relay';
// import invariant from 'invariant';

// eslint-disable-next-line no-unused-vars
import RelayNetworkDebug from 'react-relay/lib/RelayNetworkDebug';

class RelayStore {
  constructor() {
    this._env = new Environment();
    this._networkLayer = null;
    this._taskScheduler = null;

    RelayNetworkDebug.init(this._env);
  }

  reset(networkLayer) {
    // invariant(
    //   !this._env.getStoreData().getChangeEmitter().hasActiveListeners() &&
    //   !this._env.getStoreData().getMutationQueue().hasPendingMutations() &&
    //   !this._env.getStoreData().getPendingQueryTracker().hasPendingQueries(),
    //   'RelayStore.reset(): Cannot reset the store while there are active ' +
    //   'Relay Containers or pending mutations/queries.'
    // );

    // console.log('reset networkLayer: ', networkLayer);

    if (networkLayer !== undefined) {
      this._networkLayer = networkLayer;
    }

    this._env = new Environment();
    if (this._networkLayer !== null) {
      this._env.injectNetworkLayer(this._networkLayer);
    }
    if (this._taskScheduler !== null) {
      this._env.injectTaskScheduler(this._taskScheduler);
    }

    // Comment/Uncomment the line bellow to enable relay debug (dafult commented)
    RelayNetworkDebug.init(this._env);
  }

  // Map existing RelayEnvironment methods
  getStoreData() {
    return this._env.getStoreData();
  }

  injectNetworkLayer(networkLayer) {
    this._networkLayer = networkLayer;
    this._env.injectNetworkLayer(networkLayer);
  }

  injectTaskScheduler(taskScheduler) {
    this._taskScheduler = taskScheduler;
    this._env.injectTaskScheduler(taskScheduler);
  }

  primeCache(...args) {
    return this._env.primeCache(...args);
  }

  forceFetch(...args) {
    return this._env.forceFetch(...args);
  }

  read(...args) {
    return this._env.read(...args);
  }

  readAll(...args) {
    return this._env.readAll(...args);
  }

  readQuery(...args) {
    return this._env.readQuery(...args);
  }

  observe(...args) {
    return this._env.observe(...args);
  }

  getFragmentResolver(...args) {
    return this._env.getFragmentResolver(...args);
  }

  applyUpdate(...args) {
    return this._env.applyUpdate(...args);
  }

  commitUpdate(...args) {
    return this._env.commitUpdate(...args);
  }

  /**
   * @deprecated
   *
   * Method renamed to commitUpdate
   */
  update(...args) {
    return this._env.update(...args);
  }
}

const relayStore = new RelayStore();

export default relayStore;
