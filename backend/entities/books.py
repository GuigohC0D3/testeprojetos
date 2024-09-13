import psycopg2
from connection.config import connect_db
from flask import request, jsonify

def get_books():
    try:
        conn = connect_db()
        if conn:
            cur = conn.cursor()

            # Consulta para buscar os livros e verificar a disponibilidade
            cur.execute("""
                SELECT b.book_id, b.title, b.author_id, b.publication_year, b.genre,
                CASE
                    WHEN r.book_id IS NOT NULL AND r.return_date IS NULL THEN 'Alugado'
                    ELSE 'Disponível'
                END AS disponibilidade
                FROM bibliotecas b
                LEFT JOIN rentals r ON b.book_id = r.book_id AND r.return_date IS NULL;
            """)

            books = cur.fetchall()
            cur.close()
            conn.close()

            books_list = []
            for book in books:
                books_list.append({
                    'book_id': book[0],
                    'title': book[1],
                    'author_id': book[2],
                    'publication_year': book[3],
                    'genre': book[4],
                    'disponibilidade': book[5]  # Adiciona a coluna de disponibilidade
                })

            return jsonify({'books': books_list}), 200

        else:
            print("Erro ao conectar ao banco de dados.")
            return jsonify({'error': 'Erro ao conectar ao banco de dados'}), 500

    except psycopg2.Error as e:
        print(f"Erro ao listar livros: {e}")
        return jsonify({'error': f"Erro ao listar livros: {str(e)}"}), 500
    except Exception as e:
        print(f"Erro geral: {e}")
        return jsonify({'error': f"Erro geral: {str(e)}"}), 500



    

def addBook(title, author_id, publication_year, genre):
    conn = connect_db()  # Conectar ao banco de dados
    if conn:
        try:
            cur = conn.cursor()
            cur.execute("""
                INSERT INTO Bibliotecas (title, author_id, publication_year, genre)
                VALUES (%s, %s, %s, %s);
            """, (title, author_id, publication_year, genre))
            conn.commit()  # Confirma a transação
            cur.close()  # Fechar o cursor
            conn.close()  # Fechar a conexão
            return jsonify({'data': 'Livro adicionado com sucesso!', 'status': 201})
        except psycopg2.Error as e:
            print(f"Erro ao adicionar Livro: {e}")
            return jsonify({'data': f"Erro ao adicionar Livro: {str(e)}", 'status': 500})
    else:
        return jsonify({'data': 'Erro ao conectar ao banco de dados', 'status': 500})



def deleteBook(book_id):
    conn = connect_db()
    if conn:
        try:
            cur = conn.cursor()
            cur.execute("DELETE FROM Bibliotecas WHERE book_id = %s;", (book_id,))
            conn.commit()
            print("Livro deletado com sucesso!")
        except psycopg2.Error as e:
            print(f"Erro ao deletar o livro: {e}")
        finally:
            cur.close()
            conn.close()
    else:
        print("Não foi possível conectar ao banco de dados.")


def update_book_in_db(book_id, title=None, author_id=None, publication_year=None, genre=None):
    conn = connect_db()
    if conn:
        try:
            cur = conn.cursor()

            # Adicionando logs para verificar se os dados estão corretos
            print(f"Atualizando livro com ID {book_id}:")
            print(f"Título: {title}, Autor: {author_id}, Ano: {publication_year}, Gênero: {genre}")

            # Query de atualização no PostgreSQL
            cur.execute("""
                UPDATE Bibliotecas 
                SET title = %s, author_id = %s, publication_year = %s, genre = %s
                WHERE book_id = %s;
            """, (title, author_id, publication_year, genre, book_id))

            conn.commit()  # Verifique se o commit está sendo chamado
            print(f"Livro com ID {book_id} atualizado com sucesso.")
            return True
        except psycopg2.Error as e:
            print(f"Erro ao atualizar o livro: {e}")
            return False
        finally:
            cur.close()
            conn.close()
    else:
        print("Erro ao conectar ao banco de dados.")
        return False



def search_book(search_term, search_type):
    conn = connect_db()
    if conn:
        try:
            cur = conn.cursor()
            if search_type == "title" or search_type == "genre":
                query = f"SELECT * FROM Bibliotecas WHERE {search_type} ILIKE %s;"
                cur.execute(query, (f"%{search_term}%",))
            elif search_type == "author_id" or search_type == "publication_year":
                query = f"SELECT * FROM Bibliotecas WHERE {search_type} = %s;"
                cur.execute(query, (search_term,))
            
            books = cur.fetchall()

            if books:
                for book in books:
                    print(f"ID: {book[0]}, Título: {book[1]}, ID do Autor: {book[2]}, Ano de Publicação: {book[3]}, Gênero: {book[4]}")
            else:
                print("Nenhum livro encontrado.")
        except psycopg2.Error as e:
            print(f"Erro ao consultar o livro: {e}")
        finally:
            cur.close()
            conn.close()
    else:
        print("Não foi possível conectar ao banco de dados.")

def rent_book(member_id, book_id, return_date):
    try:
        conn = connect_db()
        cur = conn.cursor()

        # Inserir aluguel no banco de dados
        cur.execute("""
            INSERT INTO rentals (member_id, book_id, rental_date, return_date)
            VALUES (%s, %s, NOW(), %s);
        """, (member_id, book_id, return_date))

        conn.commit()
        cur.close()
        conn.close()

        return {'data': 'Livro alugado com sucesso!', 'status': 200}

    except psycopg2.Error as e:
        print(f"Erro ao alugar livro: {e}")
        return {'data': f"Erro ao alugar livro: {str(e)}", 'status': 500}