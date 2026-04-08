import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { EventType } from '@app/api';
import i18n from '../i18n';
import * as eventTypesModule from '../api/eventTypes';
import { LandingPage } from './LandingPage';

vi.mock('../api/eventTypes', () => ({
  eventTypesApi: {
    list: vi.fn(),
  },
}));

const mockEventTypes: EventType[] = [
  {
    id: '1',
    name: 'Консультация 30 мин',
    description: 'Короткая онлайн-встреча',
    durationMinutes: 30,
  },
  {
    id: '2',
    name: 'Стратегическая сессия',
    description: '',
    durationMinutes: 60,
  },
];

function renderPage() {
  return render(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>,
  );
}

describe('LandingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    i18n.changeLanguage('ru');
  });

  it('показывает список карточек с типами встреч', async () => {
    vi.mocked(eventTypesModule.eventTypesApi.list).mockResolvedValue(mockEventTypes);

    renderPage();

    const list = await screen.findByTestId('event-types-list');
    expect(list).toBeInTheDocument();

    expect(screen.getByText('Консультация 30 мин')).toBeInTheDocument();
    expect(screen.getByText('Короткая онлайн-встреча')).toBeInTheDocument();
    expect(screen.getByText('30 мин')).toBeInTheDocument();

    expect(screen.getByText('Стратегическая сессия')).toBeInTheDocument();
    expect(screen.getByText('60 мин')).toBeInTheDocument();
  });

  it('кнопки "Забронировать" ведут на /book?eventTypeId=<id>', async () => {
    vi.mocked(eventTypesModule.eventTypesApi.list).mockResolvedValue(mockEventTypes);

    renderPage();

    await screen.findByTestId('event-types-list');

    const links = screen.getAllByRole('link', { name: /забронировать/i });
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', '/book?eventTypeId=1');
    expect(links[1]).toHaveAttribute('href', '/book?eventTypeId=2');
  });

  it('показывает пустое состояние, когда типов нет', async () => {
    vi.mocked(eventTypesModule.eventTypesApi.list).mockResolvedValue([]);

    renderPage();

    const empty = await screen.findByTestId('empty-state');
    expect(empty).toBeInTheDocument();
    expect(screen.getByText(/пока нет доступных форматов встреч/i)).toBeInTheDocument();
  });
});
