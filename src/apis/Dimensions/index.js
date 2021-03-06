/**
 * Copyright (c) 2015-present, Nicolas Gallagher.
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * @providesModule Dimensions
 * @flow
 */

import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import invariant from 'fbjs/lib/invariant';

const win = ExecutionEnvironment.canUseDOM ? window : { screen: {} };

const dimensions = {};

class Dimensions {
  static get(dimension: string): Object {
    invariant(dimensions[dimension], `No dimension set for key ${dimension}`);
    return dimensions[dimension];
  }

  static set(): void {
    dimensions.window = {
      fontScale: 1,
      height: win.innerHeight,
      scale: win.devicePixelRatio || 1,
      width: win.innerWidth
    };

    dimensions.screen = {
      fontScale: 1,
      height: win.screen.height,
      scale: win.devicePixelRatio || 1,
      width: win.screen.width
    };
  }
}

Dimensions.set();
ExecutionEnvironment.canUseDOM && window.addEventListener('resize', Dimensions.set);

module.exports = Dimensions;
