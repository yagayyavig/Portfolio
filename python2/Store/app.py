from flask import Flask, render_template, request, Response
from db import db
from pathlib import Path
from datetime import datetime
from models import Product, Category, Customer, Order, ProductOrder

app = Flask(__name__, static_url_path="/python2/static")
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///store.db"
app.config["APPLICATION_ROOT"] = "/python2/"
app.instance_path = Path(".").resolve()
db.init_app(app)

with app.app_context():
    db.create_all()


from flask import Response

@app.route("/python2/sitemap.xml")
def sitemap():
    pages = []
    base_url = "https://python-udgu.onrender.com/python2"
    today = datetime.now().date().isoformat()

    # Static pages
    static_urls = [
        (f"{base_url}/", "monthly"),
        (f"{base_url}/products", "weekly"),
        (f"{base_url}/categories", "weekly"),
        (f"{base_url}/customers", "weekly"),
        (f"{base_url}/orders", "daily"),
    ]
    for url, freq in static_urls:
        pages.append(f"""
            <url>
                <loc>{url}</loc>
                <lastmod>{today}</lastmod>
                <changefreq>{freq}</changefreq>
                <priority>1.0</priority>
            </url>
        """)

    # Dynamic Categories
    categories = db.session.execute(db.select(Category)).scalars()
    for category in categories:
        pages.append(f"""
            <url>
                <loc>{base_url}/categories/{category.id}</loc>
                <lastmod>{today}</lastmod>
                <changefreq>weekly</changefreq>
                <priority>0.8</priority>
            </url>
        """)

    # Dynamic Customers
    customers = db.session.execute(db.select(Customer)).scalars()
    for customer in customers:
        pages.append(f"""
            <url>
                <loc>{base_url}/customers/{customer.id}</loc>
                <lastmod>{today}</lastmod>
                <changefreq>monthly</changefreq>
                <priority>0.6</priority>
            </url>
        """)

    # Dynamic Orders
    orders = db.session.execute(db.select(Order)).scalars()
    for order in orders:
        pages.append(f"""
            <url>
                <loc>{base_url}/orders/{order.id}</loc>
                <lastmod>{today}</lastmod>
                <changefreq>daily</changefreq>
                <priority>0.7</priority>
            </url>
        """)

    # Final XML response
    sitemap_xml = f"""<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        {''.join(pages)}
    </urlset>"""

    return Response(sitemap_xml, mimetype="application/xml")


@app.route("/python2/")
def home():
    return render_template("home.html")

@app.route("/python2/products")
def list_products():
    sort = request.args.get("sort")
    statement = db.select(Product)

    if sort == "name":
        statement = statement.order_by(Product.name)
    elif sort == "price":
        statement = statement.order_by(Product.price)
    elif sort == "available":
        statement = statement.order_by(Product.available)
    elif sort == "category":
        statement = statement.order_by(Product.category_id)

    products = db.session.execute(statement).scalars()
    return render_template("products.html", products=products)

@app.route("/python2/categories")
def list_categories():
    categories = db.session.execute(db.select(Category)).scalars()
    return render_template("categories.html", categories=categories)

@app.route("/python2/categories/<int:id>")
def category_detail(id):
    category = db.session.execute(db.select(Category).where(Category.id == id)).scalar_one_or_none()
    if category:
        products = category.products
        return render_template("category_detail.html", category=category, products=products)
    return "Category Not Found", 404

@app.route("/python2/customers")
def list_customers():
    sort = request.args.get("sort")
    statement = db.select(Customer)

    if sort == "name":
        statement = statement.order_by(Customer.name)
    elif sort == "id":
        statement = statement.order_by(Customer.id)

    customers = db.session.execute(statement).scalars().all()
    return render_template("customers.html", customers=customers)

@app.route("/python2/customers/<int:id>")
def customer_detail(id):
    customer = db.session.execute(db.select(Customer).where(Customer.id == id)).scalar_one_or_none()
    if customer:
        return render_template("customer_detail.html", customer=customer)
    return "Customer Not Found", 404

@app.route("/python2/orders")
def orders():
    sort = request.args.get("sort")
    status = request.args.get("status")
    completed_after = request.args.get("completed_after")
    completed_before = request.args.get("completed_before")

    statement = db.select(Order)

    if completed_after:
        try:
            after_dt = datetime.strptime(completed_after, "%Y.%m/%d@%H:%M")
            statement = statement.where(Order.completed >= after_dt)
        except ValueError:
            pass

    if completed_before:
        try:
            before_dt = datetime.strptime(completed_before, "%Y.%m/%d@%H:%M")
            statement = statement.where(Order.completed <= before_dt)
        except ValueError:
            pass

    if sort == "date":
        statement = statement.order_by(Order.completed)
    elif sort == "id":
        statement = statement.order_by(Order.id)

    if status == "pending":
        statement = statement.where(Order.completed == None)
    elif status == "completed":
        statement = statement.where(Order.completed != None)

    orders_list = db.session.execute(statement).scalars().all()
    return render_template("orders.html", orders=orders_list)

@app.route("/python2/orders/<int:id>")
def order(id):
    order_obj = db.session.execute(db.select(Order).where(Order.id == id)).scalar_one_or_none()
    if not order_obj:
        return render_template("error.html", message=f"Order with ID {id} not found"), 404
    return render_template("orders_detail.html", order=order_obj)

@app.route("/python2/orders/<int:id>/complete", methods=["POST"])
def complete_order(id):
    order_obj = db.session.execute(db.select(Order).where(Order.id == id)).scalar_one_or_none()
    if not order_obj:
        return render_template("error.html", message=f"Order with ID {id} not found"), 404

    try:
        order_obj.complete()
        db.session.commit()
        orders_list = db.session.execute(db.select(Order)).scalars().all()
        return render_template("orders.html", orders=orders_list)
    except ValueError as e:
        return render_template("error.html", message=f"{e}"), 409

if __name__ == "__main__":
    app.run(debug=True, port=8888)
