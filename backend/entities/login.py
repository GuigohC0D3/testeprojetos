import psycopg2
from ..connection.config import connect_db
from flask import request, jsonify
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from psycopg2 import sql
from werkzeug.security import check_password_hash

def get_user_by_email_or_username(email_or_username):
    conn = connect_db()
    if conn:
        try:
            cur = conn.cursor()
            query = """
            SELECT member_id, name, email, username, password 
            FROM members 
            WHERE email = %s OR username = %s
            """
            cur.execute(query, (email_or_username, email_or_username))
            user = cur.fetchone()
            if user:
                # Retorne um objeto de usuário com os atributos que o Flask-Login espera
                return UserMixin(user[0], user[1], user[2], user[3], user[4])  # Supondo que tenha essas colunas
            cur.close()
            conn.close()
        except psycopg2.Error as e:
            print(f"Erro ao buscar o usuário: {e}")
    return None

# Função para autenticar o usuário
def authenticate_user(email, password):
    conn = connect_db()
    cur = conn.cursor()

    # Busca o membro pelo email
    cur.execute("SELECT member_id, email, celular, cpf, password FROM members WHERE email = %s", (email,))
    result = cur.fetchone()

    if result and check_password_hash(result[4], password):  # Verifica o hash da senha
        user = UserMixin()
        user.id = result[0]
        user.email = result[1]
        user.celular = result[2]
        user.cpf = result[3]
        return user  # Retorna o usuário autenticado
    

def check_password_hash(stored_password, provided_password):
    return check_password_hash(stored_password, provided_password)