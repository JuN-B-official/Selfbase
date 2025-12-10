\set pguser `echo "$POSTGRES_USER"`

\c _selfbase
create schema if not exists _supavisor;
alter schema _supavisor owner to :pguser;
\c postgres
