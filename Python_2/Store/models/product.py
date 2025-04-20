from db import db

class Product(db.Model):
    id = db.mapped_column(db.Integer, primary_key=True)
    name = db.mapped_column(db.String)
    price = db.mapped_column(db.DECIMAL(10,2))
    available = db.mapped_column(db.Integer, default=0)
    category_id = db.mapped_column(db.Integer, db.ForeignKey("category.id"))
    category = db.relationship("Category", back_populates="products")

    def __repr__(self):
        return f"Product(id={self.id}, name='{self.name}', price={self.price}, available={self.available})"
    
    def __str__(self):
        return f"{self.name} - ${float(self.price):.2f} ({self.available} in stock)"
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "price": float(self.price),
            "available": self.available,
            "category_name": self.category.name if self.category else None
        }
