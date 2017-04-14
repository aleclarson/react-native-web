
import EventPluginRegistry from 'react-dom/lib/EventPluginRegistry';
import ResponderEventPlugin from 'react-dom/lib/ResponderEventPlugin';
import normalizeNativeEvent from './normalizeNativeEvent';

const startDependencies = ['topTouchStart', 'topMouseDown'];
const moveDependencies = ['topTouchMove', 'topMouseMove'];
const endDependencies = ['topTouchCancel', 'topTouchEnd', 'topMouseUp'];

const eventDependencies = {
  scrollShouldSetResponder: ['topScroll'],
  selectionChangeShouldSetResponder: ['topSelectionChange'],
  startShouldSetResponder: startDependencies,
  moveShouldSetResponder: moveDependencies,
  gestureStart: [],
  responderReject: [],
  responderGrant: [],
  responderStart: startDependencies,
  responderMove: moveDependencies,
  responderEnd: endDependencies,
  responderRelease: endDependencies,
  responderTerminationRequest: [],
  responderTerminate: [],
  gestureEnd: [],
};

// Setup `ResponderEventPlugin` dependencies
for (let eventType in eventDependencies) {
  const eventConfig = ResponderEventPlugin.eventTypes[eventType];
  eventConfig.dependencies = eventDependencies[eventType];
}

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
