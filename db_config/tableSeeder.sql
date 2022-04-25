--users TABLE
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    cellno VARCHAR(10) UNIQUE NOT NULL,
    usertype VARCHAR(10) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    status boolean NOT NULL,
    password VARCHAR(255) NOT NULL
);

--RATING TABLE
DROP TABLE IF EXISTS rating CASCADE;
CREATE TABLE rating(
    id SERIAL PRIMARY KEY,
    teacher_id INT NOT NULL,
    rating INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY(teacher_id) REFERENCES users (id)
);

--QUALIFICATION TABLE
DROP TABLE IF EXISTS qualification CASCADE;
CREATE TABLE qualification(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    qualification varchar(300) NOT NULL,
    teacher_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY(teacher_id) REFERENCES users (id)
);

--AVAILABILITY TABLE
DROP TABLE IF EXISTS avaibility CASCADE;
CREATE TABLE avaibility(
    id SERIAL PRIMARY KEY,
    avaibility_time VARCHAR(255) NOT NULL,
    teacher_id INT NOT NULL,
    avaibility_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY(teacher_id) REFERENCES users (id)
);

--SUBJECT TABLE
DROP TABLE IF EXISTS subject CASCADE;
CREATE TABLE subject(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

--BOOKING TABLE
DROP TABLE IF EXISTS booking CASCADE;
CREATE TABLE booking(
    id SERIAL PRIMARY KEY,
    topic VARCHAR(255) NOT NULL,
    duration INTEGER NOT NULL,
    date varchar(255) NOT NULL,
    time varchar(255) NOT NULL,
    teacher_id INT NOT NULL,
    learner_id INT NOT NULL,
    status VARCHAR(30) NOT NULL,
    subject_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY(teacher_id) REFERENCES users (id),
    FOREIGN KEY(learner_id) REFERENCES users (id),
    FOREIGN KEY(subject_id) REFERENCES subject (id)
);

--ASSIGNED SUBJECT TABLE
DROP TABLE IF EXISTS assigned_subject CASCADE;
CREATE TABLE assigned_subject(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    subject_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY(user_id) REFERENCES users (id),
    FOREIGN KEY(subject_id) REFERENCES subject (id)
);

--DMs TABLE
DROP TABLE IF EXISTS dms CASCADE;
CREATE TABLE dms(
    id SERIAL PRIMARY KEY,
    sender_id INT NOT NULL,
    reciever_id INT NOT NULL,
    subject_id INT NOT NULL,
    message varchar(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY(reciever_id) REFERENCES users (id),
    FOREIGN KEY(sender_id) REFERENCES users (id),
    FOREIGN KEY(subject_id) REFERENCES subject (id)
);

--REPLIES TABLE
DROP TABLE IF EXISTS replies CASCADE;
CREATE TABLE replies(
    id SERIAL PRIMARY KEY,
    sender_id INT NOT NULL,
    replies varchar(255) NOT NULL,
    post_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY(post_id) REFERENCES posts (id),
    FOREIGN KEY(sender_id) REFERENCES users (id)
);

--Topic TABLE
DROP TABLE IF EXISTS topic CASCADE;
CREATE TABLE topic(
    id SERIAL PRIMARY KEY,
    sender_id INT NOT NULL,
    subject_id INT NOT NULL,
    topic varchar(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY(sender_id) REFERENCES users (id),
    FOREIGN KEY(subject_id) REFERENCES subject (id)
);

--POST TABLE
DROP TABLE IF EXISTS posts CASCADE;
CREATE TABLE posts(
    id SERIAL PRIMARY KEY,
    sender_id INT NOT NULL,
    topic_id INT NOT NULL,
    post varchar(500) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY(sender_id) REFERENCES users (id),
    FOREIGN KEY(topic_id) REFERENCES topic (id)
);

--ROOM TABLE
DROP TABLE IF EXISTS chat_room CASCADE;
CREATE TABLE chat_room(
    id SERIAL PRIMARY KEY,
    learner_id INT NOT NULL,
    teacher_id INT NOT NULL,
    room varchar(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY(learner_id) REFERENCES users (id),
    FOREIGN KEY(teacher_id) REFERENCES users (id)
);



INSERT INTO chat_room (learner_id, teacher_id, room)
VALUES ($1, $2, $3) 

-- SELECT max(id), learner_id, teacher_id, room FROM chat_room WHERE _id = $1

--DUMMY INFO
 Create extension pgcrypto;
INSERT INTO users(full_name, email, cellno, usertype, status, password)
VALUES
('shiba', 'shiba@email.com', '0795813118', 'learner', true, crypt('shiba123',gen_salt('bf'))),
('forgiveness', 'forgiveness@email.com', '0712345618', 'learner', true, crypt('forgiveness123',gen_salt('bf'))),
('faranani', 'faranani@email.com', '0712345617', 'learner', true, crypt('faranani123',gen_salt('bf'))),
('fortunate', 'fortunate@email.com', '0712345616', 'learner', true, crypt('fortunate123',gen_salt('bf'))),
('phillip', 'phillip@email.com', '0712345615', 'learner', true, crypt('phillip123',gen_salt('bf')));

INSERT INTO users(full_name, email, cellno, usertype, status, password)
VALUES
('shibaT', 'shibaT@email.com', '0795813108', 'teacher', false, crypt('shiba123',gen_salt('bf'))),
('forgivenessT', 'forgivenessT@email.com', '0712345678', 'teacher', false, crypt('forgiveness123',gen_salt('bf'))),
('farananiT', 'farananiT@email.com', '0712345677', 'teacher', false, crypt('faranani123',gen_salt('bf'))),
('fortunateT', 'fortunateT@email.com', '0712345676', 'teacher', false, crypt('fortunate123',gen_salt('bf'))),
('phillipT', 'phillipT@email.com', '0712345675', 'teacher', false, crypt('phillip123',gen_salt('bf')));

INSERT INTO chat_room (learner_id, teacher_id, room)
VALUES
(1, 6, 'room-1'),
(2, 7, 'room-2'),
(3, 8, 'room-3'),
(4, 9, 'room-4'),
(5, 10, 'room-5');
 
   
--True = 1; False = 0

SELECT subject.name, subject.description, assigned_subject.subject_id, assigned_subject.user_id
FROM subject
INNER JOIN assigned_subject
ON subject.id = assigned_subject.subject_id
WHERE assigned_subject.user_id = $1;
