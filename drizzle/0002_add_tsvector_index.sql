CREATE INDEX advocates_weighted_search_idx
  ON advocates
  USING GIN (
    (
      setweight(to_tsvector('english', first_name), 'A') ||
      setweight(to_tsvector('english', last_name),  'B') ||
      setweight(to_tsvector('english', city),       'C') ||
      setweight(to_tsvector('english', degree),     'D') ||
      setweight(to_tsvector('english', payload::text),'D')
    )
  );
