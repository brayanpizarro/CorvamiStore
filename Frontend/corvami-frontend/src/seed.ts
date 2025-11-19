import { productApi } from './api/products';

const seedProducts = [
  {
    name: 'Teclado Mecánico RGB Corsair K95',
    price: 450000,
    description: 'Teclado gaming profesional con switches mecánicos Cherry MX',
    category: 'Teclado',
    brand: 'Corsair',
    tags: ['gaming', 'rgb', 'mecánico', 'cherry-mx'],
    stock: 10,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
  },
  {
    name: 'Mouse Gaming Razer DeathAdder V3',
    price: 280000,
    description: 'Mouse gaming ergonómico de alta precisión',
    category: 'Mouse',
    brand: 'Razer',
    tags: ['gaming', 'ergonómico', 'inalámbrico'],
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
  },
  {
    name: 'Monitor Gaming ASUS ROG 27"',
    price: 1200000,
    description: 'Monitor 144Hz IPS QHD para gaming profesional',
    category: 'Monitor',
    brand: 'ASUS',
    tags: ['gaming', '144hz', 'ips', '27-pulgadas'],
    stock: 5,
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
  },
  {
    name: 'Laptop Gaming MSI Katana',
    price: 4500000,
    description: 'Laptop gaming RTX 4060, i7-13620H, 16GB RAM',
    category: 'Laptop',
    brand: 'MSI',
    tags: ['gaming', 'rtx-4060', '16gb-ram', 'portatil'],
    stock: 3,
    imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400',
  },
  {
    name: 'Audífonos Logitech G Pro X',
    price: 380000,
    description: 'Audífonos gaming con micrófono Blue VO!CE desmontable',
    category: 'Audífonos',
    brand: 'Logitech',
    tags: ['gaming', 'micrófono', 'surround', 'profesional'],
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400',
  },
  {
    name: 'Webcam Logitech C920',
    price: 250000,
    description: 'Webcam Full HD 1080p para streaming',
    category: 'Webcam',
    brand: 'Logitech',
    tags: ['streaming', 'full-hd', '1080p', 'profesional'],
    stock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400',
  },
];

export async function seedDatabase() {
  console.log('🌱 Iniciando seed de productos...');
  
  for (const product of seedProducts) {
    try {
      await productApi.create(product);
      console.log(`✅ Creado: ${product.name}`);
    } catch (error) {
      console.error(`❌ Error creando ${product.name}:`, error);
    }
  }
  
  console.log('✨ Seed completado');
}

// Descomentar para ejecutar:
// seedDatabase();
