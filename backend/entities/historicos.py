import psycopg2
from connection.config import connect_db
from flask import request, jsonify
from psycopg2 import sql

def get_historico():
    conn = connect_db()
    historico = conn.execute('''
        SELECT a.id, a.member_id, a.book_id, a.rental_date, a.return_date, b.title, b.author_id, b.publication_year, b.genre,
               CASE 
                   WHEN a.return_date IS NULL THEN 'Não devolvido'
                   ELSE 'Devolvido'
               END AS status
        FROM alugueis a
        JOIN bibliotecas b ON a.book_id = b.book_id
    ''').fetchall()
    conn.close()
    return jsonify({'historico': [dict(row) for row in historico]})