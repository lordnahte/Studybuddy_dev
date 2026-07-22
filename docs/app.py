from flask import Flask, send_from_directory, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
import re

app = Flask(__name__, static_folder='.', static_url_path='')
app.secret_key = "dev-secret-change-me"  # fine for local testing only

# In-memory "database" — resets every time the server restarts.
# email (lowercase) -> password hash
users = {}

# email (lowercase) -> list of note dicts: {id, x, y, text, color}
notes_store = {}

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def current_user():
    return session.get('user')


@app.route('/')
def login_page():
    return send_from_directory('.', 'index.html')


@app.route('/study')
def study_page():
    return send_from_directory('.', 'Study.html')


@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json(silent=True) or {}
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    if not email or not password:
        return jsonify(error="Enter both an email and a password."), 400
    if not EMAIL_RE.match(email):
        return jsonify(error="That email address doesn't look right."), 400
    if len(password) < 6:
        return jsonify(error="Password should be at least 6 characters."), 400
    if email in users:
        return jsonify(error="An account already exists for that email."), 400

    users[email] = generate_password_hash(password)
    session['user'] = email
    return jsonify(ok=True)


@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    if not email or not password:
        return jsonify(error="Enter both an email and a password."), 400

    stored_hash = users.get(email)
    if not stored_hash or not check_password_hash(stored_hash, password):
        return jsonify(error="Email or password is incorrect."), 401

    session['user'] = email
    return jsonify(ok=True)


@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    return jsonify(ok=True)


@app.route('/api/session')
def get_session():
    user = session.get('user')
    if user:
        return jsonify(loggedIn=True, email=user)
    return jsonify(loggedIn=False)


@app.route('/api/notes', methods=['GET'])
def get_notes():
    user = current_user()
    if not user:
        return jsonify(error="Not logged in."), 401
    return jsonify(notes=notes_store.get(user, []))


@app.route('/api/notes', methods=['POST'])
def save_notes():
    user = current_user()
    if not user:
        return jsonify(error="Not logged in."), 401

    data = request.get_json(silent=True) or {}
    notes = data.get('notes')

    if not isinstance(notes, list):
        return jsonify(error="Invalid notes payload."), 400

    # Basic shape-check on each note so garbage can't get stored
    clean_notes = []
    for n in notes:
        if not isinstance(n, dict):
            continue
        clean_notes.append({
            "id": str(n.get("id", "")),
            "x": float(n.get("x", 0) or 0),
            "y": float(n.get("y", 0) or 0),
            "text": str(n.get("text", ""))[:2000],
            "color": str(n.get("color", "yellow"))
        })

    notes_store[user] = clean_notes
    return jsonify(ok=True)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
    