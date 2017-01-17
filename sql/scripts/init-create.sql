USE :database;

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


CREATE USER IF NOT EXISTS 'write'@'%' IDENTIFIED BY 'write';

GRANT 
    SELECT,
    INSERT,
    DELETE
ON :database.*
TO 'write';

CREATE USER IF NOT EXISTS 'read'@'%' IDENTIFIED BY 'read';

GRANT 
    SELECT
ON :database.*
TO 'read';
