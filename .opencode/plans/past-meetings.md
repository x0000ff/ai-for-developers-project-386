# Plan: Add "Past Meetings" Page

## Goal

Add a new "Past meetings" tab in the admin page to display past bookings, separate from the existing "Upcoming meetings" tab.

## Implementation Steps

### 1. Backend - Add service method

**File:** `packages/backend/src/services/bookingsService.ts`

Add `listPast()` method:

```typescript
listPast(now: Date = new Date()): Booking[] {
  const nowMs = now.getTime();
  return db
    .select()
    .from(bookings)
    .where(lt(bookings.startsAt, nowMs))
    .orderBy(desc(bookings.startsAt))  // most recent first
    .all()
    .map(toDto);
}
```

### 2. Backend - Add route

**File:** `packages/backend/src/routes/bookings.ts`

Add:

```typescript
app.get('/bookings/past', async () => {
  return service.listPast();
});
```

### 3. TypeSpec - Add API endpoint

**File:** `packages/api/src/main.tsp`

In the `Bookings` interface, add:

```typescript
/** List past bookings sorted by startsAt DESC */
@route("past")
@get listPast(): Booking[];
```

### 4. Rebuild API types

```bash
pnpm --filter @app/api build
```

### 5. Frontend - Add API client method

**File:** `packages/frontend/src/api/bookings.ts`

Add:

```typescript
listPast: async (): Promise<Booking[]> => {
  const response = await fetch(`${API_BASE_URL}/api/bookings/past`);
  return handleResponse<Booking[]>(response);
},
```

### 6. Frontend - Add translations

**File:** `packages/frontend/src/locales/en.json`

Add:

```json
"tabPastBookings": "Past meetings",
"emptyPastBookings": "No past meetings."
```

### 7. Frontend - Add UI tab

**File:** `packages/frontend/src/pages/AdminPage.tsx`

- Add new tab with value `past-bookings`
- Add similar table structure to existing "Upcoming meetings" tab
- Fetch past bookings using `bookingsApi.listPast()`

## Notes

- Reuses existing `Booking` type from API
- Past meetings sorted by most recent first (DESC)
- Upcoming meetings sorted by soonest first (ASC) - unchanged
