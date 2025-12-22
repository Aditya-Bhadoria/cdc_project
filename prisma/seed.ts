// @ts-nocheck
import 'dotenv/config' // <--- THIS LINE FIXES THE PASSWORD ERROR
import { PrismaClient } from '../src/generated/client'
import { hash } from 'bcryptjs'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// 1. Setup the connection adapter
const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

// 2. Pass the adapter to Prisma
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Start seeding...')

  const products = [
    {
      name: 'NVIDIA GeForce RTX 5090',
      description: 'Extreme performance for high-end gaming and content creation.',
      price: 2999.99,
      inventoryCount: 15,
      sku: 'NVD-RTX-5090',
      status: 'ACTIVE',
      category: 'Electronics',
      image: 'https://www.primeabgb.com/online-price-reviews-india/asus-tuf-gaming-geforce-rtx-5090-32gb-gddr7-oc-edition-graphic-card-tuf-rtx5090-o32g-gaming/',
    },
    {
      name: 'Ergonomic Office Chair',
      description: 'Adjustable mesh chair with lumbar support, perfect for long working hours.',
      price: 189.50,
      inventoryCount: 12,
      sku: 'FURN-CHR-ERGO',
      status: 'ACTIVE',
      category: 'Furniture',
      image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&q=80',
    },
    {
      name: 'Smart Fitness Watch',
      description: 'Tracks heart rate, steps, and sleep. Water-resistant and compatible with iOS/Android.',
      price: 129.00,
      inventoryCount: 88,
      sku: 'WEAR-WATCH-S2',
      status: 'ACTIVE',
      category: 'Wearables',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    },
    {
      name: 'Mechanical Gaming Keyboard',
      description: 'RGB backlit keyboard with tactile switches for precision gaming and typing.',
      price: 89.99,
      inventoryCount: 34,
      sku: 'TECH-KB-MECH',
      status: 'ACTIVE',
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b91add1?w=800&q=80',
    },
    {
      name: 'Ceramic Coffee Mug Set',
      description: 'Set of 4 handcrafted ceramic mugs, microwave and dishwasher safe.',
      price: 35.00,
      inventoryCount: 150,
      sku: 'HOME-MUG-SET4',
      status: 'DRAFT', 
      category: 'Home & Kitchen',
      image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80',
    },
    {
      name: 'Vegan Leather Backpack',
      description: 'Stylish and durable backpack with laptop compartment and multiple pockets.',
      price: 65.00,
      inventoryCount: 20,
      sku: 'ACC-BAG-LEATHER',
      status: 'ACTIVE',
      category: 'Accessories',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    },
    {
      name: '4K Ultra HD Monitor',
      description: '27-inch IPS display with HDR support, ideal for designers and gamers.',
      price: 349.99,
      inventoryCount: 8,
      sku: 'TECH-MON-4K',
      status: 'ARCHIVED', 
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',
    },
    {
      name: 'Organic Green Tea',
      description: 'Premium loose-leaf green tea sourced from sustainable farms.',
      price: 15.99,
      inventoryCount: 200,
      sku: 'GROC-TEA-GRN',
      status: 'ACTIVE',
      category: 'Groceries',
      image: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=800&q=80',
    },
    {
      name: 'Portable Bluetooth Speaker',
      description: 'Compact speaker with deep bass and waterproof design for outdoor use.',
      price: 49.99,
      inventoryCount: 60,
      sku: 'AUDIO-SPK-BT',
      status: 'ACTIVE',
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
    },
    {
      name: 'Yoga Mat',
      description: 'Non-slip, eco-friendly yoga mat with extra cushioning for joint support.',
      price: 24.50,
      inventoryCount: 75,
      sku: 'FIT-MAT-YOGA',
      status: 'ACTIVE',
      category: 'Fitness',
      image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80',
    }
  ]

  console.log(`📦 Seeding ${products.length} products...`)
  
  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {}, 
      create: product, 
    })
  }

  // Create Admin User
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
  
  console.log('-----------------------------------')
  console.log('✅ Seeding finished.')
  console.log('👤 Admin Created: admin@example.com')
  console.log('🔑 Password:      admin123')
  console.log('-----------------------------------')
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