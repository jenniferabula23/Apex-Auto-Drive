export interface Vehicle {
  id: string;
  name: string;
  model: string;
  category: 'Economy' | 'SUV' | 'Luxury' | 'Van' | 'Sports';
  image: string;
  gallery: string[];
  pricePerDay: {
    accra: number;
    ashanti?: number;
    eastern?: number;
    central?: number;
    western?: number;
    volta?: number;
  };
  seats: number;
  transmission: 'Automatic' | 'Manual';
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  doors: number;
  rating: number;
  reviews: number;
  badge?: string;
  glowColor: string;
  description: string;
  features: string[];
  brand: string;
  year: number;
}

const carImage = (path: string) => `/Cars/${path}`;

const pradoGallery = [
  carImage('Prado 2020/prado 2020 (1).jpg'),
  carImage('Prado 2020/prado 2020 (2).jpg'),
  carImage('Prado 2020/prado 2020 (3).jpg'),
];
const elantra2019Gallery = [carImage('Elantra 2019/Elantra 2019 (1).JPG')];
const elantra2018Gallery = [
  carImage('Elantra/Elantra (1).JPG'),
  carImage('Elantra/Elantra (2).JPG'),
  carImage('Elantra/Elantra (3).JPG'),
  carImage('Elantra/Elantra (4).JPG'),
  carImage('Elantra/Elantra (5).JPG'),
];
const crvGallery = [
  carImage('Honda CRV 2020/Honda CRV 2020 (1).JPG'),
  carImage('Honda CRV 2020/Honda CRV 2020 (2).JPG'),
  carImage('Honda CRV 2020/Honda CRV 2020 (3).JPG'),
  carImage('Honda CRV 2020/Honda CRV 2020 (4).JPG'),
];
const outlanderGallery = [
  carImage('Mitsubishi/Mitsubishi (1).JPG'),
  carImage('Mitsubishi/Mitsubishi (2).JPG'),
  carImage('Mitsubishi/Mitsubishi (3).JPG'),
  carImage('Mitsubishi/Mitsubishi (4).JPG'),
  carImage('Mitsubishi/Mitsubishi (5).JPG'),
];
const tucsonGallery = [
  carImage('Tucson 2017 Model/Tucson 2017 (1).JPG'),
  carImage('Tucson 2017 Model/Tucson 2017 (2).JPG'),
  carImage('Tucson 2017 Model/Tucson 2017 (3).JPG'),
  carImage('Tucson 2017 Model/Tucson 2017 (4).JPG'),
];
const tucson2019Gallery = [
  carImage('Tucson 2019 Model/Tucson 2019 model (1).JPG'),
  carImage('Tucson 2019 Model/Tucson 2019 model (2).JPG'),
  carImage('Tucson 2019 Model/Tucson 2019 model (3).JPG'),
  carImage('Tucson 2019 Model/Tucson 2019 model (4).JPG'),
  carImage('Tucson 2019 Model/Tucson 2019 model (5).JPG'),
];
const tahoeGallery = [
  carImage('Chevrolet Tahoe SUV/Chevrolet Tahoe SUV (1).JPG'),
  carImage('Chevrolet Tahoe SUV/Chevrolet Tahoe SUV (2).JPG'),
  carImage('Chevrolet Tahoe SUV/Chevrolet Tahoe SUV (3).JPG'),
];
const civicGallery = [
  carImage('Civic/Civic (1).jpg'),
  carImage('Civic/Civic (2).jpg'),
];
const hiaceGallery = [
  carImage('Toyota Hiace/Toyota Hiace (1).JPG'),
  carImage('Toyota Hiace/Toyota Hiace (2).jpg'),
  carImage('Toyota Hiace/Toyota Hiace (3).JPG'),
  carImage('Toyota Hiace/Toyota Hiace (4).jpg'),
];

export const getVehicleGalleryViews = (vehicle: Vehicle): string[] => vehicle.gallery;

export const vehicles: Vehicle[] = [
  {
    id: 'toyota-prado',
    name: 'Toyota Prado',
    model: 'Land Cruiser Prado',
    category: 'SUV',
    image: pradoGallery[0],
    gallery: pradoGallery,
    pricePerDay: {
      accra: 1800,
      ashanti: 2500,
      eastern: 2000,
      central: 2500,
      western: 3000,
      volta: 2500,
    },
    seats: 7,
    transmission: 'Automatic',
    fuelType: 'Diesel',
    doors: 4,
    rating: 4.9,
    reviews: 86,
    badge: 'Most Popular',
    glowColor: '#AE2119',
    description:
      'A dependable premium SUV ideal for family travel, business trips, and long-distance journeys across Ghana. Spacious, comfortable, and professionally maintained.',
    features: ['7 Seats', 'Air Conditioning', 'GPS Navigation', 'Bluetooth Audio', 'Backup Camera', '4WD'],
    brand: 'Toyota',
    year: 2022,
  },
  {
    id: 'elantra-2019',
    name: 'Hyundai Elantra',
    model: 'Elantra 2019',
    category: 'Economy',
    image: elantra2019Gallery[0],
    gallery: elantra2019Gallery,
    pricePerDay: { accra: 750 },
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    doors: 4,
    rating: 4.7,
    reviews: 64,
    badge: 'Best Value',
    glowColor: '#898989',
    description:
      'Fuel-efficient sedan perfect for city driving, business travel, and everyday mobility in Accra.',
    features: ['Air Conditioning', 'Bluetooth Audio', 'USB Charging', 'Fuel Efficient', 'Comfortable Seats'],
    brand: 'Hyundai',
    year: 2019,
  },
  {
    id: 'elantra-2018',
    name: 'Hyundai Elantra',
    model: 'Elantra 2018',
    category: 'Economy',
    image: elantra2018Gallery[0],
    gallery: elantra2018Gallery,
    pricePerDay: { accra: 700 },
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    doors: 4,
    rating: 4.6,
    reviews: 52,
    glowColor: '#898989',
    description:
      'Affordable and reliable sedan for personal travel, airport transfers, and daily commuting in Accra.',
    features: ['Air Conditioning', 'Bluetooth Audio', 'USB Charging', 'Fuel Efficient'],
    brand: 'Hyundai',
    year: 2018,
  },
  {
    id: 'crv-2019',
    name: 'Honda CR-V',
    model: 'CR-V 2019',
    category: 'SUV',
    image: crvGallery[0],
    gallery: crvGallery,
    pricePerDay: { accra: 1100, eastern: 1300, central: 1300, volta: 1300 },
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    doors: 4,
    rating: 4.8,
    reviews: 71,
    glowColor: '#2D6A4F',
    description:
      'Versatile SUV offering comfort and reliability for family outings, tours, and regional travel.',
    features: ['Air Conditioning', 'Spacious Cabin', 'GPS Navigation', 'Bluetooth Audio', 'Backup Camera'],
    brand: 'Honda',
    year: 2019,
  },
  {
    id: 'outlander-2019',
    name: 'Mitsubishi Outlander',
    model: 'Outlander 2019',
    category: 'SUV',
    image: outlanderGallery[0],
    gallery: outlanderGallery,
    pricePerDay: {
      accra: 1200,
      ashanti: 1600,
      eastern: 1500,
      central: 1500,
      volta: 1500,
    },
    seats: 7,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    doors: 4,
    rating: 4.7,
    reviews: 58,
    glowColor: '#AE2119',
    description:
      'Seven-seater SUV suited for group travel, tours, and comfortable long-distance trips across Ghana.',
    features: ['7 Seats', 'Air Conditioning', 'Bluetooth Audio', 'Spacious Luggage', 'Backup Camera'],
    brand: 'Mitsubishi',
    year: 2019,
  },
  {
    id: 'tucson-2018',
    name: 'Hyundai Tucson',
    model: 'Tucson 2018',
    category: 'SUV',
    image: tucsonGallery[0],
    gallery: tucsonGallery,
    pricePerDay: { accra: 900 },
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    doors: 4,
    rating: 4.6,
    reviews: 41,
    glowColor: '#898989',
    description:
      'Comfortable crossover SUV offering great value for personal and business travel in Accra.',
    features: ['Air Conditioning', 'Bluetooth Audio', 'Spacious Cargo', 'Fuel Efficient'],
    brand: 'Hyundai',
    year: 2018,
  },
  {
    id: 'tucson-2019',
    name: 'Hyundai Tucson',
    model: 'Tucson 2019',
    category: 'SUV',
    image: tucson2019Gallery[0],
    gallery: tucson2019Gallery,
    pricePerDay: { accra: 950, eastern: 1100, central: 1100 },
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    doors: 4,
    rating: 4.7,
    reviews: 38,
    glowColor: '#898989',
    description:
      'Updated Tucson crossover with modern styling and comfort for city commutes, business travel, and regional trips.',
    features: ['Air Conditioning', 'Bluetooth Audio', 'Backup Camera', 'Spacious Cargo', 'Fuel Efficient'],
    brand: 'Hyundai',
    year: 2019,
  },
  {
    id: 'honda-civic',
    name: 'Honda Civic',
    model: 'Civic',
    category: 'Economy',
    image: civicGallery[0],
    gallery: civicGallery,
    pricePerDay: { accra: 720 },
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    doors: 4,
    rating: 4.7,
    reviews: 45,
    glowColor: '#2D6A4F',
    description:
      'Reliable and fuel-efficient sedan ideal for daily commuting, airport transfers, and economical city travel in Accra.',
    features: ['Air Conditioning', 'Bluetooth Audio', 'USB Charging', 'Fuel Efficient', 'Comfortable Ride'],
    brand: 'Honda',
    year: 2019,
  },
  {
    id: 'chevrolet-tahoe',
    name: 'Chevrolet Tahoe',
    model: 'Tahoe SUV',
    category: 'Luxury',
    image: tahoeGallery[0],
    gallery: tahoeGallery,
    pricePerDay: {
      accra: 2800,
      ashanti: 3500,
      eastern: 3200,
      central: 3200,
      western: 3800,
      volta: 3200,
    },
    seats: 7,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    doors: 4,
    rating: 4.9,
    reviews: 42,
    badge: 'Executive',
    glowColor: '#1E3A5F',
    description:
      'Full-size premium SUV for executive travel, corporate events, VIP airport transfers, and group transportation.',
    features: ['7 Seats', 'Leather Interior', 'Air Conditioning', 'Premium Audio', 'Spacious Luggage', 'Backup Camera'],
    brand: 'Chevrolet',
    year: 2020,
  },
  {
    id: 'toyota-hiace',
    name: 'Toyota Hiace',
    model: 'Hiace Van',
    category: 'Van',
    image: hiaceGallery[0],
    gallery: hiaceGallery,
    pricePerDay: {
      accra: 1500,
      ashanti: 2000,
      eastern: 1800,
      central: 1800,
      volta: 1800,
    },
    seats: 14,
    transmission: 'Manual',
    fuelType: 'Diesel',
    doors: 4,
    rating: 4.6,
    reviews: 36,
    glowColor: '#AE2119',
    description:
      'Spacious passenger van perfect for group tours, church outings, corporate shuttles, and large-family travel across Ghana.',
    features: ['14 Seats', 'Air Conditioning', 'Spacious Interior', 'Luggage Space', 'Tour Ready'],
    brand: 'Toyota',
    year: 2018,
  },
];

export const locations = [
  { key: 'accra', label: 'Accra' },
  { key: 'ashanti', label: 'Ashanti Region' },
  { key: 'eastern', label: 'Eastern Region' },
  { key: 'central', label: 'Central Region' },
  { key: 'western', label: 'Western Region' },
  { key: 'volta', label: 'Volta Region' },
] as const;

export type LocationKey = (typeof locations)[number]['key'];

const FLEET_STORAGE_KEY = 'aad_admin_vehicles';

export const getFleetVehicles = (): Vehicle[] => {
  if (typeof window === 'undefined') return vehicles;
  try {
    const raw = localStorage.getItem(FLEET_STORAGE_KEY);
    if (!raw) return vehicles;
    const parsed = JSON.parse(raw) as Vehicle[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : vehicles;
  } catch {
    return vehicles;
  }
};

export const getVehicleById = (id: string) => getFleetVehicles().find(v => v.id === id);

export const getVehicleLocations = (vehicle: Vehicle) =>
  locations.filter(loc => vehicle.pricePerDay[loc.key] != null);

export const isRegionalLocation = (key: LocationKey) => key !== 'accra';

export const formatLocationPriceLabel = (
  locationKey: LocationKey,
  price: number,
  format: (amount: number) => string,
) =>
  isRegionalLocation(locationKey)
    ? `From ${format(price)}/day`
    : `${format(price)}/day`;

export const regionDestinationHints: Record<Exclude<LocationKey, 'accra'>, { label: string; placeholder: string; examples: string }> = {
  ashanti: {
    label: 'Where in Ashanti Region?',
    placeholder: 'e.g. Kumasi, Obuasi, Ejisu, Konongo',
    examples: 'Kumasi, Obuasi, Ejisu',
  },
  eastern: {
    label: 'Where in Eastern Region?',
    placeholder: 'e.g. Koforidua, Aburi, Akosombo, Nkawkaw',
    examples: 'Koforidua, Aburi, Akosombo',
  },
  central: {
    label: 'Where in Central Region?',
    placeholder: 'e.g. Cape Coast, Elmina, Winneba, Kasoa',
    examples: 'Cape Coast, Elmina, Winneba',
  },
  western: {
    label: 'Where in Western Region?',
    placeholder: 'e.g. Takoradi, Sekondi, Tarkwa, Axim',
    examples: 'Takoradi, Sekondi, Tarkwa',
  },
  volta: {
    label: 'Where in Volta Region?',
    placeholder: 'e.g. Ho, Hohoe, Keta, Aflao',
    examples: 'Ho, Hohoe, Keta',
  },
};

export const formatPickupLocation = (regionLabel: string, destination?: string) =>
  destination?.trim()
    ? `${regionLabel} — ${destination.trim()}`
    : regionLabel;
