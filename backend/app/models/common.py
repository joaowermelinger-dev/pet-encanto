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


class SubscriptionFrequency(str, enum.Enum):
    WEEKLY = "weekly"
    BIWEEKLY = "biweekly"
    MONTHLY = "monthly"


class SubscriptionStatus(str, enum.Enum):
    ACTIVE = "active"
    PAUSED = "paused"
    CANCELLED = "cancelled"


class PaymentMethod(str, enum.Enum):
    CASH = "cash"
    CARD = "card"
    PIX = "pix"
    OTHER = "other"
