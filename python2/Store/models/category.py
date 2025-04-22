from db import db

class Category(db.Model):    
    id = db.mapped_column(db.Integer, primary_key=True)
    name = db.mapped_column(db.String)
    products = db.relationship("Product", back_populates="category")

    def __repr__(self):
        return f"Category(id={self.id}, name='{self.name}')"
    
    def __str__(self):
        return self.name
