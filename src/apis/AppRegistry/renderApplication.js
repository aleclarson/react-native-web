/**
 * Copyright (c) 2015-present, Nicolas Gallagher.
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * @flow
 */

import invariant from 'fbjs/lib/invariant';
import { render } from 'react-dom/lib/ReactMount';
import StyleSheet from '../../apis/StyleSheet';
import React, { Component } from 'react';

export default function renderApplication(
  RootComponent: Component,
  initialProps: Object,
  rootTag: any
) {
  invariant(rootTag, 'Expect to have a valid rootTag, instead got ', rootTag);

  const component = <RootComponent {...initialProps} rootTag={rootTag} />;
  render(component, rootTag);
}

export function getApplication(RootComponent: Component, initialProps: Object): Object {
  const element = React.createElement(RootComponent, initialProps);
  const stylesheet = StyleSheet.renderToString();
  return { element, stylesheet };
}
