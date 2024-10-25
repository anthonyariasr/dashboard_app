from sqlalchemy import Column, Integer, Date, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class DailyStep(Base):
    __tablename__ = "daily_steps"

    date = Column(Date, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    steps_amount = Column(Integer, nullable=False)

    user = relationship("User", back_populates="daily_steps")
