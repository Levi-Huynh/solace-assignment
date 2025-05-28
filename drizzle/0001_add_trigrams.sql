-- 1) Enable trigram support
-- trigram indexes break strings into overlapping three-char chunks ("trigrams"),
-- this allow fast substring (partial) matches, instead of scanning every row
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2) Use GIN (Generalized Inverted Index), an index type optimized for containment queries
-- across multiple values (like trigrams) for fast ILIKE searches
CREATE INDEX advocates_city_trgm_idx
  ON advocates USING GIN (city gin_trgm_ops);

CREATE INDEX advocates_degree_trgm_idx
  ON advocates USING GIN (degree gin_trgm_ops);

CREATE INDEX advocates_name_trgm_idx
  ON advocates USING GIN ((first_name || ' ' || last_name) gin_trgm_ops);
  
-- 3) For numeric casts
-- index the text representation of numeric columns (phone_number, years_of_experience)
-- so that ILIKE filters on their string form can also use the trigram index
CREATE INDEX advocates_phone_trgm_idx
  ON advocates USING GIN ((phone_number::text) gin_trgm_ops);

CREATE INDEX advocates_experience_trgm_idx
  ON advocates USING GIN ((years_of_experience::text) gin_trgm_ops);

-- 4) Cast the JSONB column to text, and index the text allows fast searches within the JSON content
CREATE INDEX advocates_specialties_trgm_idx
  ON advocates USING GIN ((payload::text) gin_trgm_ops);
