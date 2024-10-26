from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class WaterConsumption(Base):
    __tablename__ = "water_consumptions"

    date = Column(DateTime, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    water_amount = Column(Float, nullable=False)

    user = relationship("User", back_populates="water_consumptions")
