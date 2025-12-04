# ----------------------------------------------------------------------
# Telling pymysql to Pretend to be the mysqlclient (formerly MySQLdb)
# ----------------------------------------------------------------------
import pymysql
pymysql.install_as_MySQLdb()

# ------------------------------------------------
# This patches the version check to fool Django
# ------------------------------------------------
import MySQLdb       # type: ignore

if MySQLdb.version_info < (2, 2, 2):
    MySQLdb.version_info = (2, 2, 2, "final", 0)
    MySQLdb.__version__ = "2.2.2"