"""Updated student & grade model and logic

Revision ID: 702d1ae76922
Revises: 72dbb9520b3b
Create Date: 2024-09-06 10:34:28.357692

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision = '702d1ae76922'
down_revision = '72dbb9520b3b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('grade', sa.Column('remark', sqlmodel.sql.sqltypes.AutoString(length=500), nullable=True))
    op.add_column('student', sa.Column('class_teacher_remark', sqlmodel.sql.sqltypes.AutoString(length=500), nullable=True))
    op.add_column('student', sa.Column('head_teacher_remark', sqlmodel.sql.sqltypes.AutoString(length=500), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('student', 'head_teacher_remark')
    op.drop_column('student', 'class_teacher_remark')
    op.drop_column('grade', 'remark')
    # ### end Alembic commands ###
