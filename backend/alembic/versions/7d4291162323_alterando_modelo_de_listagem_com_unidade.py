"""alterando modelo de listagem com unidade

Revision ID: 7d4291162323
Revises: a97f9284494f
Create Date: 2025-06-19 02:44:39.806469

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7d4291162323'
down_revision: Union[str, None] = 'a97f9284494f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
