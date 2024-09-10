import psycopg2
from connection.config import connect_db
from flask import request, jsonify
from psycopg2 import sql

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

def addMember(name, email):
    conn = connect_db()
    if conn:
        try:
            cur = conn.cursor()
            cur.execute("""
                INSERT INTO members (name, email)
                VALUES (%s, %s)
            """, (name, email))
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

def updateMember(member_id, name, email):
    conn = connect_db()  # Conecte ao banco de dados
    if conn:
        try:
            cur = conn.cursor()
            cur.execute("""
                UPDATE members
                SET name = %s, email = %s
                WHERE member_id = %s;
            """, (name, email, member_id))
            conn.commit()
            print("Membro atualizado com sucesso!")
            return True
        except psycopg2.Error as e:
            print(f"Erro ao atualizar o membro: {e}")
            return False
        finally:
            cur.close()
            conn.close()  # Certifique-se de fechar a conexão
    else:
        print("Não foi possível conectar ao banco de dados.")