import psycopg2
from connection.config import connect_db
from flask import request, jsonify

def get_books():
    conn = connect_db()
    if conn:
        try:
            cur = conn.cursor()
            cur.execute("SELECT * FROM bibliotecas")
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



def delete_book(book_id):
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


def update_book(book_id, title=None, author_id=None, publication_year=None, genre=None):
    conn = connect_db()
    if conn:
        try:
            cur = conn.cursor()
            fields = []
            values = []
            
            if title:
                fields.append("title = %s")
                values.append(title)
            if book_id:
                fields.append("book_id = %s")
                values.append(book_id)
            if author_id:
                fields.append("author_id = %s")
                values.append(author_id)
            if publication_year:
                fields.append("publication_year = %s")
                values.append(publication_year)
            if genre:
                fields.append("genre = %s")
                values.append(genre)
            
            values.append(book_id)
            query = f"UPDATE Bibliotecas SET {', '.join(fields)} WHERE book_id = %s;"
            cur.execute(query, values)
            conn.commit()
            print("Informações do livro atualizadas com sucesso!")
        except psycopg2.Error as e:
            print(f"Erro ao atualizar o livro: {e}")
        finally:
            cur.close()
            conn.close()
    else:
        print("Não foi possível conectar ao banco de dados.")


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