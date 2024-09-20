import psycopg2
from ..connection.config import connect_db
from flask import request, jsonify

def get_employee():
    conn = connect_db()
    if conn:
        try:
            cur = conn.cursor()
            cur.execute("SELECT * FROM employee")
            employee = cur.fetchall()
            cur.close()
            conn.close()

            # Estrutura os dados para o formato JSON
            employee_list = []
            for employee in employee:
                employee_list.append({
                    'id': employee[0],
                    'name': employee[1],
                    'email': employee[2]
                })

            return jsonify({'employee': employee_list}), 200
        except psycopg2.Error as e:
            print(f"Erro ao listar funcionários: {e}")
            return jsonify({'error': 'Erro ao buscar funcionários'}), 500
    else:
        return jsonify({'error': 'Erro ao conectar ao banco de dados'}), 500