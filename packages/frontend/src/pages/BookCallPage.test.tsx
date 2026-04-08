import { MantineProvider } from '@mantine/core';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Booking, EventType, Slot } from '@app/api';
import * as eventTypesModule from '../api/eventTypes';
import * as bookingsModule from '../api/bookings';
import { BookCallPage } from './BookCallPage';

vi.mock('../api/eventTypes', () => ({
  eventTypesApi: {
    list: vi.fn(),
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
  { id: '1', name: 'Консультация', description: 'Короткая встреча', durationMinutes: 30 },
  { id: '2', name: 'Стратегическая сессия', description: '', durationMinutes: 60 },
];

const mockSlots: Slot[] = [
  { startsAt: '2026-04-10T10:00:00.000Z', endsAt: '2026-04-10T10:30:00.000Z' },
  { startsAt: '2026-04-10T11:00:00.000Z', endsAt: '2026-04-10T11:30:00.000Z' },
];

const mockBooking: Booking = {
  id: 'b1',
  eventTypeId: '1',
  eventTypeName: 'Консультация',
  startsAt: '2026-04-10T10:00:00.000Z',
  endsAt: '2026-04-10T10:30:00.000Z',
  guestName: 'Иван Иванов',
  guestEmail: 'ivan@example.com',
};

function renderPage(search = '?eventTypeId=1') {
  return render(
    <MantineProvider>
      <MemoryRouter initialEntries={[`/book${search}`]}>
        <BookCallPage />
      </MemoryRouter>
    </MantineProvider>,
  );
}

/** Find the enabled day button with a given day number in the Calendar */
function getCalendarDay(day: number) {
  const buttons = screen.getAllByRole('button');
  const match = buttons.find(
    (btn) => btn.textContent?.trim() === String(day) && !btn.hasAttribute('data-disabled'),
  );
  if (!match) throw new Error(`Calendar day button "${day}" not found or disabled`);
  return match;
}

describe('BookCallPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ shouldAdvanceTime: true, now: new Date('2026-04-08T12:00:00.000Z') });
    vi.mocked(eventTypesModule.eventTypesApi.list).mockResolvedValue(mockEventTypes);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('отображает сетку слотов после выбора даты', async () => {
    vi.mocked(bookingsModule.bookingsApi.getSlots).mockResolvedValue(mockSlots);

    renderPage();

    await screen.findByTestId('event-type-select');

    fireEvent.click(getCalendarDay(10));

    const grid = await screen.findByTestId('slots-grid');
    expect(grid).toBeInTheDocument();

    expect(screen.getByTestId('slot-2026-04-10T10:00:00.000Z')).toBeInTheDocument();
    expect(screen.getByTestId('slot-2026-04-10T11:00:00.000Z')).toBeInTheDocument();

    expect(bookingsModule.bookingsApi.getSlots).toHaveBeenCalledWith('1', '2026-04-10');
  });

  it('показывает пустое состояние, если слотов нет', async () => {
    vi.mocked(bookingsModule.bookingsApi.getSlots).mockResolvedValue([]);

    renderPage();

    await screen.findByTestId('event-type-select');
    fireEvent.click(getCalendarDay(10));

    await waitFor(() => {
      expect(screen.getByText(/нет доступных слотов/i)).toBeInTheDocument();
    });
  });

  it('сабмит формы — 201 → показывает экран подтверждения', async () => {
    vi.mocked(bookingsModule.bookingsApi.getSlots).mockResolvedValue(mockSlots);
    vi.mocked(bookingsModule.bookingsApi.createBooking).mockResolvedValue(mockBooking);

    renderPage();

    await screen.findByTestId('event-type-select');
    fireEvent.click(getCalendarDay(10));

    await screen.findByTestId('slots-grid');
    fireEvent.click(screen.getByTestId('slot-2026-04-10T10:00:00.000Z'));

    fireEvent.change(screen.getByTestId('guest-name-input'), {
      target: { value: 'Иван Иванов' },
    });
    fireEvent.change(screen.getByTestId('guest-email-input'), {
      target: { value: 'ivan@example.com' },
    });

    fireEvent.click(screen.getByTestId('submit-button'));

    const confirmation = await screen.findByTestId('booking-confirmation');
    expect(confirmation).toBeInTheDocument();
    expect(screen.getByText('Звонок забронирован!')).toBeInTheDocument();
    expect(screen.getByText('Иван Иванов')).toBeInTheDocument();
    expect(screen.getByText('ivan@example.com')).toBeInTheDocument();
  });

  it('сабмит формы — 409 → показывает сообщение о конфликте и перезапрашивает слоты', async () => {
    const { ApiError } = await import('../api/bookings');
    vi.mocked(bookingsModule.bookingsApi.getSlots).mockResolvedValue(mockSlots);
    vi.mocked(bookingsModule.bookingsApi.createBooking).mockRejectedValue(
      new ApiError('Slot already booked', 409),
    );

    renderPage();

    await screen.findByTestId('event-type-select');
    fireEvent.click(getCalendarDay(10));

    await screen.findByTestId('slots-grid');
    fireEvent.click(screen.getByTestId('slot-2026-04-10T10:00:00.000Z'));

    fireEvent.change(screen.getByTestId('guest-name-input'), {
      target: { value: 'Иван Иванов' },
    });
    fireEvent.change(screen.getByTestId('guest-email-input'), {
      target: { value: 'ivan@example.com' },
    });

    fireEvent.click(screen.getByTestId('submit-button'));

    await screen.findByTestId('conflict-error');
    expect(screen.getByText(/слот только что заняли/i)).toBeInTheDocument();

    expect(bookingsModule.bookingsApi.getSlots).toHaveBeenCalledTimes(2);
  });
});
