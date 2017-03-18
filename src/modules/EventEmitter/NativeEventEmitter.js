/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule NativeEventEmitter
 * @flow
 */
'use strict';

const EventEmitter = require('EventEmitter');
const invariant = require('fbjs/lib/invariant');

import type EmitterSubscription from 'EmitterSubscription';
import EventSubscriptionVendor from 'EventSubscriptionVendor';

const sharedSubscriber = new EventSubscriptionVendor();

/**
 * Abstract base class for implementing event-emitting modules. This implements
 * a subset of the standard EventEmitter node module API.
 */
class NativeEventEmitter extends EventEmitter {

  constructor() {
    super(sharedSubscriber);
  }

  addListener(eventType: string, listener: Function, context: ?Object): EmitterSubscription {
    return super.addListener(eventType, listener, context);
  }

  removeAllListeners(eventType: string) {
    invariant(eventType, 'eventType argument is required.');
    super.removeAllListeners(eventType);
  }

  removeSubscription(subscription: EmitterSubscription) {
    super.removeSubscription(subscription);
  }
}

module.exports = NativeEventEmitter;
