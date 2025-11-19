import { productApi } from './api/products';

const seedProducts = [
  {
    name: 'Teclado Mecánico RGB Corsair K95',
    price: 450000,
    description: 'Teclado gaming profesional con switches mecánicos',
    category: 'Periféricos',
    stock: 10,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
  },
  {
    name: 'Mouse Gaming Razer DeathAdder V3',
    price: 280000,
    description: 'Mouse gaming de alta precisión',
    category: 'Periféricos',
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
  },
  {
    name: 'Monitor Gaming ASUS ROG 27"',
    price: 1200000,
    description: 'Monitor 144Hz QHD',
    category: 'Monitores',
    stock: 5,
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
  },
  {
    name: 'Laptop Gaming MSI Katana',
    price: 4500000,
    description: 'RTX 4060, i7-13620H, 16GB RAM',
    category: 'Laptops',
    stock: 3,
    imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400',
  },
  {
    name: 'Audífonos Logitech G Pro X',
    price: 380000,
    description: 'Audífonos gaming con micrófono Blue VO!CE',
    category: 'Audio',
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400',
  },
  {
    name: 'Webcam Logitech C920',
    price: 250000,
    description: 'Webcam Full HD 1080p',
    category: 'Periféricos',
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
