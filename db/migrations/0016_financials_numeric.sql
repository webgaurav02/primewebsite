-- =============================================================================
-- 0016 — Impact financials as numbers.
--
-- turnover / govt_funding / external_funding were free-text ("₹5 Lakh"), which
-- can't be totalled, compared, or rendered consistently. Convert them to bigint
-- whole-rupee amounts (matches the already-numeric employment_count /
-- lives_impacted / year_established).
--
-- The USING cast is defensive: any value containing a letter ("5 Lakh", "N/A",
-- "None") becomes NULL rather than a wrong number; pure amounts keep their
-- digits ("₹5,00,000" → 500000). Existing rows are dev throwaway data, so a
-- best-effort backfill is fine. No ₹ literal in SQL (encoding-safe): we just
-- strip every non-digit once we know there are no letters.
-- =============================================================================

CREATE OR REPLACE FUNCTION prime_parse_rupees(v text) RETURNS bigint
  LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE
    WHEN v IS NULL THEN NULL
    WHEN v ~ '[A-Za-z]' THEN NULL          -- "5 Lakh", "N/A" → NULL, not a wrong number
    WHEN v ~ '[0-9]'    THEN nullif(regexp_replace(v, '[^0-9]', '', 'g'), '')::bigint
    ELSE NULL
  END
$$;

ALTER TABLE entrepreneur_profile
  ALTER COLUMN turnover         TYPE bigint USING prime_parse_rupees(turnover),
  ALTER COLUMN govt_funding     TYPE bigint USING prime_parse_rupees(govt_funding),
  ALTER COLUMN external_funding TYPE bigint USING prime_parse_rupees(external_funding);

ALTER TABLE organization
  ALTER COLUMN turnover TYPE bigint USING prime_parse_rupees(turnover);

-- One-shot helper; not part of the runtime contract.
DROP FUNCTION prime_parse_rupees(text);
