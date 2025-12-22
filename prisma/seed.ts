// @ts-nocheck
import 'dotenv/config' 
import { PrismaClient } from '../src/generated/client'
import { hash } from 'bcryptjs'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Start seeding...')

  const products = [
    {
      name: 'Minimalist Leather Backpack',
      description: 'Handcrafted full-grain leather backpack with a dedicated 15-inch laptop sleeve and weather-resistant finish.',
      price: 129.99,
      inventoryCount: 24,
      sku: 'ACC-BAG-LTHR',
      status: 'ACTIVE',
      category: 'Accessories',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    },
    {
      name: 'Analog Film Camera',
      description: 'Vintage-style 35mm film camera for photography enthusiasts. Lens kit included.',
      price: 350.00,
      inventoryCount: 8,
      sku: 'ELEC-CAM-35MM',
      status: 'ACTIVE',
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
    },
    {
      name: 'Running Sneakers - Red',
      description: 'Lightweight athletic shoes featuring breathable mesh and shock-absorbing soles for high-impact training.',
      price: 89.00,
      inventoryCount: 12,
      sku: 'FTWR-RUN-RED',
      status: 'ACTIVE',
      category: 'Fitness',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    },
    {
      name: 'Smart Fitness Watch',
      description: 'Water-resistant tracker that monitors heart rate, sleep patterns, and steps. Includes GPS functionality.',
      price: 149.99,
      inventoryCount: 88,
      sku: 'WEAR-WTC-SMT',
      status: 'ACTIVE',
      category: 'Wearables',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    },
    {
      name: 'Ceramic Plant Pot (Set of 3)',
      description: 'Minimalist white ceramic pots with bamboo trays. Perfect for succulents and small indoor plants.',
      price: 35.00,
      inventoryCount: 150,
      sku: 'HOME-PLT-WHT',
      status: 'ACTIVE',
      category: 'Home & Kitchen',
      image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80',
    },
    {
      name: 'Mechanical Gaming Keyboard',
      description: 'RGB backlit mechanical keyboard with tactile blue switches and aircraft-grade aluminum frame.',
      price: 110.00,
      inventoryCount: 5, 
      sku: 'ELEC-KEY-RGB',
      status: 'ACTIVE',
      category: 'Electronics',
      image: 'https://www.portronics.com/cdn/shop/files/Hydra-10_1200x1200_Brown_1.jpg?v=1733831965',
    },
    {
      name: 'Classic Aviator Sunglasses',
      description: 'Timeless metal frame sunglasses with polarized lenses offering 100% UV protection.',
      price: 55.00,
      inventoryCount: 200,
      sku: 'ACC-SUN-AVTR',
      status: 'ACTIVE',
      category: 'Accessories',
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
    },
    {
      name: 'Insulated Water Bottle',
      description: 'Double-walled stainless steel bottle that keeps drinks cold for 24 hours or hot for 12 hours.',
      price: 24.99,
      inventoryCount: 65,
      sku: 'FIT-BTL-STYL',
      status: 'DRAFT',
      category: 'Fitness',
      image: 'https://nestasia.in/cdn/shop/files/waterbottles_3.webp?v=1697635462&width=2000',
    },
    {
      name: 'Modern Desk Lamp',
      description: 'Adjustable LED desk lamp with touch control brightness and a built-in USB charging port.',
      price: 45.00,
      inventoryCount: 0,
      sku: 'HOME-LMP-DSK',
      status: 'ARCHIVED',
      category: 'Furniture',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTayI5529MOvkWA03JtN1fvtMNGcp0UFYLS7g&s',
    },
    {
      name: 'NVIDIA GeForce RTX 5090',
      description: 'Extreme performance for high-end gaming and content creation.',
      price: 2999.99,
      inventoryCount: 15,
      sku: 'NVD-RTX-5090',
      status: 'ACTIVE',
      category: 'Electronics',
      image: 'https://static.gigabyte.com/StaticFile/Image/Global/a67d9b9d9fe4c2d45c95946aec6375ee/Product/43834',
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