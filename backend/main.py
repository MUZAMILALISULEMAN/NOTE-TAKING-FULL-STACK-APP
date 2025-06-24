import sqlalchemy.orm as orm
from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy import select,delete,update
import urllib.parse
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
password = "!@#muzzy2006"
encoded = urllib.parse.quote_plus(password)

engine = create_engine(f"mysql+pymysql://root:{encoded}@127.0.0.1:3306/notes_app_db")
Base = orm.declarative_base()   
sessionLocal = orm.sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Notes(Base):
    __tablename__ = "notes"
    notes_id = Column(Integer,nullable=False,primary_key=True,autoincrement=True)
    notes_topic = Column(String(50),nullable=False)
    notes_text = Column(String(200),nullable=False)

Base.metadata.create_all(bind=engine)

def addNote(notes_topic,notes_text):
    db = sessionLocal()
    statement = select(Notes).where(Notes.notes_topic == notes_topic)
    res = db.execute(statement).fetchall()
    if len(res) > 0:
        db.commit()
        db.close()
        return -1
    note = Notes(notes_topic=notes_topic,notes_text=notes_text)
    db.add(note)
    db.commit()
    statement = select(Notes.notes_id).where(Notes.notes_topic == notes_topic)
    res = db.execute(statement).fetchone()
    id = res[0]
    db.close()
    return id
def deleteNote(notes_id):
    db = sessionLocal()
    statement = delete(Notes).where(Notes.notes_id == notes_id)
    db.execute(statement)
    db.commit()
    db.close()
def getAll():
    db = sessionLocal()
    statement = select(Notes.notes_id,Notes.notes_topic)
    res = db.execute(statement).fetchall()
    if(len(res) == 0): 
        db.commit()
        db.close()
        return -1
    payload = []
    for i in res:
        payload.append(list(i))
    db.commit()
    db.close()
    return payload
def getNotes(id):
    db = sessionLocal()
    statement = select(Notes.notes_id,Notes.notes_topic,Notes.notes_text).filter_by(notes_id = id)
    res = db.execute(statement).fetchone()
    print(res)
    db.commit()
    db.close()
    return res

def updateNotes(notes_id,notes_topic,notes_text):
    db = sessionLocal()
    statement = update(Notes).where(Notes.notes_id == notes_id).values(notes_topic=notes_topic,notes_text=notes_text)
    res = db.execute(statement)
    db.commit()
    db.close()
def deleteNotes(id):
    db = sessionLocal()
    statement = delete(Notes).where(Notes.notes_id == id)
    res = db.execute(statement)
    flag = res.rowcount
    db.commit()
    db.close()
    return flag
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Base
class notes(BaseModel):
    notes_topic:str
    notes_text:str


@app.post("/addNote")
def AddNote(data:notes):
    id = addNote(data.notes_topic,data.notes_text)
    if id==-1:
        return {"status":"duplicate"}
    return {"status": "success", "id": id}  

@app.get("/notes/{notes_id}")
def getNote(notes_id:int):
    data = getNotes(notes_id)
    return {"status":"success","result":list(data)}

@app.put("/updateNote/{notes_id}")
def updateNote(notes_id:int,data:notes):
    updateNotes(notes_id,data.notes_topic,data.notes_text)
    return {"status":"success"}

@app.delete("/deleteNote/{notes_id}")
def deleteNote(notes_id:int):
    if deleteNotes(notes_id):
        return {"status":"success"}
    return {"status" : "failed"}

@app.get("/getAllNotes/")
def fetchNotes():
    data = getAll()
    if data:
        return {"status":"success","data":data}
    return {"status" : "failed"}
