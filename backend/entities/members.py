import psycopg2
from ..connection.config import connect_db
from flask import request, jsonify
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from psycopg2 import sql
from werkzeug.security import check_password_hash


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
            return jsonify({'data': members, 'status': 201 })
        except psycopg2.Error as e:
            print(f"Erro ao listar membros: {e}")
            return jsonify({'error': 'Erro ao adicionar membro'}), 500
    else:
        return jsonify({'error': 'Erro ao conectar ao banco de dados'}), 500

def addMember(name, email, username, password, phonenumber):
    conn = connect_db()
    if conn:
        try:
            cur = conn.cursor()
            cur.execute("""
                INSERT INTO members (name, email, username, password, phonenumber)
                VALUES (%s, %s, %s, %s, %s)
            """, (name, email, username, password, phonenumber))
            conn.commit()
            cur.close()
            conn.close()
            return jsonify({'data': 'Usuário adicionado com sucesso!', 'status': 201})
        except psycopg2.Error as e:
            print(f"Erro ao adicionar membro: {e}")
            return jsonify({'data': f"Erro ao adicionar membro: {str(e)}", 'status': 500})
    else:
        return jsonify({'data': 'Erro ao conectar ao banco de dados', 'status': 500})




def deleteMember(member_id):
    conn = connect_db()
    if conn:
        try:
            cur = conn.cursor()
            cur.execute("DELETE FROM members WHERE member_id = %s", (member_id,))
            conn.commit()
            print("Membro deletado com sucesso!")
        except psycopg2.Error as e:
            print(f"Erro ao deletar o membro: {e}")
        finally:
            cur.close()
            conn.close()
    else:
        print("Não foi possível conectar ao banco de dados.")

def updateMember(member_id, name, email, username, password, phonenumber):
    conn = connect_db()  # Conecte ao banco de dados
    if conn:
        try:
            cur = conn.cursor()
            cur.execute("""
                UPDATE members
                SET name = %s, email = %s, username = %s, password = %s, phonenumber = %s
                WHERE member_id = %s;
            """, (name, email, username, password, phonenumber, member_id))
            conn.commit()
            print("Membro atualizado com sucesso!")
            return True
        except psycopg2.Error as e:
            print(f"Erro ao atualizar o membro: {e}")
            return False
        finally:
            cur.close()
            conn.close()
    else:
        print("Não foi possível conectar ao banco de dados.")
    

def execute_query(query, params):
    conn = connect_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute(query, params)
            result = cursor.fetchall()
        conn.commit()
    except Exception as e:
        print(f"Erro ao executar a query: {e}")
        result = None
    finally:
        conn.close()
    return result

def check_credentials(email_or_username, password):
    conn = connect_db()
    if conn:
        try:
            cur = conn.cursor()
            query = """
                SELECT * FROM members WHERE (email = %s OR username = %s) AND password = %s
            """
            cur.execute(query, (email_or_username, email_or_username, password))
            user = cur.fetchone()
            cur.close()
            conn.close()
            
            if user:
                return {
                    'member_id': user[0],
                    'name': user[1],
                    'email': user[2]
                }
        except psycopg2.Error as e:
            print(f"Erro ao verificar credenciais: {e}")
            return None
    return None

def get_user_by_email(email):
    conn = connect_db.connect()  # Conexão ao banco de dados
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM members WHERE email = %s", (email,))
    members = cursor.fetchone()
    conn.close()
    return members

def load_user(member_id):
    return get_members(member_id) 

def get_user_by_email_or_username(email_or_username):
    conn = connect_db()
    if conn:
        try:
            cur = conn.cursor()
            query = """
            SELECT id, name, email, username, password_hash 
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
    cur.execute("SELECT id, email, celular, cpf, password_hash FROM members WHERE email = %s", (email,))
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
