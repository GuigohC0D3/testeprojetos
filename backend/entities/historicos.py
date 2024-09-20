import psycopg2
from ..connection.config import connect_db
from flask import request, jsonify
from psycopg2 import sql
import logging

logging.basicConfig(level=logging.DEBUG)

def get_historico():
    try:
        conn = connect_db()
        if conn is None:
            raise Exception("Não foi possível conectar ao banco de dados.")
        
        with conn.cursor() as cursor:
            cursor.execute("""
               SELECT 
                    members.name AS member,
                    bibliotecas.title AS title,
                    alugueis.rental_date,
                    alugueis.return_date
                FROM 
                    alugueis
                JOIN 
                    members ON alugueis.member_id = members.member_id
                JOIN 
                    bibliotecas ON alugueis.book_id = bibliotecas.book_id
                ORDER BY 
                        alugueis.rental_date DESC;

            """)

            rows = cursor.fetchall()
            logging.debug(f"Dados retornados: {rows}")

            historico = [
                {
                    'member': row[0],
                    'title': row[1],
                    'rental_date': row[2],
                    'return_date': row[3]
                }
                for row in rows
            ]

        conn.close()
        return historico

    except Exception as e:
        logging.error(f"Erro ao buscar histórico: {str(e)}")
        return []
