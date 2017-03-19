/**
 * @providesModule InitializeCore
 */

window.global = window;

global.process = {
  env: {
    NODE_ENV: __DEV__ ? 'development' : 'production',
  }
};

require('react-dom/lib/ReactDOM');

// Prepare the `ResponderEventPlugin` module.
require('../injectResponderEventPlugin');

