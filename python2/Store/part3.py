from app import app
from db import db
from models import Customer

def create_customers():
    with app.app_context():
        # Check if the first customer (your name) exists
        your_name = "Yagayya Vig"
        your_phone = "123-456-7890"
        
        stmt = db.select(Customer).where(Customer.phone == your_phone)
        your_customer = db.session.execute(stmt).scalar_one_or_none()
        
        if not your_customer:
            your_customer = Customer(name=your_name, phone=your_phone)
            db.session.add(your_customer)
            print(f"Created customer: {your_name}")
        else:
            print(f"Customer {your_name} already exists")
        
        # Check if the second customer (Tim) exists
        tim_name = "Tim"
        tim_phone = "666-888-9999"
        
        stmt = db.select(Customer).where(Customer.phone == tim_phone)
        tim_customer = db.session.execute(stmt).scalar_one_or_none()
        
        if not tim_customer:
            tim_customer = Customer(name=tim_name, phone=tim_phone)
            db.session.add(tim_customer)
            print(f"Created customer: {tim_name}")
        else:
            print(f"Customer {tim_name} already exists")
        
        # Commit changes
        db.session.commit()
        
        print("Customers created successfully!")

if __name__ == "__main__":
    create_customers()
