from db import db

class ProductOrder(db.Model):
    product_id = db.mapped_column(db.ForeignKey("product.id"), primary_key=True)
    order_id = db.mapped_column(db.ForeignKey("order.id"), primary_key=True)
    quantity = db.mapped_column(db.Integer, nullable=False)

    product = db.relationship('Product')
    order = db.relationship('Order', back_populates='items')

    def __repr__(self):
        return f"ProductOrder(product_id={self.product_id}, order_id={self.order_id}, quantity={self.quantity})"
    