from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class BodyFatPercentage(Base):
    __tablename__ = "body_fat_percentages"

    date = Column(DateTime, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    fat_percentage = Column(Float, nullable=False)

    user = relationship("User", back_populates="body_fat_percentages")
