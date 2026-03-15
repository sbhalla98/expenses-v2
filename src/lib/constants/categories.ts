export enum EXPENSE_CATEGORY_VALUES {
  GROCERY = "Grocery",
  FOOD = "Outside Food",
  HOUSEHOLD = "Household",
  UTILITY = "Utility",
  SOCIAL = "Social",
  TRANSPORTATION = "Transportation",
  APPAREL = "Apparel",
  BEAUTY = "Beauty",
  HEALTH = "Health",
  EDUCATION = "Education",
  GIFT = "Gift",
  HOME = "Home",
  SHOPPING = "Shopping",
  BIRTHDAY = "Birthday",
  VACATION = "Vacation",
  MARRIAGE = "Marriage",
  OTHER = "Other",
}

export const EXPENSE_CATEGORY_OPTIONS = 
Object.values(EXPENSE_CATEGORY_VALUES).map((value) => ({
  value,
  label: value,
}));