"""Add short_id to sensor

Revision ID: fde10560ce1c
Revises: fb8bec36f477
Create Date: 2025-06-20 14:51:11.899600

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'fde10560ce1c'
down_revision = 'fb8bec36f477'
branch_labels = None
depends_on = None


def upgrade():
    # 1. Add table short_id without NOT NULL
    op.add_column('sensor', sa.Column('short_id', sa.Integer, nullable=True))

    # 2. Create consistency
    op.execute("CREATE SEQUENCE sensor_short_id_seq START 1")

    # 3. Fill the short_id for existing terms
    op.execute("UPDATE sensor SET short_id = nextval('sensor_short_id_seq')")

    # 4. Establish the current significance of consistency
    op.execute("SELECT setval('sensor_short_id_seq', (SELECT COALESCE(MAX(short_id), 1) FROM sensor))")

    # 5. Установить server_default для связи с последовательностью
    op.alter_column('sensor', 'short_id', server_default=sa.text("nextval('sensor_short_id_seq')"))

    # 6. Add NOT NULL constraint
    op.alter_column('sensor', 'short_id', nullable=False)

    # 7. Add indices and unique limitation
    with op.batch_alter_table('sensor', schema=None) as batch_op:
        batch_op.create_index('idx_sensor_short_id', ['short_id'], unique=False)
        batch_op.create_index('idx_sensor_user_short_id', ['user_id', 'short_id'], unique=False)
        batch_op.create_index('idx_sensor_user_short_id_archived', ['user_id', 'short_id', 'is_archived'], unique=False)
        batch_op.create_unique_constraint('uq_sensor_short_id', ['short_id'])
    # ### end Alembic commands ###

def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.execute("DROP SEQUENCE IF EXISTS sensor_short_id_seq")
    with op.batch_alter_table('sensor', schema=None) as batch_op:
        batch_op.drop_index('idx_sensor_user_short_id_archived')
        batch_op.drop_index('idx_sensor_user_short_id')
        batch_op.drop_index('idx_sensor_short_id')
        batch_op.drop_column('short_id')

    # ### end Alembic commands ###
