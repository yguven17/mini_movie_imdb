import mysql.connector
import csv

try:
    db_connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="password",
        port="3306",
        auth_plugin='mysql_native_password'
    )
    print("Connection established")

except mysql.connector.Error as error:
    print(f"Failed to connect to MySQL: {error}")

# creating database_cursor to perform SQL operation to run queries
db_cursor = db_connection.cursor(buffered=True)

# deleting the database if it already exists
db_cursor.execute("SHOW DATABASES")
databases = db_cursor.fetchall()  # Fetch all rows from the cursor
database_names = [db[0] for db in databases]

if 'mini_movie_imdb' in database_names:
    db_cursor.execute("DROP DATABASE mini_movie_imdb")

# creating the database
db_cursor.execute("CREATE DATABASE mini_movie_imdb")

db_cursor.execute("USE mini_movie_imdb")


def populate_table(db_connection, db_cursor, insert_query, file_path, no_attr):
    with open(file_path, mode='r') as csv_data:
        reader = csv.reader(csv_data, delimiter=';')
        csv_data_list = list(reader)

        i = 1
        for row in csv_data_list[1:]:
            row = tuple(map(lambda x: None if x == "" else x, row[0].split(',')))

            if no_attr == len(row):
                db_cursor.execute(insert_query, row)
            i += 1
    print('Creating table finished for ' + file_path)
    db_connection.commit()


tno = 1

# create DIRECTOR table
db_cursor.execute("""CREATE TABLE DIRECTOR (director_id VARCHAR(50) NOT NULL, 
                                          name VARCHAR(100) NOT NULL, 
                                          birth_date INT, 
                                          death_date INT,
                                          PRIMARY KEY(director_id))""")

insert_director = (
    "INSERT INTO DIRECTOR(director_id, name, birth_date, death_date) "
    "VALUES (%s, %s, %s, %s)"
)

populate_table(db_connection, db_cursor, insert_director, "director.csv", 4)
tno += 1

# create MOVIE table
db_cursor.execute("""CREATE TABLE MOVIE (film_id VARCHAR(50) NOT NULL, 
                                          rating FLOAT NOT NULL, 
                                          num_of_votes INT,
                                          release_date INT, 
                                          duration INT, 
                                          name VARCHAR(100) NOT NULL,
                                          director_id VARCHAR(50) NOT NULL,
                                          PRIMARY KEY(film_id))""")

insert_movie = (
    "INSERT INTO MOVIE(film_id, rating, num_of_votes, release_date, duration,name,director_id) "
    "VALUES (%s, %s, %s, %s, %s, %s,%s)"
)

populate_table(db_connection, db_cursor, insert_movie, "movie.csv", 7)
tno += 1

# create Actor table
db_cursor.execute("""CREATE TABLE ACTOR (actor_id VARCHAR(50) NOT NULL, 
                                          name VARCHAR(100) NOT NULL, 
                                          birth_date INT, 
                                          death_date INT,
                                          PRIMARY KEY(actor_id))""")

insert_actor = (
    "INSERT INTO ACTOR(actor_id, name, birth_date, death_date) "
    "VALUES (%s, %s, %s, %s)"
)

populate_table(db_connection, db_cursor, insert_actor, "actors.csv", 4)
tno += 1

# create plays_in_movies table
db_cursor.execute("""CREATE TABLE PLAYS_IN_MOVIES (actor_id VARCHAR(50) NOT NULL, 
                                          film_id VARCHAR(50) NOT NULL, 
                                          PRIMARY KEY(actor_id, film_id))""")

insert_plays_in_movies = (
    "INSERT INTO PLAYS_IN_MOVIES(film_id, actor_id)"
    "VALUES (%s, %s)"
)

populate_table(db_connection, db_cursor, insert_plays_in_movies, "plays_in_movies.csv", 2)
tno += 1

# create genre_movies table
db_cursor.execute("""CREATE TABLE GENRE_MOVIES (genre VARCHAR(50) NOT NULL, 
                                          film_id VARCHAR(50) NOT NULL, 
                                          PRIMARY KEY(genre, film_id))""")

insert_genre_movies = (
    "INSERT INTO GENRE_MOVIES(film_id, genre)"
    "VALUES (%s, %s)"
)

populate_table(db_connection, db_cursor, insert_genre_movies, "genre_movies.csv", 2)
tno += 1

print('Successfully created all necessary tables')
