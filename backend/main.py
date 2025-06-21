import sqlalchemy.orm as orm
import sqlalchemy as sa
from sqlalchemy import Column, Integer, String

engine = sa.create_engine("sqlite:///mydb.db")
Base = orm.declarative_base()   
sessionLocal = orm.sessionmaker(autocommit=False, autoflush=False, bind=engine)
class User(Base):
    __tablename__ = "User"
    name= Column(String,nullable=False)
    age = Column(Integer,nullable=False)

Base.metadata.create_all(bind=engine)




