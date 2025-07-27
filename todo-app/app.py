from flask import Flask, render_template, request, redirect
import pymysql
from config import DB_HOST, DB_USER, DB_PASSWORD, DB_NAME

app = Flask(__name__)

conn = pymysql.connect(host=DB_HOST, user=DB_USER, password=DB_PASSWORD, database=DB_NAME)
cursor = conn.cursor()

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        task = request.form['task']
        cursor.execute("INSERT INTO todos (task) VALUES (%s)", (task,))
        conn.commit()
        return redirect('/')
    
    cursor.execute("SELECT * FROM todos")
    tasks = cursor.fetchall()
    return render_template('index.html', tasks=tasks)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
