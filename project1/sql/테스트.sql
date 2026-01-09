SELECT *
FROM tab;

CREATE TABLE usertable (
  user_no NUMBER PRIMARY KEY,
  user_id VARCHAR2(20) NOT NULL,
  user_pw VARCHAR2(20) NOT NULL,
  user_name VARCHAR2(50) NOT NULL,
  user_tel NUMBER(11)
);

SELECT *
FROM usertable
ORDER BY 1;

desc usertable;

DELETE FROM usertable;

DROP SEQUENCE user_seq;
CREATE SEQUENCE user_seq;

--INSERT INTO usertable (user_no, user_id, user_pw, user_name, user_tel)
--VALUES (1, 'test1', 'testPw', 'testName', '000-1111-2222');

ALTER TABLE usertable MODIFY user_tel varchar2(15);

CREATE TABLE board_list(
  list_no NUMBER PRIMARY KEY,
  list_title VARCHAR2(45) NOT NULL,
  list_content VARCHAR2(50),
  list_date DATE DEFAULT sysdate
);

ALTER TABLE board_list MODIFY list_content VARCHAR2(1000) NOT NULL;

SELECT *
FROM board_list;
DESC board_list;

DELETE FROM board_list;

DROP SEQUENCE board_seq;
CREATE SEQUENCE board_seq;

INSERT INTO board_list (list_no, list_title, list_content, writer)
VALUES (board_seq.nextval, '11111', '22222222222', '');

ALTER TABLE board_list modify writer varchar2(30) DEFAULT ON NULL '익명';
