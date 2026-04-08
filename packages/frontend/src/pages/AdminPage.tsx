import {
  ActionIcon,
  Button,
  Group,
  Loader,
  Modal,
  NumberInput,
  Stack,
  Table,
  Tabs,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { CalendarClock, Edit2, Plus, RefreshCw, ShieldCheck, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { bookingsApi } from '../api/bookings';
import { eventTypesApi } from '../api/eventTypes';
import { Navbar } from '../components/Navbar';

import type { Booking, EventType } from '@app/api';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface EventTypeFormData {
  name: string;
  description: string;
  durationMinutes: number | string;
}

const emptyForm = (): EventTypeFormData => ({
  name: '',
  description: '',
  durationMinutes: 30,
});

function EventTypeForm({
  initial,
  onSubmit,
  onCancel,
  loading,
}: {
  initial: EventTypeFormData;
  onSubmit: (data: EventTypeFormData) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [form, setForm] = useState<EventTypeFormData>(initial);

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  const isValid =
    form.name.trim().length > 0 &&
    typeof form.durationMinutes === 'number' &&
    form.durationMinutes > 0;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isValid && !loading) {
        onSubmit(form);
      }
    }
  };

  return (
    <Stack gap={12} onKeyDown={handleKeyDown} tabIndex={0}>
      <TextInput
        label="Название"
        placeholder="Например: Консультация 30 мин"
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        required
        styles={{
          label: { fontFamily: 'var(--font)', fontSize: 13, fontWeight: 500, color: 'var(--fg)' },
          input: { fontFamily: 'var(--font)', borderColor: 'var(--border)' },
        }}
      />
      <NumberInput
        label="Длительность (минуты)"
        placeholder="30"
        value={form.durationMinutes}
        onChange={(val) => setForm((f) => ({ ...f, durationMinutes: val }))}
        min={5}
        step={5}
        required
        styles={{
          label: { fontFamily: 'var(--font)', fontSize: 13, fontWeight: 500, color: 'var(--fg)' },
          input: { fontFamily: 'var(--font)', borderColor: 'var(--border)' },
        }}
      />
      <Textarea
        label="Описание"
        placeholder="Краткое описание встречи"
        value={form.description}
        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        rows={3}
        styles={{
          label: { fontFamily: 'var(--font)', fontSize: 13, fontWeight: 500, color: 'var(--fg)' },
          input: { fontFamily: 'var(--font)', borderColor: 'var(--border)' },
        }}
      />
      <Group justify="flex-end" gap={8} mt={4}>
        <Button
          variant="subtle"
          onClick={onCancel}
          disabled={loading}
          styles={{
            root: {
              fontFamily: 'var(--font)',
              color: 'var(--fg-muted)',
              fontWeight: 500,
              fontSize: 14,
            },
          }}
        >
          Отмена
        </Button>
        <Button
          onClick={() => onSubmit(form)}
          disabled={!isValid || loading}
          loading={loading}
          styles={{
            root: {
              background: 'var(--accent)',
              fontFamily: 'var(--font)',
              fontWeight: 600,
              fontSize: 14,
              letterSpacing: '-0.01em',
            },
          }}
        >
          Сохранить
        </Button>
      </Group>
    </Stack>
  );
}

export function AdminPage() {
  const isMobile = useMediaQuery('(max-width: 600px)');
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [editTarget, setEditTarget] = useState<EventType | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<EventType | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [deletingBookingId, setDeletingBookingId] = useState<string | null>(null);
  const [deleteBookingModalOpen, setDeleteBookingModalOpen] = useState(false);
  const [deleteBookingLoading, setDeleteBookingLoading] = useState(false);

  useEffect(() => {
    loadEventTypes();
    loadBookings();
  }, []);

  async function loadBookings() {
    setBookingsLoading(true);
    setBookingsError(null);
    try {
      const data = await bookingsApi.listUpcoming();
      setBookings(data);
    } catch (err) {
      setBookingsError(err instanceof Error ? err.message : 'Ошибка загрузки');
    } finally {
      setBookingsLoading(false);
    }
  }

  async function loadEventTypes() {
    setLoading(true);
    setError(null);
    try {
      const data = await eventTypesApi.list();
      setEventTypes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(form: EventTypeFormData) {
    setCreateLoading(true);
    setCreateError(null);
    try {
      const created = await eventTypesApi.create({
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        durationMinutes: Number(form.durationMinutes),
      });
      setEventTypes((prev) => [...prev, created]);
      setCreateOpen(false);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Ошибка создания');
    } finally {
      setCreateLoading(false);
    }
  }

  async function handleEdit(form: EventTypeFormData) {
    if (!editTarget) return;
    setEditLoading(true);
    setEditError(null);
    try {
      const updated = await eventTypesApi.update(editTarget.id, {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        durationMinutes: Number(form.durationMinutes),
      });
      setEventTypes((prev) => prev.map((et) => (et.id === updated.id ? updated : et)));
      setEditTarget(null);
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'Ошибка обновления');
    } finally {
      setEditLoading(false);
    }
  }

  async function handleDeleteBooking() {
    if (!deletingBookingId) return;
    setDeleteBookingLoading(true);
    try {
      await bookingsApi.deleteBooking(deletingBookingId);
      setDeleteBookingModalOpen(false);
      setDeletingBookingId(null);
      await loadBookings();
    } finally {
      setDeleteBookingLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await eventTypesApi.delete(deleteTarget.id);
      setEventTypes((prev) => prev.filter((et) => et.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Ошибка удаления');
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />

      <main
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '40px 24px',
        }}
      >
        <Tabs
          defaultValue="event-types"
          keepMounted
          variant="pills"
          orientation={isMobile ? 'horizontal' : 'vertical'}
          styles={{
            root: isMobile
              ? { display: 'flex', flexDirection: 'column', gap: 0 }
              : { display: 'flex', alignItems: 'flex-start', gap: 0 },
            list: isMobile ? { marginBottom: 20 } : { width: 200, flexShrink: 0 },
            tab: { fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14 },
            panel: isMobile ? {} : { flex: 1, paddingLeft: 24 },
          }}
        >
          <Tabs.List>
            <Tabs.Tab value="event-types" leftSection={<ShieldCheck size={15} strokeWidth={2} />}>
              Типы встреч
            </Tabs.Tab>
            <Tabs.Tab value="bookings" leftSection={<CalendarClock size={15} strokeWidth={2} />}>
              Предстоящие встречи
            </Tabs.Tab>
          </Tabs.List>

          {/* Event Types Panel */}
          <Tabs.Panel value="event-types">
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginBottom: 20,
              }}
            >
              <button
                className="cta-btn"
                onClick={() => {
                  setCreateError(null);
                  setCreateOpen(true);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 20px',
                  background: 'var(--accent)',
                  color: 'var(--accent-fg)',
                  border: 'none',
                  borderRadius: 8,
                  fontFamily: 'var(--font)',
                  fontWeight: 600,
                  fontSize: 14,
                  letterSpacing: '-0.01em',
                  cursor: 'pointer',
                }}
              >
                <Plus size={16} strokeWidth={2} />
                Создать
              </button>
            </div>

            {loading && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: 200,
                }}
              >
                <Loader size="md" color="var(--accent)" />
              </div>
            )}

            {!loading && error && (
              <div
                style={{
                  padding: '16px 20px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: 10,
                  fontFamily: 'var(--font)',
                  fontSize: 14,
                  color: '#dc2626',
                }}
              >
                {error}
              </div>
            )}

            {!loading && !error && eventTypes.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '60px 24px',
                  border: '1px dashed var(--border)',
                  borderRadius: 12,
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font)',
                    fontSize: 15,
                    color: 'var(--fg-muted)',
                    margin: 0,
                  }}
                >
                  Пока нет ни одного типа встречи. Нажмите «Создать», чтобы добавить первый.
                </p>
              </div>
            )}

            {!loading && !error && eventTypes.length > 0 && (
              <div
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  overflow: 'auto',
                  background: 'white',
                }}
              >
                <Table
                  highlightOnHover
                  styles={{
                    thead: { background: '#faf9f7' },
                    th: {
                      fontFamily: 'var(--font)',
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      color: 'var(--fg-muted)',
                      padding: '12px 16px',
                    },
                    td: {
                      fontFamily: 'var(--font)',
                      fontSize: 14,
                      color: 'var(--fg)',
                      padding: '14px 16px',
                      verticalAlign: 'middle',
                    },
                  }}
                >
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th style={{ width: 140 }}>Длительность</Table.Th>
                      <Table.Th>Название</Table.Th>
                      <Table.Th>Описание</Table.Th>
                      <Table.Th style={{ width: 100 }}></Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {eventTypes.map((et) => (
                      <Table.Tr key={et.id}>
                        <Table.Td>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: '4px 10px',
                              background: 'var(--bg)',
                              border: '1px solid var(--border)',
                              borderRadius: 6,
                              fontSize: 13,
                              fontWeight: 500,
                            }}
                          >
                            {et.durationMinutes} мин
                          </span>
                        </Table.Td>
                        <Table.Td>
                          <span style={{ fontWeight: 500 }}>{et.name}</span>
                        </Table.Td>
                        <Table.Td>
                          <span style={{ color: 'var(--fg-muted)' }}>
                            {et.description || <em style={{ opacity: 0.5 }}>—</em>}
                          </span>
                        </Table.Td>
                        <Table.Td>
                          <Group gap={6} justify="flex-end">
                            <ActionIcon
                              variant="subtle"
                              onClick={() => {
                                setEditError(null);
                                setEditTarget(et);
                              }}
                              title="Редактировать"
                              style={{ color: 'var(--fg-muted)' }}
                            >
                              <Edit2 size={15} strokeWidth={2} />
                            </ActionIcon>
                            <ActionIcon
                              variant="subtle"
                              color="red"
                              onClick={() => {
                                setDeleteError(null);
                                setDeleteTarget(et);
                              }}
                              title="Удалить"
                            >
                              <Trash2 size={15} strokeWidth={2} />
                            </ActionIcon>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </div>
            )}
          </Tabs.Panel>

          {/* Bookings Panel */}
          <Tabs.Panel value="bookings">
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginBottom: 20,
              }}
            >
              <button
                onClick={loadBookings}
                disabled={bookingsLoading}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 16px',
                  background: 'white',
                  color: 'var(--fg)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  fontFamily: 'var(--font)',
                  fontWeight: 500,
                  fontSize: 13,
                  cursor: bookingsLoading ? 'not-allowed' : 'pointer',
                  opacity: bookingsLoading ? 0.6 : 1,
                }}
              >
                <RefreshCw size={14} strokeWidth={2} />
                Обновить
              </button>
            </div>

            {bookingsLoading && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: 120,
                }}
              >
                <Loader size="md" color="var(--accent)" />
              </div>
            )}

            {!bookingsLoading && bookingsError && (
              <div
                style={{
                  padding: '16px 20px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: 10,
                  fontFamily: 'var(--font)',
                  fontSize: 14,
                  color: '#dc2626',
                }}
              >
                {bookingsError}
              </div>
            )}

            {!bookingsLoading && !bookingsError && bookings.length === 0 && (
              <div
                data-testid="bookings-empty"
                style={{
                  textAlign: 'center',
                  padding: '48px 24px',
                  border: '1px dashed var(--border)',
                  borderRadius: 12,
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font)',
                    fontSize: 15,
                    color: 'var(--fg-muted)',
                    margin: 0,
                  }}
                >
                  Предстоящих встреч пока нет.
                </p>
              </div>
            )}

            {!bookingsLoading && !bookingsError && bookings.length > 0 && (
              <div
                data-testid="bookings-table"
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  overflow: 'auto',
                  background: 'white',
                }}
              >
                <Table
                  highlightOnHover
                  styles={{
                    thead: { background: '#faf9f7' },
                    th: {
                      fontFamily: 'var(--font)',
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      color: 'var(--fg-muted)',
                      padding: '12px 16px',
                    },
                    td: {
                      fontFamily: 'var(--font)',
                      fontSize: 14,
                      color: 'var(--fg)',
                      padding: '14px 16px',
                      verticalAlign: 'middle',
                    },
                  }}
                >
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Дата</Table.Th>
                      <Table.Th>Время</Table.Th>
                      <Table.Th>Тип встречи</Table.Th>
                      <Table.Th>Гость</Table.Th>
                      <Table.Th>Email</Table.Th>
                      <Table.Th style={{ width: 60 }}></Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {bookings.map((b) => (
                      <Table.Tr key={b.id}>
                        <Table.Td>
                          <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                            {formatDate(b.startsAt)}
                          </span>
                        </Table.Td>
                        <Table.Td>
                          <span
                            style={{
                              fontVariantNumeric: 'tabular-nums',
                              color: 'var(--fg-muted)',
                            }}
                          >
                            {formatTime(b.startsAt)} – {formatTime(b.endsAt)}
                          </span>
                        </Table.Td>
                        <Table.Td>
                          {b.eventTypeId === null ? (
                            <span
                              data-testid="deleted-type-badge"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '3px 8px',
                                background: 'var(--bg)',
                                border: '1px solid var(--border)',
                                borderRadius: 6,
                                fontSize: 12,
                                fontWeight: 500,
                                color: 'var(--fg-muted)',
                                fontStyle: 'italic',
                              }}
                            >
                              Тип удалён
                            </span>
                          ) : (
                            <span style={{ fontWeight: 500 }}>
                              <span style={{ color: 'var(--fg-muted)', fontWeight: 400 }}>
                                {Math.round(
                                  (new Date(b.endsAt).getTime() - new Date(b.startsAt).getTime()) /
                                    60000,
                                )}{' '}
                                мин
                              </span>
                              {' • '}
                              <span>{b.eventTypeName}</span>
                            </span>
                          )}
                        </Table.Td>
                        <Table.Td>{b.guestName}</Table.Td>
                        <Table.Td>
                          <span style={{ color: 'var(--fg-muted)' }}>{b.guestEmail}</span>
                        </Table.Td>
                        <Table.Td>
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            title="Удалить встречу"
                            onClick={() => {
                              setDeletingBookingId(b.id);
                              setDeleteBookingModalOpen(true);
                            }}
                          >
                            <Trash2 size={15} strokeWidth={2} />
                          </ActionIcon>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </div>
            )}
          </Tabs.Panel>
        </Tabs>
      </main>

      {/* Create Modal */}
      <Modal
        opened={createOpen}
        onClose={() => !createLoading && setCreateOpen(false)}
        title={
          <Text
            style={{
              fontFamily: 'var(--font)',
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: '-0.03em',
              color: 'var(--fg)',
            }}
          >
            Новый тип встречи
          </Text>
        }
        centered
        styles={{
          content: { borderRadius: 14, background: 'var(--bg)' },
          header: { paddingBottom: 8, background: 'var(--bg)' },
        }}
      >
        {createError && (
          <Text size="sm" style={{ color: '#dc2626', fontFamily: 'var(--font)', marginBottom: 12 }}>
            {createError}
          </Text>
        )}
        <EventTypeForm
          initial={emptyForm()}
          onSubmit={handleCreate}
          onCancel={() => setCreateOpen(false)}
          loading={createLoading}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        opened={editTarget !== null}
        onClose={() => !editLoading && setEditTarget(null)}
        title={
          <Text
            style={{
              fontFamily: 'var(--font)',
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: '-0.03em',
              color: 'var(--fg)',
            }}
          >
            Редактировать
          </Text>
        }
        centered
        styles={{
          content: { borderRadius: 14, background: 'var(--bg)' },
          header: { paddingBottom: 8, background: 'var(--bg)' },
        }}
      >
        {editError && (
          <Text size="sm" style={{ color: '#dc2626', fontFamily: 'var(--font)', marginBottom: 12 }}>
            {editError}
          </Text>
        )}
        {editTarget && (
          <EventTypeForm
            initial={{
              name: editTarget.name,
              description: editTarget.description ?? '',
              durationMinutes: editTarget.durationMinutes,
            }}
            onSubmit={handleEdit}
            onCancel={() => setEditTarget(null)}
            loading={editLoading}
          />
        )}
      </Modal>

      {/* Delete Booking Confirmation Modal */}
      <Modal
        opened={deleteBookingModalOpen}
        onClose={() => !deleteBookingLoading && setDeleteBookingModalOpen(false)}
        title={
          <Text
            style={{
              fontFamily: 'var(--font)',
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: '-0.03em',
              color: 'var(--fg)',
            }}
          >
            Удалить встречу
          </Text>
        }
        centered
        size="sm"
        styles={{
          content: { borderRadius: 14, background: 'var(--bg)' },
          header: { paddingBottom: 8, background: 'var(--bg)' },
        }}
      >
        <Stack gap={16}>
          <Text style={{ fontFamily: 'var(--font)', fontSize: 14, color: 'var(--fg)' }}>
            Вы уверены, что хотите удалить эту встречу? Это действие нельзя отменить.
          </Text>
          <Group justify="flex-end" gap={8}>
            <Button
              variant="subtle"
              onClick={() => setDeleteBookingModalOpen(false)}
              disabled={deleteBookingLoading}
              styles={{
                root: {
                  fontFamily: 'var(--font)',
                  color: 'var(--fg-muted)',
                  fontWeight: 500,
                  fontSize: 14,
                },
              }}
            >
              Отмена
            </Button>
            <Button
              onClick={handleDeleteBooking}
              loading={deleteBookingLoading}
              data-testid="delete-booking-confirm"
              className="danger-btn"
              styles={{
                root: {
                  fontFamily: 'var(--font)',
                  fontWeight: 600,
                  fontSize: 14,
                  background: 'var(--danger)',
                  color: '#fff',
                },
              }}
            >
              Удалить
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteTarget !== null}
        onClose={() => !deleteLoading && setDeleteTarget(null)}
        title={
          <Text
            style={{
              fontFamily: 'var(--font)',
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: '-0.03em',
              color: 'var(--fg)',
            }}
          >
            Удалить тип встречи
          </Text>
        }
        centered
        size="sm"
        styles={{
          content: { borderRadius: 14, background: 'var(--bg)' },
          header: { paddingBottom: 8, background: 'var(--bg)' },
        }}
      >
        <Stack gap={16}>
          <Text style={{ fontFamily: 'var(--font)', fontSize: 14, color: 'var(--fg)' }}>
            Удалить <strong style={{ color: 'var(--fg)' }}>{deleteTarget?.name}</strong>? Это
            действие нельзя отменить.
          </Text>
          {deleteError && (
            <Text size="sm" style={{ color: 'var(--danger)', fontFamily: 'var(--font)' }}>
              {deleteError}
            </Text>
          )}
          <Group justify="flex-end" gap={8}>
            <Button
              variant="subtle"
              onClick={() => setDeleteTarget(null)}
              disabled={deleteLoading}
              styles={{
                root: {
                  fontFamily: 'var(--font)',
                  color: 'var(--fg-muted)',
                  fontWeight: 500,
                  fontSize: 14,
                },
              }}
            >
              Отмена
            </Button>
            <Button
              onClick={handleDelete}
              loading={deleteLoading}
              className="danger-btn"
              styles={{
                root: {
                  fontFamily: 'var(--font)',
                  fontWeight: 600,
                  fontSize: 14,
                  background: 'var(--danger)',
                  color: '#fff',
                },
              }}
            >
              Удалить
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
}
