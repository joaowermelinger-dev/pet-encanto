export type UserRole = 'owner'

export interface User {
  id: number
  email: string
  name: string
  role: UserRole
}

export type PetSpecies = 'dog' | 'cat' | 'other'
export type PetSize = 'small' | 'medium' | 'large'

export interface Pet {
  id: number
  client_id: number
  name: string
  species: PetSpecies
  breed: string | null
  size: PetSize | null
  birth_date: string | null
  notes: string | null
  client_name?: string | null
}

export interface Client {
  id: number
  name: string
  phone: string
  email: string | null
  address: string | null
  notes: string | null
}

export interface ClientWithPets extends Client {
  pets: Pet[]
}

export interface Service {
  id: number
  name: string
  description: string | null
  duration_minutes: number
  /** Vem como string do backend (Decimal) para não perder precisão. */
  price: string
  is_public: boolean
  is_active: boolean
}

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled'
export type PaymentMethod = 'cash' | 'card' | 'pix' | 'other'

export interface AppointmentServiceItem {
  id: number
  service_id: number
  /** Vem como string do backend (Decimal). */
  price: string
  service: Service
}

export interface Appointment {
  id: number
  pet_id: number | null
  scheduled_at: string
  status: AppointmentStatus
  /** Total cobrado nessa ocorrência — soma de `items`. Vem como string (Decimal). */
  price: string
  paid: boolean
  payment_method: PaymentMethod | null
  notes: string | null
  /** Preenchidos só quando NÃO há pet_id (atendimento avulso, sem cadastro). */
  guest_client_name: string | null
  guest_client_phone: string | null
  guest_animal_name: string | null
  guest_animal_breed: string | null
  guest_animal_notes: string | null
  /** Preenchido quando esse atendimento veio de um Clubinho (assinatura recorrente). */
  subscription_id: number | null
  pet: Pet | null
  /** Um ou mais serviços cobrados (ex.: banho + tosa no mesmo atendimento). */
  items: AppointmentServiceItem[]
}

export type SubscriptionFrequency = 'weekly' | 'biweekly' | 'monthly'
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled'

export interface Subscription {
  id: number
  pet_id: number
  service_id: number
  frequency: SubscriptionFrequency
  first_occurrence_at: string
  status: SubscriptionStatus
  pet: Pet
  service: Service
  next_occurrence_at: string | null
}

export interface Expense {
  id: number
  description: string
  amount: string
  expense_date: string
}

export interface DailyTotal {
  date: string
  revenue: string
}

export interface RevenueByMethod {
  cash: string
  card: string
  pix: string
  other: string
}

export interface FinanceSummary {
  total_revenue: string
  total_pending: string
  total_expenses: string
  net: string
  revenue_by_method: RevenueByMethod
  daily: DailyTotal[]
  expenses: Expense[]
}

export interface PetPhoto {
  id: number
  pet_id: number | null
  image_url: string
  caption: string | null
  is_public: boolean
  created_at: string
}

export interface ShopInfo {
  shop_name: string
  address: string
  phone: string
  whatsapp: string | null
  email: string | null
  instagram_url: string | null
  opening_hours: string
  latitude: number | null
  longitude: number | null
}
