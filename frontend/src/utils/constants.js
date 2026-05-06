export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const ROLES = {
  OWNER: "owner",
  MANAGER: "manager",
  TRAINER: "trainer",
  MEMBER: "member",
};

export const MEMBERSHIP_TYPES = {
  BASIC: "basic",
  PREMIUM: "premium",
  VIP: "vip",
};

export const PACKAGE_DURATIONS = {
  ONE_MONTH: 1,
  THREE_MONTHS: 3,
  SIX_MONTHS: 6,
  ONE_YEAR: 12,
};

export const PAYMENT_METHODS = {
  CASH: "cash",
  BANK_TRANSFER: "bank_transfer",
  CREDIT_CARD: "credit_card",
  E_WALLET: "e_wallet",
};

export const FEEDBACK_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  RESOLVED: "resolved",
  REJECTED: "rejected",
};

export const EQUIPMENT_STATUS = {
  ACTIVE: "active",
  MAINTENANCE: "maintenance",
  BROKEN: "broken",
};
