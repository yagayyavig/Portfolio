# 💸 Expense Tracker

A simple, responsive web application to track personal expenses — built with **Flask**, **SQLAlchemy**, and **Jinja2**, styled with a custom **dark theme**, and tested using **pytest**. Ideal for developers learning full-stack development or building a practical finance management tool.

---

## 📦 Features

- ✅ Add, view, and categorize expenses
- 📆 Beautiful date picker powered by Flatpickr
- 🛑 Validations: no negative or future dates
- 🌙 Custom dark-mode UI with hover and load animations
- 📂 Categorized dropdown list for expense types
- 💬 Optional notes per entry
- 🧪 Complete testing suite with edge case coverage

---

## 🧪 Tech Stack

| Layer       | Technology             |
|-------------|------------------------|
| Backend     | Python, Flask          |
| Database    | SQLite, SQLAlchemy     |
| Frontend    | HTML, Jinja2, CSS      |
| UI          | Flatpickr, Custom CSS  |
| Testing     | pytest, Flask testing  |

---

## 🚀 Getting Started

### 📥 Prerequisites

- Python 3.10+
- `virtualenv` recommended

### ⚙️ Installation

```bash
git clone https://github.com/yourusername/expense-tracker.git
cd expense-tracker
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

▶️ Run the App

```bash
py ./app.py
Visit: http://localhost:5000
```

🧪 Running Tests

```bash
pytest
```

Test suite includes:

  -Valid expense submission

  -Invalid input (empty, negative, future)

  -Invalid category and date formats

  -Edge cases for large values and optional fields.
  