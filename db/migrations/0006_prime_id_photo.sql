-- =============================================================================
-- 0006 — Expose photo_path on the public verify lookup.
--
-- The card photo helps a verifier confirm the holder in person, and it is
-- token-gated (only someone holding the card's QR can reach it). Adding a
-- column changes the function's return type, so the definer function must be
-- dropped and recreated (owner + grants re-established).
-- =============================================================================

DROP FUNCTION IF EXISTS prime_id_public_lookup(text);

CREATE FUNCTION prime_id_public_lookup(p_token_hash text)
RETURNS TABLE (
  id           text,
  full_name    text,
  holder_type  prime_id_holder,
  category     prime_id_category,
  venture_name text,
  district     text,
  photo_path   text,
  issue_date   date,
  valid_thru   date,
  status       prime_id_cred_status
)
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT id, full_name, holder_type, category, venture_name, district,
         photo_path, issue_date, valid_thru, status
  FROM prime_id_credential
  WHERE token_hash = p_token_hash
$$;
ALTER FUNCTION prime_id_public_lookup(text) OWNER TO prime_audit;
REVOKE ALL ON FUNCTION prime_id_public_lookup(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION prime_id_public_lookup(text) TO prime_app;
