from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Height(Base):
    __tablename__ = "heights"

    date = Column(DateTime, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    height = Column(Float, nullable=False)

    user = relationship("User", back_populates="heights")
