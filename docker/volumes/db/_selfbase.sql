\set pguser `echo "$POSTGRES_USER"`

CREATE DATABASE _selfbase WITH OWNER :pguser;
