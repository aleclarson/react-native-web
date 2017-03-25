// based on https://github.com/facebook/react/pull/4303/files

import EventPluginRegistry from 'react-dom/lib/EventPluginRegistry';
import normalizeNativeEvent from './normalizeNativeEvent';
import ResponderEventPlugin from 'react-dom/lib/ResponderEventPlugin';

const topMouseDown = 'topMouseDown';
const topMouseMove = 'topMouseMove';
const topMouseUp = 'topMouseUp';
const topScroll = 'topScroll';
const topSelectionChange = 'topSelectionChange';
const topTouchCancel = 'topTouchCancel';
const topTouchEnd = 'topTouchEnd';
const topTouchMove = 'topTouchMove';
const topTouchStart = 'topTouchStart';

const endDependencies = [topTouchCancel, topTouchEnd, topMouseUp];
const moveDependencies = [topTouchMove, topMouseMove];
const startDependencies = [topTouchStart, topMouseDown];

/**
 * Setup ResponderEventPlugin dependencies
 */
ResponderEventPlugin.eventTypes.responderMove.dependencies = moveDependencies;
ResponderEventPlugin.eventTypes.responderEnd.dependencies = endDependencies;
ResponderEventPlugin.eventTypes.responderStart.dependencies = startDependencies;
ResponderEventPlugin.eventTypes.responderRelease.dependencies = endDependencies;
ResponderEventPlugin.eventTypes.responderTerminationRequest.dependencies = [];
ResponderEventPlugin.eventTypes.responderGrant.dependencies = [];
ResponderEventPlugin.eventTypes.responderReject.dependencies = [];
ResponderEventPlugin.eventTypes.responderTerminate.dependencies = [];
ResponderEventPlugin.eventTypes.moveShouldSetResponder.dependencies = moveDependencies;
ResponderEventPlugin.eventTypes.selectionChangeShouldSetResponder.dependencies = [
  topSelectionChange
];
ResponderEventPlugin.eventTypes.scrollShouldSetResponder.dependencies = [topScroll];
ResponderEventPlugin.eventTypes.startShouldSetResponder.dependencies = startDependencies;

let lastTime = 0;
let isTouching = false;
let isMouseDown = false;

const originalExtractEvents = ResponderEventPlugin.extractEvents;
ResponderEventPlugin.extractEvents = function(topLevelType, targetInst, nativeEvent) {
  nativeEvent = normalizeNativeEvent(nativeEvent);

  // TODO: Ensure no errors are thrown when the event target is the `<html>` element.
  if (nativeEvent.target.nodeName === 'HTML') {
    console.warn('Events targeting the <html> element are not yet supported.');
    return null;
  }

  // Ignore mouse events during and shortly after touching.
  if ('ontouchstart' in window) {
    if (topLevelType.startsWith('topTouch')) {
      if (topLevelType.endsWith('Start')) {
        isTouching = true;
      }
      else if (nativeEvent.touches.length === 0) {
        isTouching = false;
        lastTime = nativeEvent.timestamp;
      }
    }
    else if (topLevelType.startsWith('topMouse')) {
      if (isTouching || 500 > (nativeEvent.timestamp - lastTime)) {
        return null;
      }
    }
  }

  // Ignore 'mousemove' events unless clicking and dragging.
  if (topLevelType.startsWith('topMouse')) {
    if (isMouseDown) {
      if (topLevelType.endsWith('Up')) {
        isMouseDown = false;
      }
    }
    else if (topLevelType.endsWith('Down')) {
      isMouseDown = true;
    }
    else {
      return null;
    }
  }

  return originalExtractEvents.apply(null, arguments);
};

EventPluginRegistry.injectEventPluginsByName({
  ResponderEventPlugin
});
