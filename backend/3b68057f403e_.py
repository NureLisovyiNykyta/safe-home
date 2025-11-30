"""empty message

Revision ID: 3b68057f403e
Revises: 44cf794fe025
Create Date: 2025-11-27 23:38:20.960044

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '3b68057f403e'
down_revision = '44cf794fe025'
branch_labels = None
depends_on = None


def upgrade():
    # ----------------------------
    # USER TABLE
    # ----------------------------
    # Создаём новую partitioned таблицу
    op.execute("""
    CREATE TABLE "user_new" (
        user_id UUID NOT NULL,
        role_id UUID NOT NULL,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(120) NOT NULL,
        password VARCHAR(256),
        google_id VARCHAR(128),
        google_refresh_token TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        email_confirmed BOOLEAN DEFAULT FALSE,
        subscription_plan_name VARCHAR(100),
        PRIMARY KEY (user_id, role_id),
        UNIQUE (email, role_id)
    ) PARTITION BY LIST (role_id);
    """)

    op.execute("""
    CREATE TABLE user_admin PARTITION OF "user_new"
    FOR VALUES IN ('06e6b7d6-11dd-4067-a082-35e4a02fa3bd', 'e759d0f5-4ec0-4298-90bc-6c595eadbbc4');
    """)
    op.execute("""
    CREATE TABLE user_regular PARTITION OF "user_new"
    FOR VALUES IN ('bdb119be-a949-4a54-9ae4-993d54455638');
    """)

    op.execute("""
    INSERT INTO user_new
    SELECT * FROM "user";
    """)

    op.execute('DROP TABLE "user" CASCADE;')
    op.execute('ALTER TABLE user_new RENAME TO "user";')

def downgrade():
    op.execute('DROP TABLE IF EXISTS "user" CASCADE;')
