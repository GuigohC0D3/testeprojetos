import psycopg2
from ..connection.config import connect_db
from flask import request, jsonify
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from psycopg2 import sql
from werkzeug.security import check_password_hash, generate_password_hash
import logging
from .user import User  # Ajuste o caminho conforme necessário

logging.basicConfig(level=logging.DEBUG)

# Função para verificar o usuário no banco de dados
def verify_user(email, password):
    conn = connect_db()
    cursor = conn.cursor()

    try:
        # Seleciona o id, username e hash da senha com base no email
        cursor.execute("SELECT id, username, password FROM members WHERE email = %s", (email,))
        user = cursor.fetchone()
        
        print(f"Usuário encontrado: {user}")  # Log do usuário encontrado

        if user:
            # Comparando a senha usando check_password_hash
            if check_password_hash(user[2], password):  # user[2] é o hash da senha armazenado
                # Criando uma instância da classe User
                user_obj = User(id=user[0], username=user[1], email=email)
                return user_obj
            else:
                print("Senha inválida")  # Log se a senha for inválida
        else:
            print("Usuário não encontrado")  # Log se o usuário não for encontrado
        return None

    except Exception as e:
        print(f"Erro ao verificar o login: {str(e)}")
        return None

    finally:
        cursor.close()
        conn.close()

# Função para atualizar a senha no banco de dados
def update_password(email, plain_password):
    hash_password = generate_password_hash(plain_password)  # Gera o hash da senha
    conn = connect_db()  # Função que conecta ao seu banco de dados
    cursor = conn.cursor()

    try:
        # Atualiza a senha no banco de dados
        cursor.execute("UPDATE members SET password = %s WHERE email = %s", (hash_password, email))
        conn.commit()  # Confirma a alteração no banco de dados
        print("Senha atualizada com sucesso.")
    except Exception as e:
        print(f"Erro ao atualizar a senha: {str(e)}")
    finally:
        cursor.close()
        conn.close()
