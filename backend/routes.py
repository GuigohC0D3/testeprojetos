from flask import Blueprint, jsonify, request
from flask_cors import cross_origin, CORS
import entities.members as members
import entities.books as books
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
    return members.addMember(data['name'], data['email'])

@main_bp.route('/members', methods=['DELETE'])
@cross_origin()
def deleteMember():
    try:
        data = request.json
        if 'id' not in data:
            return jsonify({'data': 'Precisa de um id', 'status': 500})
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
        print(data)
        if 'id' not in data:
            return jsonify({'data': 'Precisa de um id', 'status': 500})
        if 'name' not in data:
            return jsonify({'data': 'Precisa de um nome', 'status': 500})
        if 'email' not in data:
            return jsonify({'data': 'Precisa de um email', 'status': 500})
        result = members.updateMember(data['id'],data['name'],data['email'])
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

    
@main_bp.route('/books', methods=['DELETE'])
@cross_origin()
def deleteBook():
    try:
        data = request.json
        if 'id' not in data:
            return jsonify({'data': 'Precisa de um id', 'status': 500})
        # Supondo que você tenha uma função books.deleteBook que deleta pelo ID
        result = books.deleteBook(data['id'])
        if result:  # Se o livro foi deletado com sucesso
            return jsonify({'data': 'Livro deletado com sucesso', 'status': 200})
        else:  # Se o ID não foi encontrado
            return jsonify({'data': 'Livro não encontrado', 'status': 404})
    except Exception as e:
        return jsonify({'data': f'Erro ao deletar livro: {str(e)}', 'status': 500})


@main_bp.route('/books', methods=['PUT'])
def updateBook():
    try:
        data = request.json
        if 'id' not in data:
            return jsonify({'data': 'Precisa de um id', 'status': 500})
        if 'title' not in data:
            return jsonify({'data': 'Precisa de um título', 'status': 500})
        if 'author' not in data:
            return jsonify({'data': 'Precisa de um autor', 'status': 500})
        result = books.updateBook(data['id'], data['title'], data['author'])
        if result:
            return jsonify({'message': 'Livro atualizado com sucesso!'}), 200
        else:
            return jsonify({'error': 'Erro ao atualizar livro'}), 500
    except Exception as e:
        return jsonify({'data': f'Erro ao atualizar livro: {str(e)}', 'status': 500})


@main_bp.route('/employee')
@cross_origin()
def get_employee():
    return employee.get_employee()

