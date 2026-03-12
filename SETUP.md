# Netlify + Notion Setup

## Environment variables

Create a local `.env` file from `.env.example` and set:

- `NOTION_TOKEN`
- `NOTION_EVENTS_DATABASE_ID`
- `NOTION_CONTACT_DB_ID`
- `NOTION_NEWSLETTER_DB_ID`
- `NOTION_RESIDENCY_DB_ID`
- `VITE_RESIDENCY_FORM_URL`

Run local development with `npm run dev`. This starts Netlify Dev on `http://localhost:8888` and proxies Vite on port `5177`.

## Events CMS setup

### 1. Create a Notion integration

1. Open the official Notion integrations page and create a new internal integration:
   [Create integration](https://www.notion.so/profile/integrations)
2. Copy the internal integration token.
3. Put that value in `NOTION_TOKEN`.

### 2. Create or prepare the Events database

Create a Notion database for public events and set `NOTION_EVENTS_DATABASE_ID` to that database ID.

Recommended properties:

| Property | Type | Required | Notes |
| --- | --- | --- | --- |
| `Name` or `Title` | Title | Yes | Event title shown on the site |
| `Slug` | Rich text | No | Optional custom slug; falls back to title |
| `Date` | Date | Yes | Used for upcoming/archive logic |
| `Time` | Rich text | No | Display-only time label |
| `Venue` | Rich text | No | Venue or space name |
| `City` | Rich text | No | City label |
| `Short Description` | Rich text | No | Short summary for cards |
| `Tickets URL` | URL | No | Ticket CTA target |
| `Image` | Files or URL | No | Event image, poster, or hosted URL |
| `Featured` | Checkbox | No | Homepage section only shows featured events |
| `Published` | Checkbox | Yes | Only published rows appear on the site |
| `Sold Out` | Checkbox | No | Disables ticket CTA and shows sold out state |
| `Category` | Select or rich text | No | Optional label shown on cards |
| `Sort Order` | Number | No | Secondary sort when dates match |

Property matching is resilient and case-insensitive, but using the names above keeps the setup predictable.

### 3. Share the database with the integration

1. Open the Events database in Notion.
2. Click `Share`.
3. Invite the integration you created above.

If the integration is not shared to the database, the site will not be able to read events.

### 4. How clients should add an event

For each new event row:

1. Enter the event title in the title column.
2. Add the event `Date`.
3. Fill in any optional fields such as `Time`, `Venue`, `City`, `Short Description`, `Tickets URL`, and `Image`.
4. Turn on `Published` when the event is ready for the public website.
5. Turn on `Featured` if the event should also appear on the homepage.
6. Turn on `Sold Out` if tickets are no longer available.

### 5. How publishing rules affect the site

- `Published = true` and `Date` is today or later:
  the event appears on the `/events` page under upcoming events.
- `Featured = true` plus the rule above:
  the event is eligible for the homepage events section.
- `Published = true` and `Date` is in the past:
  the event moves to the archive section on `/events`.
- `Sold Out = true`:
  the site shows a sold out badge and does not render the ticket CTA.

## Existing Notion forms

The existing contact, newsletter, and residency forms also use `NOTION_TOKEN` and their respective database IDs.

Useful local endpoints:

- `/.netlify/functions/contact`
- `/.netlify/functions/newsletter`
- `/.netlify/functions/residency`
- `/.netlify/functions/events`
- `/api/events`
- `/api/events?featured=true`
- `/api/events?archive=true`

## Security notes

- `NOTION_TOKEN` must never be exposed in frontend code or committed to the repo.
- All Notion access in this project happens through Netlify Functions.
- If a Notion token was previously exposed, rotate it in Notion before going live.
