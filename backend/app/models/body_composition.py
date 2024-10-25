from sqlalchemy import Column, Integer, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class BodyComposition(Base):
    __tablename__ = "body_compositions"

    date = Column(Date, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    fat = Column(Float, nullable=False)
    muscle = Column(Float, nullable=False)
    water = Column(Float, nullable=False)

    user = relationship("User", back_populates="body_compositions")
