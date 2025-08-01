"""tirando model de forma pagamento e criando pagamento

Revision ID: 9c3fc1255f3e
Revises: c32244cc13a7
Create Date: 2025-07-20 21:57:43.795499

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '9c3fc1255f3e'
down_revision: Union[str, None] = 'c32244cc13a7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index('ix_forma_pagamento_id', table_name='forma_pagamento')
    op.drop_table('forma_pagamento')
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('forma_pagamento',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('usuario_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('gateway', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('token_gateway', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('bandeira', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('final_cartao', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('nome_impresso', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('nome_cartao', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('criado_em', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['usuario_id'], ['usuario.id'], name='forma_pagamento_usuario_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='forma_pagamento_pkey')
    )
    op.create_index('ix_forma_pagamento_id', 'forma_pagamento', ['id'], unique=False)
    # ### end Alembic commands ###
