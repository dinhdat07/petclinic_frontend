import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PetTypesPage from '../components/pets/PetTypesPage';

vi.mock('../lib/api', () => ({
  get: vi.fn(),
}));

import { get } from '../lib/api';

const mockedGet = vi.mocked(get);

afterEach(() => {
  vi.clearAllMocks();
});

describe('PetTypesPage', () => {
  beforeEach(() => {
    mockedGet.mockResolvedValue([
      { id: 1, name: 'cat' },
      { id: 2, name: 'dog' },
    ]);
  });

  it('renders pet types returned from the API', async () => {
    render(<PetTypesPage />);

    expect(screen.getByText(/loading pet types/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    expect(screen.getByText('cat')).toBeInTheDocument();
    expect(screen.getByText('dog')).toBeInTheDocument();
    expect(mockedGet).toHaveBeenCalledWith('/api/pettypes');
  });
});