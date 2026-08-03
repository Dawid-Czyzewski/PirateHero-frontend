import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions, type RenderResult } from '@testing-library/react';
import { type ComponentType, type ReactElement, type ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { createTestQueryClient } from '@/test/createTestQueryClient';

type ProviderOptions = {
  queryClient?: QueryClient;
  route?: string;
  withRouter?: boolean;
  wrapper?: ComponentType<{ children: ReactNode }>;
};

type RenderWithProvidersResult = RenderResult & { queryClient: QueryClient };

export function renderWithProviders(
  ui: ReactElement,
  {
    queryClient,
    route,
    withRouter = false,
    wrapper: ExtraWrapper,
    ...renderOptions
  }: ProviderOptions & Omit<RenderOptions, 'wrapper'> = {}
): RenderWithProvidersResult {
  const client = queryClient ?? createTestQueryClient();

  function Wrapper({ children }: { children: ReactNode }) {
    let content = children;

    if (ExtraWrapper) {
      content = <ExtraWrapper>{content}</ExtraWrapper>;
    }

    if (withRouter) {
      content = (
        <MemoryRouter initialEntries={route ? [route] : undefined}>{content}</MemoryRouter>
      );
    }

    return <QueryClientProvider client={client}>{content}</QueryClientProvider>;
  }

  return {
    queryClient: client,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
