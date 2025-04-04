-- **************************************************************
-- This script destroys the database and associated users
-- **************************************************************

-- The following line terminates any active connections to the database so that it can be destroyed
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = "CS50-final";

DROP DATABASE "CS50-final";

DROP USER CS50_owner;
DROP USER CS50_appuser;
