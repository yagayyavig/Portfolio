from app import app
import random
from datetime import datetime as dt
from datetime import timedelta
from db import db
from models import Product, Customer, Category, ProductOrder, Order
import csv
import sys

def create_tables():
    """Creates all tables in the database."""
    db.create_all()
    print("Tabes Created Successfully !")

def drop_tables():
    """Drops all tables from the database."""
    db.drop_all()
    print("Tables Dropped successfully")

def import_data():
    """Imports product data from a CSV file into the database using SQLAlchemy's `select()`."""
    print("Importing products...")
    try:
        with open("data/products.csv", "r") as file:
            reader = csv.DictReader(file)

            for row in reader:
                category_name = row['category']

                # Find existing category using select()
                category = db.session.execute(db.select(Category).where(Category.name == category_name)).scalar_one_or_none()

                # If category does not exist, create it
                if not category:
                    category = Category(name=category_name)
                    db.session.add(category)
                    db.session.flush()  # Ensure category ID is available

                # Check if the product already exists to prevent duplicates
                existing_product = db.session.execute(db.select(Product).where(Product.name == row['name'])).scalar_one_or_none()
                if not existing_product:
                    product = Product(
                        name=row['name'],
                        price=float(row['price']),
                        available=int(row['available']),
                        category=category
                    )
                    db.session.add(product)

            db.session.commit()
            print(f"Products imported successfully!")

    except Exception as e:
        db.session.rollback()
        print(f"Error importing products: {e}")

    finally:
        db.session.close()

def import_customers():
    """Imports customer data from a CSV file using SQLAlchemy's `select()`."""
    print("Importing customers...")

    try:
        with open("data/customers.csv", "r") as file:
            reader = csv.DictReader(file)

            for row in reader:
                # Check if customer already exists to prevent duplication
                existing_customer = db.session.execute(db.select(Customer).where(Customer.name == row['name'])).scalar_one_or_none()
                if not existing_customer:
                    customer = Customer(
                        name=row['name'],
                        phone=row['phone']
                    )
                    db.session.add(customer)

        db.session.commit()
        print(f"Customers imported successfully!")

    except Exception as e:
        db.session.rollback()
        print(f"Error importing customers: {e}")

    finally:
        db.session.close()

def get_out_of_stock_products():
    """
    Retrieves all products that are out of stock using SQLAlchemy's `select()`.
    Returns:
        List of out-of-stock Product objects.
    """
    try:
        products = db.session.execute(db.select(Product).where(Product.available <= 0)).scalars().all()
        return products
    finally:
        db.session.close()

def search_customers_by_name(search_term):
    """
    Searches for customers by name using SQLAlchemy's `select()`.
    Args:
        search_term (str): The partial or full name of the customer.()
    Returns:
        List of matching Customer objects.
    """
    try:
        customers = db.session.execute(db.select(Customer).where(Customer.name.ilike(f"%{search_term}%"))).scalars().all()
        return customers
    finally:
        db.session.close()

def random_orders(num_orders=15):
    with app.app_context():
        for i in range(num_orders):
            # Get a random Customer
            random_customer = db.session.execute(db.select(Customer).order_by(db.func.random())).scalars().first()

            # Create a random date in the past

            random_date = dt.now() - timedelta(
                days= random.randint(1,7),
                hours= random.randint(0,23),
                minutes=random.randint(0, 59)
            )

            # Create a new order
            new_order = Order(customer=random_customer, created=random_date)
            db.session.add(new_order)
            db.session.flush()  # To get the order ID

            # Get a random number of products (between 2 and 5)
            num_products = random.randint(2, 5)
            random_products = db.session.execute(
                db.select(Product).order_by(db.func.random()).limit(num_products)
            ).scalars().all()

            # add product to the order
            for product in random_products:
                # Random quantity between 1 and 10:
                quantity = random.randint(1,10)
                product_order = ProductOrder(product_id=product.id, order_id=new_order.id, quantity=quantity)
                db.session.add(product_order)

            # Randomly mark some orders as completed
            if random.random() < 0.4: # 30% chance of being completed
                try:
                    new_order.complete()
                except ValueError:
                    # If not in inventory then leave it pending
                    pass
            db.session.commit()

        print(f"{num_orders} random orders generated with no issues")

if __name__ == "__main__":
    with app.app_context():
        if len(sys.argv) <= 1 or sys.argv[1] == "setup":
            # Default behavior - setup everything
            if "--keep-tables" in sys.argv:
                print("Skipping table drop... Keeping existing tables.")
            else:
                db.drop_all()
                db.create_all()

            import_data()
            import_customers()
            random_orders()
            print("Database setup complete.")
        elif sys.argv[1] == "create-tables":
            create_tables()
        elif sys.argv[1] == "drop-tables":
            drop_tables()
        elif sys.argv[1] == "import-data":
            import_data()
        elif sys.argv[1] == "import-customers":
            import_customers()
        elif sys.argv[1] == "random-orders":
            num = 15
            if len(sys.argv) > 2:
                try:
                    num = int(sys.argv[2])
                except ValueError:
                    pass
            random_orders(num)
        elif sys.argv[1] == "out-of-stock":
            products = get_out_of_stock_products()
            print(f"Found {len(products)} out-of-stock products:")
            for p in products:
                print(f"  - {p}")
        elif sys.argv[1] == "search-customers":
            if len(sys.argv) > 2:
                search_term = sys.argv[2]
                customers = search_customers_by_name(search_term)
                print(f"Found {len(customers)} customers matching '{search_term}':")
                for c in customers:
                    print(f"  - {c}")
            else:
                print("Please provide a search term.")
        else:
            print("Unknown command. Available commands:")
            print("  setup - Set up the entire database (default)")
            print("  create-tables - Create database tables")
            print("  drop-tables - Drop all database tables")
            print("  import-data - Import product data from CSV")
            print("  import-customers - Import customer data from CSV")
            print("  random-orders [num] - Generate random orders")
            print("  out-of-stock - List out-of-stock products")
            print("  search-customers <term> - Search customers by name")