import { SP_ROUTE_PREFIX } from '@/constants';
import { useSiteData } from 'dumi';
import Container from 'dumi/theme/builtins/Container';
import Previewer from 'dumi/theme/builtins/Previewer';
import React, { createElement, type FC, type ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import type { IPreviewerProps } from './types';

export interface IDumiDemoProps {
  demo: {
    id: string;
    inline?: boolean;
  };
  previewerProps: Omit<IPreviewerProps, 'asset' | 'children'>;
}

const DemoErrorBoundary: FC<{ children: ReactNode }> = (props) => (
  <ErrorBoundary
    fallbackRender={({ error }: any) => (
      <Container type="error">
        <p>
          <strong>{error.message || 'This demo has been crashed.'}</strong>
        </p>
        {error.stack && (
          <p>
            <details open>
              <summary>Error stack</summary>
              <pre>{error.stack}</pre>
            </details>
          </p>
        )}
      </Container>
    )}
  >
    {props.children}
  </ErrorBoundary>
);

export const DumiDemo: FC<IDumiDemoProps> = (props) => {
  const { demos } = useSiteData();
  const { component, asset } = demos[props.demo.id];

  if (props.demo.inline) {
    return <DemoErrorBoundary>{createElement(component)}</DemoErrorBoundary>;
  }

  return (
    <Previewer
      asset={asset}
      demoUrl={
        // allow user override demoUrl by frontmatter
        props.previewerProps.demoUrl ||
        `/${SP_ROUTE_PREFIX}demos/${props.demo.id}`
      }
      {...props.previewerProps}
    >
      {props.previewerProps.iframe ? null : (
        <DemoErrorBoundary>{createElement(component)}</DemoErrorBoundary>
      )}
    </Previewer>
  );
};
