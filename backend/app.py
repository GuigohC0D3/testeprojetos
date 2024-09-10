from flask import Flask, request, render_template, jsonify
from flask_cors import CORS, cross_origin
import psycopg2
from psycopg2 import sql

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# Configurações do banco de dados
def connect_db():
    DB_NAME = "cursonline"
    DB_USER = "postgres"
    DB_PASS = "Admin"
    DB_HOST = "127.0.0.1"
    DB_PORT = "5433"

    try:
        conn = psycopg2.connect(
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS,
            host=DB_HOST,
            port=DB_PORT
        )
        return conn
    except psycopg2.Error as e:
        print(f"Erro ao conectar ao banco de dados: {e}")
        return None

@app.route('/')
@cross_origin()
def index():
    return jsonify({'data': 'Hello World!'})

#Rota para adicionar novos membros na biblioteca
@app.route('/add_member', methods=['POST'])
@cross_origin()
def add_member():
    conn = connect_db()
    if conn:
        cur = conn.cursor()
        try:
            # Supondo que você envie os dados no formato JSON
            data = request.json
            name = data['name']
            age = data['age']

            # Insere o novo membro na tabela
            cur.execute("INSERT INTO members (name, age) VALUES (%s, %s)", (name, age))
            conn.commit()
            
            return jsonify({'message': 'Membro adicionado com sucesso!'}), 201
        except psycopg2.Error as e:
            print(f"Erro ao inserir membro: {e}")
            return jsonify({'error': 'Erro ao adicionar membro'}), 500
        finally:
            cur.close()
            conn.close()
    else:
        return jsonify({'error': 'Erro ao conectar ao banco de dados'}), 500

@app.route('/users', methods=['GET'])
@cross_origin()
def get_users():
    users = {
        'users': [
            {'name': 'user1', 'idade': 18},
            {'name': 'user2', 'idade': 18},
            {'name': 'user3', 'idade': 18},
            {'name': 'user4', 'idade': 18},
            {'name': 'user5', 'idade': 18},
            {'name': 'user6', 'idade': 18},
        ]
    }
    return render_template('index.html', users=users), 201

@app.route('/books', methods=['GET'])
@cross_origin()
def get_books():
    conn = connect_db()
    if conn:
        cur = conn.cursor()
        try:
            cur.execute("SELECT * FROM Bibliotecas")
            books = cur.fetchall()
            cur.close()
            conn.close()

            # Converte o resultado em um formato JSON
            books_list = []
            for book in books:
                books_list.append({
                    'book_id': book[0],
                    'title': book[1],
                    'author_id': book[2],
                    'publication_year': book[3],
                    'genre': book[4]
                })

            return jsonify({'books': books_list}), 200
        except psycopg2.Error as e:
            print(f"Erro ao executar a consulta: {e}")
            return jsonify({'error': 'Erro ao buscar livros'}), 500
    else:
        return jsonify({'error': 'Erro ao conectar ao banco de dados'}), 500
@app.route('/members', methods=['GET'])
@cross_origin()
def get_members():
    conn = connect_db()
    if conn:
        try:
            cur = conn.cursor()
            cur.execute("SELECT * FROM members")
            members = []
            while True:
                row=cur.fetchone()
                if row is None:
                    break
                members.append(row)
            cur.close()
            conn.close()
            print(members)
            return jsonify({'data': members, 'status': 201 })
        except psycopg2.Error as e:
            print(f"Erro ao listar membros: {e}")
            return jsonify({'error': 'Erro ao adicionar membro'}), 500
    else:
        return jsonify({'error': 'Erro ao conectar ao banco de dados'}), 500


if __name__ == '__main__':
    app.run(debug=True)