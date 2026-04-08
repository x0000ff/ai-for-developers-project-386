# Plan: Merge Upcoming and Past Meetings with SegmentedControl

## Goal

Combine the separate "Upcoming meetings" and "Past meetings" tabs into a single "Meetings" page with a Mantine SegmentedControl to switch between them.

## Implementation Steps

### 1. Frontend - Add import and state

**File:** `packages/frontend/src/pages/AdminPage.tsx`

- Import `SegmentedControl` from `@mantine/core`
- Add state: `const [bookingsFilter, setBookingsFilter] = useState<'upcoming' | 'past'>('upcoming');`

### 2. Frontend - Add translations

**File:** `packages/frontend/src/locales/en.json`

```json
"bookingsFilterUpcoming": "Upcoming",
"bookingsFilterPast": "Past"
```

### 3. Frontend - Update Bookings tab UI

**File:** `packages/frontend/src/pages/AdminPage.tsx`

- Add `SegmentedControl` below the refresh button in the bookings panel
- Options: `[{ label: t('admin.bookingsFilterUpcoming'), value: 'upcoming' }, { label: t('admin.bookingsFilterPast'), value: 'past' }]`
- Default selection: `'upcoming'`
- Conditionally display:
  - `bookings` when filter is `'upcoming'`
  - `pastBookings` when filter is `'past'`
- Update empty state text based on filter
- Use single table component with conditional data

### 4. Frontend - Update delete handler

**File:** `packages/frontend/src/pages/AdminPage.tsx`

- Already refreshes both: `await loadBookings(); await loadPastBookings();` ✓

### 5. Optional cleanup

- Remove `tabPastBookings` translation (no longer needed)
- Remove `past-bookings` tab from Tabs.List (keep only `bookings` tab)

## UI Layout

```
[Refresh button]                    [SegmentedControl: Upcoming | Past]
+---------------------------------------------------------------+
| Date | Time | Meeting type | Guest | Email | Actions          |
+---------------------------------------------------------------+
| ...table rows based on filter...                             |
+---------------------------------------------------------------+
```

## Notes

- `'upcoming'` selected by default
- Both datasets loaded on page mount for instant switching
- Consistent with existing design language
