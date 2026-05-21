export interface Clinic {
  id: string;
  name: string;
  type: string;
  address: string;
  distance: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  isOpen: boolean;
  openUntil: string;
  phone: string;
  imageColor: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  clinicId: string;
  clinicName: string;
  experience: number;
  fee: number;
  rating: number;
  availableSlots: string[];
  badge?: string;
  imageColor: string;
  availableDays: string[];
}

export const CLINICS: Clinic[] = [
  {
    id: "apollo",
    name: "Apollo Clinic",
    type: "Multi-Specialty Hospital",
    address: "12 MG Road, Bangalore",
    distance: "0.8 km",
    rating: 4.8,
    reviewCount: 1240,
    specialties: ["Cardiology", "Dermatology", "Orthopedics", "Gynecology"],
    isOpen: true,
    openUntil: "9:00 PM",
    phone: "+91 80 2345 6789",
    imageColor: "#2563EB",
  },
  {
    id: "fortis",
    name: "Fortis Hospital",
    type: "Super Specialty Hospital",
    address: "Bannerghatta Road, Bangalore",
    distance: "1.4 km",
    rating: 4.7,
    reviewCount: 980,
    specialties: ["Neurology", "Oncology", "Cardiology", "Pediatrics"],
    isOpen: true,
    openUntil: "10:00 PM",
    phone: "+91 80 6621 4444",
    imageColor: "#0D9488",
  },
  {
    id: "manipal",
    name: "Manipal Hospitals",
    type: "Multi-Specialty Hospital",
    address: "Old Airport Road, Bangalore",
    distance: "2.1 km",
    rating: 4.6,
    reviewCount: 756,
    specialties: ["Dermatology", "Endocrinology", "Psychiatry", "Urology"],
    isOpen: false,
    openUntil: "8:00 PM",
    phone: "+91 80 2502 4444",
    imageColor: "#6366F1",
  },
  {
    id: "narayana",
    name: "Narayana Health",
    type: "Cardiac Care Center",
    address: "Bommasandra, Bangalore",
    distance: "3.5 km",
    rating: 4.9,
    reviewCount: 2100,
    specialties: ["Cardiology", "Cardiac Surgery", "Pediatric Cardiology"],
    isOpen: true,
    openUntil: "11:00 PM",
    phone: "+91 80 7122 2222",
    imageColor: "#EF4444",
  },
];

export const DOCTORS: Doctor[] = [
  {
    id: "dr-sharma",
    name: "Dr. Priya Sharma",
    specialty: "Dermatologist",
    clinicId: "apollo",
    clinicName: "Apollo Clinic",
    experience: 12,
    fee: 800,
    rating: 4.9,
    badge: "Best Match",
    imageColor: "#6366F1",
    availableDays: ["Mon", "Wed", "Fri", "Sat"],
    availableSlots: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"],
  },
  {
    id: "dr-mehta",
    name: "Dr. Rajiv Mehta",
    specialty: "Cardiologist",
    clinicId: "narayana",
    clinicName: "Narayana Health",
    experience: 18,
    fee: 1200,
    rating: 4.8,
    imageColor: "#EF4444",
    availableDays: ["Tue", "Thu", "Sat"],
    availableSlots: ["10:00 AM", "11:30 AM", "02:30 PM", "04:00 PM"],
  },
  {
    id: "dr-nair",
    name: "Dr. Anjali Nair",
    specialty: "Gynecologist",
    clinicId: "apollo",
    clinicName: "Apollo Clinic",
    experience: 9,
    fee: 900,
    rating: 4.7,
    imageColor: "#0D9488",
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    availableSlots: ["09:30 AM", "11:00 AM", "01:00 PM", "03:30 PM"],
  },
  {
    id: "dr-kapoor",
    name: "Dr. Vikram Kapoor",
    specialty: "General Physician",
    clinicId: "fortis",
    clinicName: "Fortis Hospital",
    experience: 15,
    fee: 600,
    rating: 4.6,
    imageColor: "#2563EB",
    availableDays: ["Mon", "Wed", "Thu", "Fri", "Sat"],
    availableSlots: ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "04:00 PM", "05:00 PM"],
  },
];

export const SPECIALTIES = [
  { label: "Dermatologist", icon: "🧴", color: "#6366F1" },
  { label: "Cardiologist", icon: "🫀", color: "#EF4444" },
  { label: "Gynecologist", icon: "👩‍⚕️", color: "#0D9488" },
  { label: "Pediatrician", icon: "🧒", color: "#F59E0B" },
  { label: "Neurologist", icon: "🧠", color: "#8B5CF6" },
  { label: "Orthopedic", icon: "🦴", color: "#2563EB" },
];
