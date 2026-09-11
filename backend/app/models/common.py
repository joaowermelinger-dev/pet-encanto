"""Enums compartilhados entre modelos."""

import enum


class UserRole(str, enum.Enum):
    OWNER = "owner"


class PetSpecies(str, enum.Enum):
    DOG = "dog"
    CAT = "cat"
    OTHER = "other"


class PetSize(str, enum.Enum):
    SMALL = "small"
    MEDIUM = "medium"
    LARGE = "large"


class AppointmentStatus(str, enum.Enum):
    SCHEDULED = "scheduled"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class StockMovementReason(str, enum.Enum):
    RESTOCK = "restock"
    SALE = "sale"
    ADJUSTMENT = "adjustment"
    LOSS = "loss"


class PaymentMethod(str, enum.Enum):
    CASH = "cash"
    CARD = "card"
    PIX = "pix"
    OTHER = "other"


class SaleStatus(str, enum.Enum):
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class SaleItemType(str, enum.Enum):
    PRODUCT = "product"
    SERVICE = "service"
