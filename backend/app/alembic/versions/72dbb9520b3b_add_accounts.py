"""add accounts

Revision ID: 72dbb9520b3b
Revises: af5ebeef22e6
Create Date: 2024-09-02 13:38:06.141775

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision = '72dbb9520b3b'
down_revision = 'af5ebeef22e6'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('student', sa.Column('fees', sa.Float(), nullable=False))
    op.add_column('user', sa.Column('is_accountant', sa.Boolean(), nullable=False))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('user', 'is_accountant')
    op.drop_column('student', 'fees')
    # ### end Alembic commands ###
