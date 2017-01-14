#! /bin/env python
import unittest
from subprocess import call
from subprocess import check_output
from subprocess import check_call
from random import randint
import socket
import MySQLdb as mysql

def get_script(file_name):
    with open(file_name,'r') as f:
        script=f.read()
    script=script.replace(':database','test')
    
    return(script)

class TestSQLScripts(unittest.TestCase):
    @classmethod 
    def setUpClass(self):
        try:
            check_call('docker ps | grep MYSQLTEST > /dev/null',shell=True)
        except:
            print('startingDocker')
            call(dockerStart,shell=True)
        else:
            print('UsingExistingDocker')
            self.start=False
    
    @classmethod 
    def tearDownClass(self):
        if(self.start):
            print('StopingDocker')
            call(dockerStop,shell=True)

    def setUp(self):
        self.server=mysql.connect(
            host='127.0.0.1', 
            port=3306, 
            user='root', 
            passwd='password'
        )
        self.cursor=self.server.cursor()
        self.cursor.execute('CREATE DATABASE IF NOT EXISTS test;')

    def tearDown(self):
        self.cursor.execute('DROP DATABASE test;')
        self.cursor.close()

    def test_destory(self):
        script=get_script('../test.sql')
        
        self.cursor.execute(script)
        print(self.cursor.fetchall())
        self.cursor.execute("SHOW databases")
        print( [x[0] for x in self.cursor.fetchall()] )
         
        pass


if __name__ == '__main__':
    PORT=3306
    print("Got port:"+str(PORT))

    dockerStart="docker run --name MYSQLTEST -p {0}:3306 -e MYSQL_ROOT_PASSWORD=password -d mysql:8.0;sleep 20".format(PORT)
    dockerStop="docker kill MYSQLTEST; docker rm MYSQLTEST"

    print('Start CMD:')
    print(dockerStart)
    print('Stop CMD:')
    print(dockerStop)

    unittest.main()
