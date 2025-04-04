-- ********************************************************************************
-- This script creates the database users and grants them the necessary permissions
-- ********************************************************************************

CREATE USER CS50_owner
WITH PASSWORD '1234';

GRANT ALL
ON ALL TABLES IN SCHEMA public
TO CS50_owner;

GRANT ALL
ON ALL SEQUENCES IN SCHEMA public
TO CS50_owner;

CREATE USER CS50_appuser
WITH PASSWORD '1234';

GRANT SELECT, INSERT, UPDATE, DELETE
ON ALL TABLES IN SCHEMA public
TO CS50_appuser;

GRANT USAGE, SELECT
ON ALL SEQUENCES IN SCHEMA public
TO CS50_appuser;
