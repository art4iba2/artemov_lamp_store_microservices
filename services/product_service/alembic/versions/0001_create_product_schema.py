"""create product schema"""
from collections.abc import Sequence
import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0001_product"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

def upgrade() -> None:
    for table in ["categories", "lamp_types", "shapes", "base_types", "suppliers"]:
        op.create_table(table, sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True), sa.Column("name", sa.String(255), nullable=False))
        op.create_index(f"ix_{table}_name", table, ["name"], unique=True)
    op.create_table("products",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("price", sa.Numeric(10, 2), nullable=False),
        sa.Column("brightness", sa.Integer(), nullable=True),
        sa.Column("stock", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("is_archived", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("expected_arrival", sa.Date(), nullable=True),
        sa.Column("category_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("categories.id")),
        sa.Column("type_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("lamp_types.id")),
        sa.Column("shape_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("shapes.id")),
        sa.Column("base_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("base_types.id")),
        sa.Column("supplier_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("suppliers.id")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False))
    op.create_index("ix_products_title", "products", ["title"])
    op.create_index("ix_products_is_archived", "products", ["is_archived"])
    op.create_table("images", sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True), sa.Column("product_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("products.id", ondelete="CASCADE"), nullable=False), sa.Column("url", sa.String(1000), nullable=False))
    op.create_index("ix_images_product_id", "images", ["product_id"])
    op.create_table("promotions", sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True), sa.Column("title", sa.String(255), nullable=False), sa.Column("description", sa.Text()), sa.Column("starts_at", sa.Date()), sa.Column("ends_at", sa.Date()), sa.Column("is_active", sa.Boolean(), server_default=sa.true(), nullable=False))
    op.create_table("reviews", sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True), sa.Column("product_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("products.id", ondelete="CASCADE"), nullable=False), sa.Column("author_name", sa.String(255), nullable=False), sa.Column("rating", sa.Integer(), nullable=False), sa.Column("text", sa.Text()), sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False))
    op.create_index("ix_reviews_product_id", "reviews", ["product_id"])

def downgrade() -> None:
    for table in ["reviews", "promotions", "images", "products", "suppliers", "base_types", "shapes", "lamp_types", "categories"]:
        op.drop_table(table)
