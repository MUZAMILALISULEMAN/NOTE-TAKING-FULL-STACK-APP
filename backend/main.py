import sqlalchemy.orm as orm
from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy import select,delete
import urllib.parse
password = "!@#muzzy2006"
encoded = urllib.parse.quote_plus(password)

engine = create_engine(f"mysql+pymysql://root:{encoded}@127.0.0.1:3306/tulips_waterplant")
Base = orm.declarative_base()   
sessionLocal = orm.sessionmaker(autocommit=False, autoflush=False, bind=engine)

class User(Base):

    __tablename__ = "Users"
    User_ID = Column(Integer, primary_key=True, autoincrement=True)
    name= Column(String(100),nullable=False)
    age = Column(Integer,nullable=False)
class Sales(Base):
    __tablename__ = "Sales"
    Sales_ID = Column(Integer, primary_key=True, autoincrement=True)
    litres= Column(Integer,nullable=False)
    quantity = Column(Integer,nullable=False)

Base.metadata.create_all(bind=engine)

def add_user(name,age):
    db = sessionLocal()
    db.add(User(name=name,age=age))
    db.commit()
    db.close()
def printAll():
    db = sessionLocal()
    st = select(User.name,User.age,User.User_ID)
    data = db.execute(st).fetchall()
    for i in data:
        print(i)
    db.close()
def delete_user(id):
    db = sessionLocal()
    st = delete(User).filter_by(id=id)
    db.execute(st)   
    db.commit()
    db.close()

add_user("MUZAMIL BROTHER",50)
printAll()
delete_user(2)
printAll()