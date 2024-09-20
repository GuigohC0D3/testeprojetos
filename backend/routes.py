from flask import Blueprint, jsonify, request, session, render_template, url_for, redirect
from flask_cors import cross_origin, CORS
from jinja2 import Template
from math import ceil
from datetime import datetime
from .entities import members
from .entities import historicos
from .entities import books
from .entities import employee
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
def create_rental():
    try:
        data = request.json
        member_id = data.get('member_id')
        book_id = data.get('book_id')
        rental_date = data.get('rental_date')
        return_date = data.get('return_date')

        # Verificação dos campos obrigatórios
        if not member_id or not book_id or not rental_date:
            return jsonify({"data": "Campos obrigatórios ausentes: member_id, book_id ou rental_date", 'status': 400}), 400

        # Se a data de devolução for None, o status de disponibilidade deve ser 'Alugado'
        if not return_date:
            disponibilidade = 'Alugado'
        else:
            disponibilidade = 'Disponível'

        # Função para realizar o aluguel no banco de dados
        result = books.rent_book(member_id, book_id, rental_date, return_date)

        if result:
            return jsonify({'data': 'Aluguel realizado com sucesso!', 'status': 200}), 200
        else:
            return jsonify({'data': 'Erro ao realizar aluguel', 'status': 500}), 500

    except Exception as e:
        print(f"Erro ao criar aluguel: {str(e)}")
        return jsonify({'data': f'Erro ao criar aluguel: {str(e)}', 'status': 500}), 500

@main_bp.route('/return_rental/<int:rental_id>', methods=['PUT'])
@cross_origin()
def return_rental(rental_id):
    try:
        # Chama a função de devolução no `books.py`
        result = books.return_book(rental_id)

        if result['status'] == 200:
            return jsonify({'data': 'Livro devolvido com sucesso!', 'status': 200}), 200
        else:
            return jsonify({'data': 'Erro ao devolver o livro', 'status': 500}), 500

    except Exception as e:
        print(f"Erro ao devolver o aluguel: {str(e)}")
        return jsonify({'data': f'Erro ao devolver aluguel: {str(e)}', 'status': 500}), 500


@main_bp.route('/check_availability/<int:book_id>', methods=['GET'])
@cross_origin
def check_availability(book_id):
    # Função que verifica se a data de devolução já passou
    rent_info = books.rent_book(book_id)  # Suponha que isso retorne as informações do aluguel do livro
    if not rent_info:
        return jsonify({"error": "Livro não encontrado."}), 404

    return_date = rent_info.get('return_date')
    availability = rent_info.get('availability')

    # Verificar se o livro está alugado e se a data de devolução passou
    if return_date and availability == 'Alugado':
        current_date = datetime.now().date()
        return_date_obj = datetime.strptime(return_date, '%Y-%m-%d').date()

        if current_date > return_date_obj:
            # Atualize o status de disponibilidade
            books.rent_book(book_id, 'Disponível')
            return jsonify({
                'book_id': book_id,
                'availability': 'Disponível',
                'message': 'O livro está disponível, data de devolução já passou.'
            })

    return jsonify({
        'book_id': book_id,
        'availability': availability
    })

@main_bp.route('/return_book/<int:book_id>', methods=['PUT'])
@cross_origin()
def return_book(book_id):
    try:
        result = books.return_book(book_id)
        
        if result['status'] == 200:
            return jsonify({'message': 'Livro devolvido com sucesso!'}), 200
        else:
            return jsonify({'error': 'Erro ao devolver o livro.'}), 500

    except Exception as e:
        print(f"Erro ao devolver o livro: {str(e)}")
        return jsonify({'data': f'Erro ao devolver o livro: {str(e)}', 'status': 500}), 500


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



@main_bp.route('/historico', methods=['GET'])
@cross_origin()
def historico_route():
    try:
        # Obtendo o histórico a partir da função no arquivo `historicos.py`
        historico = historicos.get_historico()
        return jsonify(historico), 200

    except Exception as e:
        print(f"Erro ao buscar histórico: {str(e)}")
        return jsonify({'data': f'Erro ao buscar histórico: {str(e)}', 'status': 500}), 500

@main_bp.route('/home')
@cross_origin()
def home():
    if 'username' in session:
        username = session['username']  # O usuário está logado
        return render_template('home.html', logged_in=True, username=username)
    else:
        return render_template('home.html', logged_in=False)



@main_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        # Função que verifica as credenciais (você precisa criar isso no arquivo `members.py`)
        user = members.check_credentials(username, password)
        
        if user:
            # Se as credenciais forem corretas, armazena os dados do usuário na sessão
            session['user_id'] = user['id']
            session['username'] = user['username']
            return redirect(url_for('perfil.html'))  # Redireciona para a página de perfil após o login
        else:
            return render_template('login.html', error="Usuário ou senha incorretos.")
    return render_template('login.html')  # Renderiza o template de login

@main_bp.route('/profile')
def profile():
    if 'user_id' not in session:  # Verifica se o usuário está logado
        return redirect(url_for('main.login'))  # Redireciona para login se não estiver logado
    
    # Você pode buscar mais informações sobre o usuário com base no user_id
    user_info = members.get_user_by_id(session['user_id'])
    
    return render_template('perfil.html', user=user_info)
