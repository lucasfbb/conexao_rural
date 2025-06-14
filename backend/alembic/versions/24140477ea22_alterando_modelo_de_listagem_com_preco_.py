"""alterando modelo de listagem com preco de promocao

Revision ID: 24140477ea22
Revises: 589b02b2244e
Create Date: 2025-06-15 02:23:19.695187

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '24140477ea22'
down_revision: Union[str, None] = '589b02b2244e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('listagem', sa.Column('preco_promocional', sa.Integer(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('listagem', 'preco_promocional')
    # ### end Alembic commands ###
