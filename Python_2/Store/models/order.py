from db import db
from datetime import datetime

class Order(db.Model):
    id = db.mapped_column(db.Integer, primary_key=True, autoincrement=True)
    customer_id = db.mapped_column(db.Integer, db.ForeignKey("customer.id"), nullable=False)
    customer = db.relationship('Customer', back_populates='orders')
    created = db.mapped_column(db.DateTime, nullable=False, default=db.func.now())
    completed = db.mapped_column(db.DateTime, nullable=True, default=None)
    amount = db.mapped_column(db.DECIMAL(6, 2), nullable=True, default=None)
    delivery = db.mapped_column(db.Boolean, default=False)  # False = pickup, True = delivery
    items = db.relationship('ProductOrder', back_populates='order')

    def estimate(self):
        subtotal = sum(po.product.price * po.quantity for po in self.items)

        # Add delivery fee if applicable
        if self.delivery:
            if self.customer.premium:
                subtotal += 1  # $1 delivery fee for premium customers
            else:
                subtotal += 5  # $5 delivery fee for regular customers

        return subtotal

    def complete(self):
        if self.completed is not None:
            raise ValueError("Order has been completed")

        # Check product availability
        for po in self.items:
            if po.quantity > po.product.available:
                raise ValueError(f"Not enough available for {po.product.name}. Requested {po.quantity}, Available: {po.product.available}")

        # Calculate the total cost
        total_cost = self.estimate()

        # Check if customer has enough money
        if self.customer.money < total_cost:
            raise ValueError(f"Customer does not have enough money. Required: ${total_cost}, Available: ${float(self.customer.money)}")

        # Process the order
        self.customer.money -= total_cost  # Deduct money from customer

        # Update product inventory
        for po in self.items:
            po.product.available -= po.quantity

        # Mark order as completed
        self.completed = datetime.now()
        self.amount = total_cost

        return True

    def to_dict(self):
        result = {
            "id": self.id,
            "customer": self.customer.name if self.customer else None,
            "created": self.created.strftime("%a, %d %b %Y %H:%M:%S GMT") if self.created else None,
            "completed": self.completed,
            "delivery": self.delivery,
            "products": []
        }

        for item in self.items:
            product_info = {
                "id": item.product.id,
                "name": item.product.name,
                "price": float(item.product.price),
                "quantity": item.quantity
            }
            if not self.completed:
                product_info["available"] = item.product.available
            result["products"].append(product_info)

        if self.completed:
            result["amount"] = float(self.amount)
            result["completed_date"] = self.completed
            result["completed"] = True
        else:
            result["completed"] = False
            result["estimated_total"] = float(self.estimate())

        return result
