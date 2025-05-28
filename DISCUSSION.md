## Backend completed

##### [x] Pagination

- Supports limiting and offsetting data rows on `GET` Advocates request.
  - Default limit: **10** (I choose a low default limit to demo pagination without having to reseed
    the db to create a large dataset. For large production datasets we would likekly set a larger
    default system limit)
  - Default offset: **0**

##### [x] PostgreSQL FTS (Full-Text Search) (`tsvector`)

- Implements a `tsvector` full text search:
  - Adds a GIN tsvector search index to advocates names, city, degree/specialities column, via SQL
    file that can be set when drizzle-kit migrations are run. Provides `setweight` functionality on
    the index to support relevance ranking if we want `sortBy relevance` support in the future
  - `GET api/advocates` route:
    - Builds the text search using `sql to_tsvector` for performant searches on large datasets.
    - DB query uses sql `setweight` function that sets relevance weight of
      `names, city, and specialities and degree` based on the search filter. (orderBy can be
      implemented later to sort the query results by rank from our setweights).
- Pros:
  - Best for large data sets
  - Selective, word-level indexes
  - Relevance ranking & weighting
  - Better I/O characteristics
- Cons:
  - Not tolerant of typos or partial matches (e.g. "Jo" wouldn't return the "John Doe" row)

## Frontend completed

##### [x] GLobal Theming & Styles

- Global styles in `globals.css`, `tailwind.config.js`, and `layout.tsx`.
- Imports brand color palettes from the Solace website into Tailwind.
- Defines reusable base components, layered components and CSS utilities for brand unity.

##### [x] Components

- `Table`
- `Pagination`
- `SearchBox`
- `CellChips` - Tooltip supports revealing truncated labels on hover. `view all` cta to show or hide
  all chips

##### [x] Utilities:

- Phone-number normalizer in `app/utils`

##### [x] Hooks:

- `useDebounce` for input throttling

##### [x] Responsiveness

- `Mobile, iPad, and Desktop` global css utils implemented for table components

---

### Changes If I did not have time constraints:

#### BACKEND

- **Add ranking by the weighted vectors we set to our indexes and db query to support an oderBy
  relevance**
  - Expounds on the weighted rank search to support `orderBy` on the returned results
- **For pages with smaller datasets we can choose `sql ILIKE` for partial matches**
  - Simplicity and quick boiler plate. No extra columns or `tsvector` syntax required
  - Fast for small datasets in the low thousands
  - Supports partial matches (e.g. "Joh" still returns the "John Doe" row)
- **Filter improvements**:
  - Move **Years of Experience** out of the text search into a dedicated range filter
  - Convert **Degree** column to an `ENUM` type and expose via dropdown for exact degree search
- **Fuzzy / Semantic Search** via a `pgvector` extension with Drizzle and postgres
- **More robust error-handling or response support for route apis**
- **Expanded test coverage of db and route behaviors (including error cases)**

#### FRONTEND

- **Dynamic Pagination Params**
  - In production, users could select page sizes (e.g. 50, 100, 500) via a dropdown, with a sensible
    system default (e.g. 100).
- **Loading & Empty States**
  - Table skeletons for smoother loading experience
  - Componentize various table states (e.g. no rows found, table loading states)
- **Compact Tag Chips UI**
  - Sleeker chip-overflow or “show more” patterns in the ux
- **Advanced Filters**
  - Table filter dropdowns to filter by years of experience in numeric ranges, or filter by exact
    degree values. Add a sortBy dropDown (e.g. sortBy results by relevance, distance etc)
- **Test Coverage**
  - Table states
  - More fetch/loading/error flows
- **Code Splitting**
  - Lazy-load heavy components or data-intensive sections if needed
