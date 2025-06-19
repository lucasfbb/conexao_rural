"""alterando modelo de listagem com unidade

Revision ID: 6bdfc87a5e87
Revises: 7d4291162323
Create Date: 2025-06-19 02:46:30.052043

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6bdfc87a5e87'
down_revision: Union[str, None] = '7d4291162323'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
