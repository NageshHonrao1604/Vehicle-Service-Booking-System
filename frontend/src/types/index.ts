/**
 * Core application types and interfaces
 */

// User types
export type UserRole = 'ADMIN' | 'CUSTOMER' | 'MECHANIC';

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  profileImage?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IAuthResponse {
  user: IUser;
  token: string;
  refreshToken?: string;
}

export interface IAuthCredentials {
  email: string;
  password: string;
}

export interface IRegisterData extends IAuthCredentials {
  firstName: string;
  lastName: string;
  phone: string;
  confirmPassword: string;
}

// Vehicle types
export interface IVehicle {
  id: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  licensePlate: string;
  customerId: string;
  mileage: number;
  lastServiceDate?: string;
  nextServiceDue?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Service types
export type ServiceType = 'MAINTENANCE' | 'REPAIR' | 'INSPECTION' | 'CLEANING';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface IBooking {
  id: string;
  vehicleId: string;
  vehicle?: IVehicle;
  customerId: string;
  mechanicId?: string;
  mechanic?: IUser;
  serviceType: ServiceType;
  description: string;
  appointmentDate: string;
  appointmentTime: string;
  status: BookingStatus;
  estimatedCost?: number;
  actualCost?: number;
  completedDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IServiceReport {
  id: string;
  bookingId: string;
  mechanicId: string;
  partsUsed: IServicePart[];
  laborHours: number;
  totalCost: number;
  findings: string;
  recommendations: string;
  createdAt: string;
}

export interface IServicePart {
  id: string;
  name: string;
  quantity: number;
  cost: number;
}

// API Response types
export interface IApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string>;
}

export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Error types
export interface IApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

// Redux state types
export interface IAuthState {
  isAuthenticated: boolean;
  user: IUser | null;
  loading: boolean;
  error: string | null;
}

export interface IBookingState {
  bookings: IBooking[];
  currentBooking: IBooking | null;
  loading: boolean;
  error: string | null;
  filters: IBookingFilters;
}

export interface IBookingFilters {
  status?: BookingStatus;
  serviceType?: ServiceType;
  dateFrom?: string;
  dateTo?: string;
}

// Form types
export interface ILoginForm {
  email: string;
  password: string;
}

export interface IBookingForm {
  vehicleId: string;
  serviceType: ServiceType;
  description: string;
  appointmentDate: string;
  appointmentTime: string;
}
