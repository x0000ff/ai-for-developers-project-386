import "@typespec/http";
import "@typespec/openapi3";

using TypeSpec.Http;

@service({ title: "Book a call API" })
namespace BookACall;

/** A single available time slot */
model Slot {
  startsAt: utcDateTime;
  endsAt: utcDateTime;
}

/** Represents a meeting type that guests can book */
model EventType {
  id: string;
  name: string;
  description: string;
  durationMinutes: int32;
}

/** Request body for creating a new event type */
model CreateEventTypeRequest {
  name: string;
  description?: string;
  durationMinutes: int32;
}

/** Request body for fully replacing an event type */
model UpdateEventTypeRequest {
  name: string;
  description?: string;
  durationMinutes: int32;
}

@route("/api/event-types")
interface EventTypes {
  /** List all event types */
  @get list(): EventType[];

  /** Get a single event type by id */
  @get get(@path id: string): EventType | NotFoundResponse;

  /** Create a new event type */
  @post create(@body body: CreateEventTypeRequest): {
    @statusCode statusCode: 201;
    @body body: EventType;
  };

  /** Fully replace an existing event type */
  @put update(@path id: string, @body body: UpdateEventTypeRequest):
    | EventType
    | NotFoundResponse;

  /** Delete an event type (does not delete related bookings) */
  @delete delete(@path id: string): {
    @statusCode statusCode: 204;
  } | NotFoundResponse;

  /** List available slots for an event type on a given date */
  @get @route("{id}/slots") slots(@path id: string, @query date: string): Slot[] | NotFoundResponse;
}
