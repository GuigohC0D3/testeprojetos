from datetime import datetime
import psycopg2
from connection.config import connect_db
from flask import jsonify

def rent_book(member_id, book_id, due_date):
    conn = connect_db()
    if conn:
        try:
            cur = conn.cursor()

            # Verificar se o livro está disponível
            cur.execute("SELECT disponibilidade FROM bibliotecas WHERE book_id = %s", (book_id,))
            availability = cur.fetchone()[0]

            if not availability:
                return jsonify({'error': 'Livro não está disponível para aluguel'}), 400

            # Registrar o aluguel
            cur.execute("""
                INSERT INTO rentals (member_id, book_id, due_date)
                VALUES (%s, %s, %s);
            """, (member_id, book_id, due_date))

            # Marcar o livro como alugado
            cur.execute("""
                UPDATE bibliotecas SET disponibilidade = FALSE WHERE book_id = %s;
            """, (book_id,))

            conn.commit()
            return jsonify({'data': 'Livro alugado com sucesso!'}), 201
        except psycopg2.Error as e:
            print(f"Erro ao alugar o livro: {e}")
            return jsonify({'error': 'Erro ao alugar o livro'}), 500
        finally:
            cur.close()
            conn.close()

def return_book(rental_id):
    conn = connect_db()
    if conn:
        try:
            cur = conn.cursor()

            # Buscar as informações do aluguel
            cur.execute("SELECT due_date, book_id FROM rentals WHERE rental_id = %s", (rental_id,))
            rental = cur.fetchone()
            due_date = rental[0]
            return_date = datetime.now().date()
            book_id = rental[1]

            # Verificar se há atraso
            if return_date > due_date:
                days_late = (return_date - due_date).days
                fine = days_late * 10  # Exemplo: multa de 5 por dia de atraso
            else:
                fine = 0

            # Atualizar o registro de devolução
            cur.execute("""
                UPDATE rentals 
                SET return_date = %s, fine = %s, returned = TRUE
                WHERE rental_id = %s;
            """, (return_date, fine, rental_id))

            # Marcar o livro como disponível
            cur.execute("""
                UPDATE bibliotecas SET disponibilidade = TRUE WHERE book_id = %s;
            """, (book_id,))

            conn.commit()
            return jsonify({'data': 'Livro devolvido com sucesso!', 'fine': fine}), 200
        except psycopg2.Error as e:
            print(f"Erro ao devolver o livro: {e}")
            return jsonify({'error': 'Erro ao devolver o livro'}), 500
        finally:
            cur.close()
            conn.close()
