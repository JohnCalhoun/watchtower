#! /bin/env python
import unittest
import MySQLdb as mysql

def get_script(file_name):
    with open(file_name,'r') as f:
        script=f.read()
    script=script.replace(':database','test')
    
    return(script)

def run_script(script,cursor):
    for command in script.split(';'):
        command=command.rstrip('\n')
        if command != '':
            cursor.execute(command)

class TestSQLCreateScripts(unittest.TestCase):
    def setUp(self):
        self.server=mysql.connect(
            host='127.0.0.1', 
            port=PORT, 
            user='root', 
            passwd=PASSWORD
        )
        self.cursor=self.server.cursor()
        self.cursor.execute('CREATE DATABASE IF NOT EXISTS test;')

    def tearDown(self):
        self.cursor.execute('DROP DATABASE test;')
        self.cursor.close()

    def test_create(self):
        script=get_script('./init-create.sql')
        run_script(script,self.cursor)

        self.cursor.execute("SHOW tables;")
        tables=[x[0] for x in self.cursor.fetchall()] 
        self.assertTrue('edgelist' in tables)
        self.assertTrue('edgeattributes' in tables)
        self.assertTrue('nodelist' in tables)
        self.assertTrue('nodeattributes' in tables)

        self.cursor.execute("SELECT User FROM mysql.user;")
        users=[x[0] for x in self.cursor.fetchall()] 
        self.assertTrue('read' in users)
        self.assertTrue('write' in users)

    def test_destroy(self):
        script=get_script('./init-create.sql')
        run_script(script,self.cursor)

        script=get_script('./init-destroy.sql')
        run_script(script,self.cursor)

        self.cursor.execute("SHOW tables;")
        tables=[x[0] for x in self.cursor.fetchall()] 
        self.assertFalse('edgelist' in tables)
        self.assertFalse('edgeattributes' in tables)
        self.assertFalse('nodelist' in tables)
        self.assertFalse('nodeattributes' in tables)

        self.cursor.execute("SELECT User FROM mysql.user;")
        users=[x[0] for x in self.cursor.fetchall()] 
        self.assertFalse('read' in users)
        self.assertFalse('write' in users)

class TestSQLReadWriteScripts(unittest.TestCase):
    def setUp(self):
        self.server=mysql.connect(
            host='127.0.0.1', 
            port=PORT, 
            user='root', 
            passwd=PASSWORD
        )
        self.cursor=self.server.cursor()
        self.cursor.execute('CREATE DATABASE IF NOT EXISTS test;')
        script=get_script('./init-create.sql')
        run_script(script,self.cursor)


    def tearDown(self):
        script=get_script('./init-destroy.sql')
        run_script(script,self.cursor)

        self.cursor.execute('DROP DATABASE test;')
        self.cursor.close()

    def test_getDocument(self):
        script=get_script('./read-getDocument.sql')
        run_script(script,self.cursor)
        pass
    
    def test_addDocument(self):
        script=get_script('./write-addDocument.sql')
        run_script(script,self.cursor)
        pass



if __name__ == '__main__':
    import os

    PORT=int(os.environ['MYSQL_PORT'])
    PASSWORD=os.environ['MYSQL_PASSWORD']
    
    unittest.main()
