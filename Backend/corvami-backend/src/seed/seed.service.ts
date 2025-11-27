import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Producto } from '../productos/entities/producto.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Producto)
    private readonly productosRepo: MongoRepository<Producto>,
  ) {}

  async seed() {
    const count = await this.productosRepo.count();

    this.logger.log(
      `Iniciando seed de productos... (${count} productos existentes)`,
    );

    // Datos para generar productos
    const categorias = [
      {
        name: 'Laptop',
        subcategorias: ['Gaming', 'Workstation', 'Económicas'],
        brands: ['MSI', 'ASUS', 'HP', 'Dell', 'Lenovo', 'Acer', 'Apple'],
        priceRange: [450000, 2500000],
        adjectives: [
          'Gaming',
          'Profesional',
          'Empresarial',
          'Ultra',
          'Premium',
          'Pro',
        ],
        models: [
          'Katana',
          'Pavilion',
          'ThinkPad',
          'Inspiron',
          'ROG',
          'Predator',
          'Swift',
          'Vivobook',
        ],
        specs: [
          'i5-12450H',
          'i7-13620H',
          'i9-13900H',
          'Ryzen 5',
          'Ryzen 7',
          'M1',
          'M2',
        ],
        ram: ['8GB', '16GB', '32GB', '64GB'],
        storage: ['256GB SSD', '512GB SSD', '1TB SSD', '2TB SSD'],
        images: [
          'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80',
          'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80',
          'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
          'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80',
          'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80',
        ],
      },
      {
        name: 'Teclado',
        subcategorias: ['Mecánicos', 'Gaming', 'Inalámbricos', 'Compactos'],
        brands: [
          'Corsair',
          'Logitech',
          'Razer',
          'HyperX',
          'Redragon',
          'Keychron',
        ],
        priceRange: [25000, 180000],
        adjectives: [
          'Mecánico',
          'RGB',
          'Inalámbrico',
          'Compacto',
          'TKL',
          'Full Size',
        ],
        models: [
          'K95',
          'K70',
          'BlackWidow',
          'MX Keys',
          'G915',
          'Huntsman',
          'Alloy',
        ],
        features: [
          'RGB',
          'Cherry MX',
          'Switches Mecánicos',
          'Retroiluminado',
          'Bluetooth',
        ],
        images: [
          'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
          'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80',
          'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&q=80',
          'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=800&q=80',
          'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&q=80',
        ],
      },
      {
        name: 'Mouse',
        subcategorias: [
          'Gaming',
          'Inalámbricos',
          'Ergonómicos',
          'Profesionales',
        ],
        brands: [
          'Logitech',
          'Razer',
          'HyperX',
          'Corsair',
          'SteelSeries',
          'Glorious',
        ],
        priceRange: [15000, 140000],
        adjectives: [
          'Gaming',
          'Ergonómico',
          'Inalámbrico',
          'Ultraligero',
          'Pro',
        ],
        models: [
          'G502',
          'G Pro',
          'DeathAdder',
          'Viper',
          'MX Master',
          'Pulsefire',
          'Model O',
        ],
        features: [
          'RGB',
          'Sensor óptico',
          'Inalámbrico',
          '16000 DPI',
          'Ergonómico',
        ],
        images: [
          'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80',
          'https://images.unsplash.com/photo-1563297007-0686b7003af7?w=800&q=80',
          'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
          'https://images.unsplash.com/photo-1622782914767-404fb9ab3f57?w=800&q=80',
          'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80',
        ],
      },
      {
        name: 'Monitor',
        subcategorias: ['Gaming', '4K', 'Ultrawide', 'Profesionales'],
        brands: ['ASUS', 'Samsung', 'LG', 'Dell', 'AOC', 'BenQ', 'ViewSonic'],
        priceRange: [120000, 1200000],
        adjectives: ['Gaming', 'Curvo', 'UltraWide', '4K', 'QHD', 'Full HD'],
        models: ['ROG', 'Odyssey', 'UltraSharp', 'Predator', 'Optix', 'TUF'],
        sizes: ['24"', '27"', '32"', '34"', '49"'],
        refresh: ['60Hz', '75Hz', '144Hz', '165Hz', '240Hz', '360Hz'],
        images: [
          'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',
          'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800&q=80',
          'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80',
          'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800&q=80',
          'https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?w=800&q=80',
        ],
      },
      {
        name: 'Audífonos',
        subcategorias: [
          'Gaming',
          'Inalámbricos',
          'Con Micrófono',
          'Profesionales',
        ],
        brands: [
          'Logitech',
          'HyperX',
          'Razer',
          'Sony',
          'Bose',
          'Corsair',
          'SteelSeries',
        ],
        priceRange: [35000, 450000],
        adjectives: ['Gaming', 'Premium', 'Inalámbricos', 'Pro', 'Elite'],
        models: [
          'Cloud',
          'G Pro',
          'Arctis',
          'WH-1000XM5',
          'QuietComfort',
          'Blackshark',
        ],
        features: [
          '7.1 Surround',
          'Cancelación de ruido',
          'Bluetooth',
          'RGB',
          'Micrófono',
        ],
        images: [
          'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80',
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
          'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=800&q=80',
          'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&q=80',
        ],
      },
      {
        name: 'Webcam',
        subcategorias: ['HD', 'Full HD', '4K', 'Con Micrófono'],
        brands: ['Logitech', 'Razer', 'Elgato', 'Microsoft', 'ASUS'],
        priceRange: [40000, 250000],
        adjectives: ['Streaming', 'Pro', '4K', 'Full HD', '1080p'],
        models: ['C920', 'C922', 'Kiyo', 'Brio', 'Facecam', 'StreamCam'],
        features: [
          '1080p',
          '4K',
          '60fps',
          'Autofocus',
          'Micrófono incorporado',
        ],
        images: [
          'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80',
          'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=800&q=80',
          'https://images.unsplash.com/photo-1635514569146-9a9607ecf303?w=800&q=80',
          'https://images.unsplash.com/photo-1623166758060-6c03c7f47127?w=800&q=80',
          'https://images.unsplash.com/photo-1629904888099-4c5f6c8f5b42?w=800&q=80',
        ],
      },
    ];

    const productos: Partial<Producto>[] = [];
    const targetCount = 500;

    // Generar productos aleatorios
    for (let i = 0; i < targetCount; i++) {
      const categoria =
        categorias[Math.floor(Math.random() * categorias.length)];
      const subcategoria =
        categoria.subcategorias[
          Math.floor(Math.random() * categoria.subcategorias.length)
        ];
      const brand =
        categoria.brands[Math.floor(Math.random() * categoria.brands.length)];
      const adjective =
        categoria.adjectives[
          Math.floor(Math.random() * categoria.adjectives.length)
        ];
      const model =
        categoria.models[Math.floor(Math.random() * categoria.models.length)];

      let name = `${categoria.name} ${adjective} ${brand} ${model}`;

      // Agregar especificaciones según categoría
      if (categoria.name === 'Laptop' && categoria.specs) {
        const spec =
          categoria.specs[Math.floor(Math.random() * categoria.specs.length)];
        const ram =
          categoria.ram[Math.floor(Math.random() * categoria.ram.length)];
        name += ` ${spec} ${ram}`;
      } else if (
        categoria.name === 'Monitor' &&
        categoria.sizes &&
        categoria.refresh
      ) {
        const size =
          categoria.sizes[Math.floor(Math.random() * categoria.sizes.length)];
        const refresh =
          categoria.refresh[
            Math.floor(Math.random() * categoria.refresh.length)
          ];
        name += ` ${size} ${refresh}`;
      }

      const price = Math.floor(
        Math.random() * (categoria.priceRange[1] - categoria.priceRange[0]) +
          categoria.priceRange[0],
      );
      const stock = Math.floor(Math.random() * 30) + 5;

      // Generar descripción
      let description = `${categoria.name} ${subcategoria.toLowerCase()} ${brand}`;
      if (categoria.features) {
        const feature =
          categoria.features[
            Math.floor(Math.random() * categoria.features.length)
          ];
        description += ` con ${feature}`;
      }

      // Generar imagen única usando parámetros aleatorios
      const baseImage =
        categoria.images[Math.floor(Math.random() * categoria.images.length)];
      const randomParam = Math.floor(Math.random() * 10000);
      const imageUrl = `${baseImage}&sig=${randomParam}`;

      productos.push({
        productId: randomUUID(),
        name,
        price,
        description,
        category: categoria.name,
        subcategory: subcategoria,
        brand,
        tags: [
          subcategoria.toLowerCase(),
          brand.toLowerCase(),
          categoria.name.toLowerCase(),
        ],
        stock,
        imageUrl,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Productos destacados garantizados
    const productosDestacados = [
      {
        productId: randomUUID(),
        name: 'Laptop Gaming MSI Katana GF76 i7-13620H 16GB RTX 4060',
        price: 1299990,
        description:
          'Laptop gaming de alto rendimiento con RTX 4060 y pantalla 144Hz',
        category: 'Laptop',
        subcategory: 'Gaming',
        brand: 'MSI',
        tags: ['gaming', 'rtx-4060', '16gb-ram'],
        stock: 8,
        imageUrl:
          'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: randomUUID(),
        name: 'Teclado Mecánico RGB Corsair K95',
        price: 149990,
        description: 'Teclado gaming profesional con switches Cherry MX',
        category: 'Teclado',
        subcategory: 'Gaming',
        brand: 'Corsair',
        tags: ['gaming', 'rgb', 'mecánico'],
        stock: 15,
        imageUrl:
          'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Combinar productos destacados con productos generados
    const todosLosProductos: Partial<Producto>[] = [
      ...productosDestacados,
      ...productos,
    ];

    // Guardar todos los productos
    let creados = 0;
    let errores = 0;

    for (const producto of todosLosProductos) {
      try {
        await this.productosRepo.save(producto);
        creados++;
        if (creados % 50 === 0) {
          this.logger.log(
            `Progreso: ${creados}/${todosLosProductos.length} productos creados...`,
          );
        }
      } catch (error) {
        errores++;
        const errorMessage =
          error instanceof Error ? error.message : 'Error desconocido';
        this.logger.error(`Error creando ${producto.name}:`, errorMessage);
      }
    }

    this.logger.log(
      `✨ Seed completado. ${creados} productos creados, ${errores} errores.`,
    );
  }
}
