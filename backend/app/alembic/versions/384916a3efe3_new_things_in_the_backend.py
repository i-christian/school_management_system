"""new things in the backend

Revision ID: 384916a3efe3
Revises: ac244af23f63
Create Date: 2024-08-31 12:27:13.723368

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision = '384916a3efe3'
down_revision = 'ac244af23f63'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('classform',
    sa.Column('id', sa.Uuid(), nullable=False),
    sa.Column('name', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('subject',
    sa.Column('name', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
    sa.Column('id', sa.Uuid(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('assignment',
    sa.Column('teacher_id', sa.Uuid(), nullable=False),
    sa.Column('subject_id', sa.Uuid(), nullable=False),
    sa.Column('class_form_id', sa.Uuid(), nullable=False),
    sa.Column('id', sa.Uuid(), nullable=False),
    sa.ForeignKeyConstraint(['class_form_id'], ['classform.id'], ),
    sa.ForeignKeyConstraint(['subject_id'], ['subject.id'], ),
    sa.ForeignKeyConstraint(['teacher_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('student',
    sa.Column('first_name', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
    sa.Column('last_name', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
    sa.Column('form_id', sa.Uuid(), nullable=False),
    sa.Column('id', sa.Uuid(), nullable=False),
    sa.Column('owner_id', sa.Uuid(), nullable=False),
    sa.ForeignKeyConstraint(['form_id'], ['classform.id'], ),
    sa.ForeignKeyConstraint(['owner_id'], ['user.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('grade',
    sa.Column('id', sa.Uuid(), nullable=False),
    sa.Column('student_id', sa.Uuid(), nullable=False),
    sa.Column('subject_id', sa.Uuid(), nullable=False),
    sa.Column('score', sa.Float(), nullable=False),
    sa.ForeignKeyConstraint(['student_id'], ['student.id'], ),
    sa.ForeignKeyConstraint(['subject_id'], ['subject.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.drop_table('item')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('item',
    sa.Column('description', sa.VARCHAR(length=255), autoincrement=False, nullable=True),
    sa.Column('title', sa.VARCHAR(length=255), autoincrement=False, nullable=False),
    sa.Column('id', sa.UUID(), autoincrement=False, nullable=False),
    sa.Column('owner_id', sa.UUID(), autoincrement=False, nullable=False),
    sa.ForeignKeyConstraint(['owner_id'], ['user.id'], name='item_owner_id_fkey', ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id', name='item_pkey')
    )
    op.drop_table('grade')
    op.drop_table('student')
    op.drop_table('assignment')
    op.drop_table('subject')
    op.drop_table('classform')
    # ### end Alembic commands ###
