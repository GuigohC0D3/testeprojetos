from flask import Blueprint, jsonify, request
from flask_cors import cross_origin, CORS
import entities.members as members
import entities.books as books
import entities.historicos as historicos
from math import ceil
import entities.employee as employee
main_bp = Blueprint('main', __name__)

CORS(main_bp, methods=['GET', 'POST', 'DELETE', 'PUT'])

@main_bp.route('/members')
@cross_origin()
def get_members():
    return members.get_members() 

@main_bp.route('/members', methods=['POST'])
def addMember():
    data = request.json
    if 'name' not in data:
        return jsonify({'data': 'Precisa de um nome', 'status': 500})
    if 'email' not in data:
        return jsonify({'data': 'Precisa de um email', 'status': 500})
    if 'username' not in data:
        return jsonify({'data': 'Precisa de um username', 'status': 500})
    if 'password' not in data:
        return jsonify({'data': 'Precisa de uma senha', 'status': 500})
    if 'phonenumber' not in data:
        return jsonify({'data': 'Precisa de um número de telefone', 'status': 500})
    if 'name' not in data or 'email' not in data or 'username' not in data or 'password' not in data or 'phonenumber' not in data:
        return jsonify({'error': 'Todos os campos são obrigatórios'}), 400
    return members.addMember(data['name'], data['email'], data['username'], data['password'], data['phonenumber'])

@main_bp.route('/members', methods=['DELETE'])
@cross_origin()
def deleteMember():
    try:
        data = request.json
        if 'id' not in data:
            return jsonify({'data': 'Precisa de um ID', 'status': 400})  # Status 400 para requisição inválida
        
        # Supondo que você tenha uma função members.deleteMember que deleta pelo ID
        result = members.deleteMember(data['id'])
        
        if result:  # Se o membro foi deletado com sucesso
            return jsonify({'data': 'Membro deletado com sucesso', 'status': 200})
        else:  # Se o ID não foi encontrado
            return jsonify({'data': 'Membro não encontrado', 'status': 404})

    except Exception as e:
        return jsonify({'data': f'Erro ao deletar membro: {str(e)}', 'status': 500})
    

@main_bp.route('/members', methods=['PUT'])
def updateMember():
    try:
        data = request.json
        print(data)  # Debug para verificar o que está sendo enviado

        if 'id' not in data:
            return jsonify({'data': 'Precisa de um id', 'status': 500})
        if 'name' not in data:
            return jsonify({'data': 'Precisa de um nome', 'status': 500})
        if 'email' not in data:
            return jsonify({'data': 'Precisa de um email', 'status': 500})
        if 'username' not in data:
            return jsonify({'data': 'Precisa de um username', 'status': 500})
        if 'password' not in data:
            return jsonify({'data': 'Precisa de uma senha', 'status': 500})
        if 'phonenumber' not in data:
            return jsonify({'data': 'Precisa de um número de telefone', 'status': 500})

        result = members.updateMember(data['id'], data['name'], data['email'], data['username'], data['password'], data['phonenumber'])

        if result:
            return jsonify({'message': 'Membro atualizado com sucesso!'}), 200
        else:
            return jsonify({'error': 'Erro ao atualizar membro'}), 500
    except Exception as e:
        return jsonify({'data': f'Erro ao atualizar membro: {str(e)}', 'status': 500})


 
        
@main_bp.route('/')
@cross_origin()
def index():
    return jsonify({'data': 'Hello Guilherme! Bem-Vindo ao seu Banco de Dados'})

@main_bp.route('/books')
@cross_origin()
def get_books():
    return books.get_books()

@main_bp.route('/books', methods=['POST'])
def addBook():
    data = request.json
    if 'title' not in data:
        return jsonify({'data': 'Precisa de um título', 'status': 500})
    if 'author_id' not in data:
        return jsonify({'data': 'Precisa de um ano de publicação', 'status': 500})
    if 'publication_year' not in data:
        return jsonify({'data': 'Precisa de um ID do autor', 'status': 500})
    if 'genre' not in data:
        return jsonify({'data': 'Precisa de um gênero', 'status': 500})
    
    return books.addBook(data['title'], data['author_id'], data['publication_year'], data['genre'])

# Excluir livro
@main_bp.route('/books', methods=['DELETE'])
@cross_origin()
def deleteBook():
    try:
        data = request.json
        if 'book_id' not in data:
            return jsonify({'data': 'Precisa de um ID do livro', 'status': 500})
        
        result = books.deleteBook(data['book_id'])  # Supondo que a função deleteBook delete pelo ID
        if result:
            return jsonify({'data': 'Livro deletado com sucesso', 'status': 200})
        else:
            return jsonify({'data': 'Livro não encontrado', 'status': 404})
    except Exception as e:
        return jsonify({'data': f'Erro ao deletar livro: {str(e)}', 'status': 500})

# Atualizar livro
@main_bp.route('/books', methods=['PUT'])
def updateBook():
    try:
        data = request.json
        print(f"Dados recebidos para atualização: {data}")

        if 'book_id' not in data:
            return jsonify({'data': 'Precisa de um ID do livro', 'status': 500})
        if 'title' not in data:
            return jsonify({'data': 'Precisa de um título', 'status': 500})
        if 'author_id' not in data:
            return jsonify({'data': 'Precisa de um ID do autor', 'status': 500})
        if 'publication_year' not in data:
            return jsonify({'data': 'Precisa do ano de publicação', 'status': 500})
        if 'genre' not in data:
            return jsonify({'data': 'Precisa de um gênero', 'status': 500})

        # Atualize o livro no banco de dados
        result = books.update_book_in_db(data['book_id'],data['title'],data['author_id'],data['publication_year'],data['genre'])

        if result:  # Se o livro foi atualizado com sucesso
            return jsonify({'message': 'Livro atualizado com sucesso!'}), 200
        else:
            return jsonify({'error': 'Erro ao atualizar livro no banco de dados'}), 500

    except Exception as e:
        print(f"Erro no servidor ao atualizar o livro: {str(e)}")
        return jsonify({'data': f'Erro ao atualizar livro: {str(e)}', 'status': 500})
    

@main_bp.route('/alugueis', methods=['POST'])
@cross_origin()
def createRent():
    try:
        data = request.json
        print(f"Dados recebidos no POST /alugueis: {data}")  # Log dos dados recebidos

        # Verificação dos campos obrigatórios
        if not all(key in data for key in ('member_id', 'book_id', 'rental_date', 'return_date')):
            return jsonify({'data': 'Faltam campos obrigatórios.', 'status': 400})

        # Chamar a função de aluguel no books.py
        result = books.rent_book(data['member_id'], data['book_id'], data['rental_date'], data['return_date'])
        print(f"Resultado da função rent_book: {result}")  # Log do resultado do aluguel

        return jsonify(result), result['status']

    except Exception as e:
        print(f"Erro ao alugar livro: {str(e)}")
        return jsonify({'data': f'Erro ao alugar livro: {str(e)}', 'status': 500}), 500


# Rota para listar ou buscar aluguéis (GET)
@main_bp.route('/alugueis', methods=['GET'])
@cross_origin()
def getRents():
    try:
        return jsonify({'data': 'Aqui estarão os aluguéis listados.', 'status': 200})

    except Exception as e:
        print(f"Erro ao buscar aluguéis: {str(e)}")
        return jsonify({'data': f'Erro ao buscar aluguéis: {str(e)}', 'status': 500}), 500
    
   
@main_bp.route('/employee')
@cross_origin()
def get_employee():
    return employee.get_employee()

#Devolução de Livros
@main_bp.route('/return_book/<int:rental_id>', methods=['PUT'])
@cross_origin()
def return_book_route(rental_id):
    return books.return_book(rental_id)

@main_bp.route('/historicos', methods=['GET'])
def historicos():
    try:
        return get_historico()
    except Exception as e:
        print(f"Erro ao buscar histórico: {str(e)}")
        return jsonify({'data': f'Erro ao buscar histórico: {str(e)}', 'status': 500}), 500