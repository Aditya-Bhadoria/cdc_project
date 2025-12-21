import { PrismaClient } from '../src/generated/client'
import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'bcryptjs'
const connectionString = process.env.DATABASE_URL

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Start seeding...')

  const products = [
    {
      name: 'Wireless Noise-Canceling Headphones',
      description: 'Premium over-ear headphones with 40-hour battery life and immersive sound quality.',
      price: 299.99,
      stock: 45,
      sku: 'AUDIO-WH-1000',
      status: 'ACTIVE',
      category: 'Electronics',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    },
    {
      name: 'Ergonomic Office Chair',
      description: 'Adjustable mesh chair with lumbar support, perfect for long working hours.',
      price: 189.50,
      stock: 12,
      sku: 'FURN-CHR-ERGO',
      status: 'ACTIVE',
      category: 'Furniture',
      imageUrl: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&q=80',
    },
    {
      name: 'Smart Fitness Watch',
      description: 'Tracks heart rate, steps, and sleep. Water-resistant and compatible with iOS/Android.',
      price: 129.00,
      stock: 88,
      sku: 'WEAR-WATCH-S2',
      status: 'ACTIVE',
      category: 'Wearables',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    },
    {
      name: 'Mechanical Gaming Keyboard',
      description: 'RGB backlit keyboard with tactile switches for precision gaming and typing.',
      price: 89.99,
      stock: 34,
      sku: 'TECH-KB-MECH',
      status: 'ACTIVE',
      category: 'Electronics',
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b91add1?w=800&q=80',
    },
    {
      name: 'Ceramic Coffee Mug Set',
      description: 'Set of 4 handcrafted ceramic mugs, microwave and dishwasher safe.',
      price: 35.00,
      stock: 150,
      sku: 'HOME-MUG-SET4',
      status: 'DRAFT', 
      category: 'Home & Kitchen',
      imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80',
    },
    {
      name: 'Vegan Leather Backpack',
      description: 'Stylish and durable backpack with laptop compartment and multiple pockets.',
      price: 65.00,
      stock: 20,
      sku: 'ACC-BAG-LEATHER',
      status: 'ACTIVE',
      category: 'Accessories',
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    },
    {
      name: '4K Ultra HD Monitor',
      description: '27-inch IPS display with HDR support, ideal for designers and gamers.',
      price: 349.99,
      stock: 8,
      sku: 'TECH-MON-4K',
      status: 'ARCHIVED', 
      category: 'Electronics',
      imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',
    },
    {
      name: 'Organic Green Tea',
      description: 'Premium loose-leaf green tea sourced from sustainable farms.',
      price: 15.99,
      stock: 200,
      sku: 'GROC-TEA-GRN',
      status: 'ACTIVE',
      category: 'Groceries',
      imageUrl: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=800&q=80',
    },
    {
      name: 'Portable Bluetooth Speaker',
      description: 'Compact speaker with deep bass and waterproof design for outdoor use.',
      price: 49.99,
      stock: 60,
      sku: 'AUDIO-SPK-BT',
      status: 'ACTIVE',
      category: 'Electronics',
      imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
    },
    {
      name: 'Yoga Mat',
      description: 'Non-slip, eco-friendly yoga mat with extra cushioning for joint support.',
      price: 24.50,
      stock: 75,
      sku: 'FIT-MAT-YOGA',
      status: 'ACTIVE',
      category: 'Fitness',
      imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80',
    }
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {}, 
      create: product, 
    })
  }
  const password = await hash("admin123", 12); 
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: password,
      role: 'ADMIN'
    },
  })
  
  console.log({ user })
  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })