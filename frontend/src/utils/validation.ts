import type { FormErrors, UserFormData } from '../types/user';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateUserForm(data: UserFormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.firstName.trim()) {
    errors.firstName = 'First name is required';
  } else if (data.firstName.trim().length > 50) {
    errors.firstName = 'First name must be 50 characters or less';
  }

  if (!data.lastName.trim()) {
    errors.lastName = 'Last name is required';
  } else if (data.lastName.trim().length > 50) {
    errors.lastName = 'Last name must be 50 characters or less';
  }

  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.department.trim()) {
    errors.department = 'Department is required';
  } else if (data.department.trim().length > 100) {
    errors.department = 'Department must be 100 characters or less';
  }

  return errors;
}

export function hasFormErrors(errors: FormErrors): boolean {
  return Object.keys(errors).length > 0;
}

export const emptyFormData: UserFormData = {
  firstName: '',
  lastName: '',
  email: '',
  department: '',
};

export const emptyFilters = {
  firstName: '',
  lastName: '',
  email: '',
  department: '',
};
