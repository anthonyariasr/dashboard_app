from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Exercise(Base):
    __tablename__ = "exercises"

    date = Column(Date, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    exercise_name = Column(String, nullable=False)
    duration = Column(Float, nullable=False)

    user = relationship("User", back_populates="exercises")
