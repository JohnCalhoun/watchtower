--Create nessasery tables and users
USE ?;

CREATE TABLE 
    edgelist(
        id      int NOT NULL AUTO_INCREMENT,
        from_id int NOT NULL,
        to_id   int NOT NULL,
        PRIMARY KEY (id)
    );

CREATE TABLE 
    edgeattributes(
        id      int NOT NULL AUTO_INCREMENT,
        edge_id int NOT NULL,
        value   text NOT NULL,
        PRIMARY KEY (id)
    );

CREATE TABLE 
    nodelist(
        id      int NOT NULL AUTO_INCREMENT,
        PRIMARY KEY (id)
    );

CREATE TABLE 
    nodeattributes(
        id      int NOT NULL AUTO_INCREMENT,
        node_id int NOT NULL,
        value   text NOT NULL,
        PRIMARY KEY (id)
    );

--write user
CREATE USER 'write'@'%' IDENTIFIED BY 'write';

GRANT 
    SELECT,
    INSERT,
    DELETE
ON ?.*
TO user 'write';

--read user
CREATE USER 'read'@'%' IDENTIFIED BY 'read';

GRANT 
    SELECT
ON ?.*
TO user 'read'; 
