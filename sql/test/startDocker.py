#! /bin/env python
from subprocess import call
from subprocess import check_output

if __name__ == '__main__':
    PORT=3306

    dockerStart="docker run --name MYSQLTEST -p {0}:3306 -e MYSQL_ROOT_PASSWORD=password -d mysql:8.0".format(PORT)
    call(dockerStart,shell=True)

