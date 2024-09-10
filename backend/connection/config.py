import psycopg2

def connect_db():
    DB_NAME = "cursonline"
    DB_USER = "postgres"
    DB_PASS = "Admin"
    DB_HOST = "127.0.0.1"
    DB_PORT = "5433"

    try:
        conn = psycopg2.connect(
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS,
            host=DB_HOST,
            port=DB_PORT
        )
        return conn
    except psycopg2.Error as e:
        print(f"Erro ao conectar ao banco de dados: {e}")
        return None