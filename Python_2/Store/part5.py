from app import app
from db import db
from models import Product, Category
import csv

def import_products_from_csv(csv_file="data/final-products.csv"):
    with app.app_context():
        print(f"Importing products from {csv_file}...")
        try:
            with open(csv_file, "r") as file:
                reader = csv.DictReader(file)

                for row in reader:
                    # Check if category exists, create if not
                    category_name = row['category']
                    stmt = db.select(Category).where(Category.name == category_name)
                    category = db.session.execute(stmt).scalar_one_or_none()

                    if not category:
                        category = Category(name=category_name)
                        db.session.add(category)
                        db.session.flush()  # To get the category ID
                        print(f"Created category: {category_name}")

                    # Check if product exists, create if not
                    product_name = row['name']
                    stmt = db.select(Product).where(Product.name == product_name)
                    product = db.session.execute(stmt).scalar_one_or_none()

                    if not product:
                        product = Product(
                            name=product_name,
                            price=float(row['price']),
                            available=int(row['available']),
                            category=category
                        )
                        db.session.add(product)
                        print(f"Created product: {product_name}")
                    else:
                        print(f"Product {product_name} already exists")

                db.session.commit()
                print("Products imported successfully!")

        except Exception as e:
            db.session.rollback()
            print(f"Error importing products: {e}")

if __name__ == "__main__":
    import_products_from_csv()
