# 🍃 LeafStore — Server-Rendered Product Management Dashboard

**LeafStore** is a robust, server-side rendered (SSR) administrative dashboard designed to manage e-commerce products efficiently. Built to address the need for fast page loads and improved SEO, this application allows administrators to visualize sales data and perform complex inventory operations seamlessly.

---

## 🎯 Objective

The primary objective was to design and develop a server-side rendered (SSR) application that ensures:

- **Fast Page Loads** — Data is fetched on the server before rendering.
- **SEO Optimization** — Server-rendered HTML for better search engine indexing.
- **Efficient Management** — A streamlined interface for CRUD operations.

---

## 🚀 Key Features

- **⚡ Server-Side Rendering (SSR)**  
  Utilizes Next.js App Router to fetch data on the server, ensuring fast initial loads and secure data handling.

- **📦 Complete Product CRUD**  
  Full capability to **Create**, **Read**, **Update**, and **Delete** inventory items with database synchronization.

- **📊 Data Visualization**  
  Interactive charts rendering sales trends and inventory distribution using real-time data.

- **🖼️ Image Management**  
  Flexible image handling support (Direct URL paste & File Upload UI).

- **🛡️ Robust Validation**  
  Server-side validation ensures data integrity before it reaches the PostgreSQL database.

- **🌗 Dark Mode UI**  
  A professional, responsive interface built with Tailwind CSS for long administration sessions.

---

## 🛠️ Tech Stack

| Component | Technology | Description |
|--------|------------|-------------|
| **Framework** | **Next.js 15** | Server-Side Rendering & App Router |
| **Language** | **TypeScript** | Type safety & maintainability |
| **Database** | **PostgreSQL** | Relational data storage |
| **ORM** | **Prisma** | Database schema & queries |
| **Styling** | **Tailwind CSS** | Utility-first responsive design |
| **Icons** | **Lucide React** | Modern UI iconography |

---

## 🔄 Application Workflow

1. **Request** — Admin requests the dashboard page.
2. **SSR Fetch** — Server fetches live product data from the PostgreSQL database.
3. **Render** — Fully populated HTML is sent to the browser (fast LCP).
4. **Interaction** — Admin interacts with charts or forms.
5. **Mutation** — Server Actions process changes and update the database.
6. **Refresh** — UI revalidates to display the latest state.

---

## ⚡ Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/leaf-store.git
cd leaf-store
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/leafstore?schema=public"
```

### 4. Database Initialization
```bash
npx prisma db push
npx prisma db seed
```

### 5. Start the Development Server
```bash
npm run dev
```

Open **http://localhost:3000/dashboard** to access the application.

---

## ✅ You're Ready!

- Open the admin dashboard to begin managing inventory  
- Create, update, and organize products using validated forms  
- Monitor sales and stock metrics through interactive visualizations  
- Deploy confidently with server-side rendering for performance and SEO
