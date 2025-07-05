# FinanceFlow - Personal Finance Visualizer

A modern, responsive web application for tracking and visualizing personal finances. Built with Next.js, React, and beautiful UI components to help you manage your income and expenses effectively.

![FinanceFlow Dashboard](https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop)

## ✨ Features

### 📊 **Financial Dashboard**
- Real-time overview of total balance, income, and expenses
- Beautiful summary cards with animated progress indicators
- Clean, professional design with excellent readability

### 💰 **Transaction Management**
- Add, edit, and delete transactions with ease
- Support for both income and expense tracking
- Form validation with user-friendly error messages
- Date picker and transaction type selection

### 📈 **Data Visualization**
- Interactive monthly expense and income bar chart
- 6-month financial trend analysis
- Responsive charts that work on all devices
- Custom tooltips with detailed information

### 🔍 **Advanced Filtering**
- Search transactions by description
- Sort by date or amount
- Real-time filtering with instant results
- Clean, intuitive interface

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd finance-visualizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📱 Usage

### Adding Transactions
1. Click the "Add New Transaction" button
2. Fill in the amount, date, description, and type (income/expense)
3. Click "Add Transaction" to save

### Editing Transactions
1. Find the transaction in the list
2. Click the edit button (pencil icon)
3. Modify the details and click "Update Transaction"

### Viewing Analytics
- The dashboard automatically displays your financial overview
- The chart shows monthly trends for the last 6 months
- Summary cards provide quick insights into your financial health

### Searching and Filtering
- Use the search bar to find specific transactions
- Sort by date or amount using the filter buttons
- All filtering happens in real-time

## 🎯 Project Structure

```
├── app/
│   ├── globals.css          # Global styles and animations
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main dashboard page
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── monthly-chart.tsx    # Chart component
│   ├── transaction-form.tsx # Form for adding/editing
│   └── transaction-list.tsx # Transaction list with filtering
├── lib/
│   ├── chart-utils.ts       # Chart data processing
│   ├── transaction-storage.ts # Local storage utilities
│   └── utils.ts             # General utilities
├── types/
│   └── transaction.ts       # TypeScript type definitions
└── README.md
```

## 🔧 Customization

## 📊 Data Storage

Currently uses browser Local Storage for data persistence:
- Transactions are stored locally in the browser
- Data persists between sessions
- No server or database required
- Easy to extend to use external APIs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Recharts](https://recharts.org/) for the charting library
- [Lucide](https://lucide.dev/) for the icon set
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

