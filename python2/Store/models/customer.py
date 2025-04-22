from db import db
from models.order import Order  # for use in queries

class Customer(db.Model):
    id = db.mapped_column(db.Integer, primary_key=True)
    name = db.mapped_column(db.String, nullable=False)
    phone = db.mapped_column(db.String)
    money = db.mapped_column(db.DECIMAL(10, 2), default=0)
    premium = db.mapped_column(db.Boolean, default=False)
    orders = db.relationship("Order", back_populates="customer")

    def __repr__(self):
        return f"Customer(id={self.id}, name='{self.name}', phone='{self.phone}')"

    def __str__(self):
        return f"{self.name} ({self.phone})"

    def completed_orders(self):
        stmt = db.select(Order).where(
            Order.customer_id == self.id,
            Order.completed != None
        ).order_by(Order.completed.desc())
        return db.session.execute(stmt).scalars().all()

    def pending_orders(self):
        stmt = db.select(Order).where(
            Order.customer_id == self.id,
            Order.completed == None
        ).order_by(Order.created.asc())
        return db.session.execute(stmt).scalars().all()

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "phone": self.phone,
            "money": float(self.money),
            "premium": self.premium,
            "completed_orders": [order.to_dict() for order in self.completed_orders()],
            "pending_orders": [order.to_dict() for order in self.pending_orders()]
        }
