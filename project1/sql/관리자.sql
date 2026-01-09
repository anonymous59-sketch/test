select * from all_users;

-- 공통사용자 또는 롤 이름이 부적합한 것을 풀기 위한 세션 설정
alter session set "_oracle_script"=true; -- 이걸 실행하고 아래 것을 실행하면 됨

-- scott 사용자 / tiger(비밀번호) / 일반사용자 권한
 create user scott
 identified by tiger
 default tablespace users
 temporary tablespace temp;
 
 grant connect, resource, unlimited tablespace
 to scott; -- scott 계정에 사용자 만드는 것에 대한 권한 부여
 
 create user hr
 identified by hr
 default tablespace users
 temporary tablespace temp;
 
 grant connect, resource, unlimited tablespace to hr;
 
 grant create view to hr;
 -- view 생성 권한
 grant create view to scott;
 
 create user testUser
 identified by test
 default tablespace users
 temporary tablespace temp;
 
 grant connect, resource, unlimited tablespace to testUser;
 grant create view to testUser;