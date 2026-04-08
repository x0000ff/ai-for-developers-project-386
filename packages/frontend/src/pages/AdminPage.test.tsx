import { MantineProvider } from '@mantine/core';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Booking, EventType } from '@app/api';
import * as eventTypesModule from '../api/eventTypes';
import * as bookingsModule from '../api/bookings';
import { AdminPage } from './AdminPage';

vi.mock('../api/eventTypes', () => ({
  eventTypesApi: {
    list: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('../api/bookings', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../api/bookings')>();
  return {
    ...actual,
    bookingsApi: {
      getSlots: vi.fn(),
      createBooking: vi.fn(),
      listUpcoming: vi.fn(),
    },
  };
});

const mockEventTypes: EventType[] = [
  { id: '1', name: 'Консультация', description: '', durationMinutes: 30 },
];

const mockBookings: Booking[] = [
  {
    id: 'b1',
    eventTypeId: '1',
    eventTypeName: 'Консультация',
    startsAt: '2026-04-10T10:00:00.000Z',
    endsAt: '2026-04-10T10:30:00.000Z',
    guestName: 'Иван Иванов',
    guestEmail: 'ivan@example.com',
  },
  {
    id: 'b2',
    eventTypeId: null,
    eventTypeName: 'Удалённый тип',
    startsAt: '2026-04-11T12:00:00.000Z',
    endsAt: '2026-04-11T13:00:00.000Z',
    guestName: 'Мария Петрова',
    guestEmail: 'maria@example.com',
  },
];

function renderPage() {
  return render(
    <MantineProvider>
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    </MantineProvider>,
  );
}

describe('AdminPage — секция предстоящих встреч', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(eventTypesModule.eventTypesApi.list).mockResolvedValue(mockEventTypes);
  });

  it('отображает таблицу бронирований с данными гостей', async () => {
    vi.mocked(bookingsModule.bookingsApi.listUpcoming).mockResolvedValue(mockBookings);

    renderPage();

    const table = await screen.findByTestId('bookings-table');
    expect(table).toBeInTheDocument();

    const t = within(table);
    expect(t.getByText('Иван Иванов')).toBeInTheDocument();
    expect(t.getByText('ivan@example.com')).toBeInTheDocument();
    expect(t.getByText('Консультация')).toBeInTheDocument();

    expect(t.getByText('Мария Петрова')).toBeInTheDocument();
    expect(t.getByText('maria@example.com')).toBeInTheDocument();
  });

  it('показывает пометку «Тип удалён» когда eventTypeId === null', async () => {
    vi.mocked(bookingsModule.bookingsApi.listUpcoming).mockResolvedValue(mockBookings);

    renderPage();

    await screen.findByTestId('bookings-table');

    const badges = screen.getAllByTestId('deleted-type-badge');
    expect(badges).toHaveLength(1);
    expect(badges[0]).toHaveTextContent('Тип удалён');
  });

  it('показывает пустое состояние, когда встреч нет', async () => {
    vi.mocked(bookingsModule.bookingsApi.listUpcoming).mockResolvedValue([]);

    renderPage();

    const empty = await screen.findByTestId('bookings-empty');
    expect(empty).toBeInTheDocument();
    expect(screen.getByText(/предстоящих встреч пока нет/i)).toBeInTheDocument();
  });
});
