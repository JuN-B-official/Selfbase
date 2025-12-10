\set pguser `echo "$POSTGRES_USER"`

\c _selfbase
create schema if not exists _analytics;
alter schema _analytics owner to :pguser;
\c postgres
