# SmartCart 🛒 - Reinventing Grocery Delivery (Innovaite 2025 Hackathon)

## Overview 🌟
SmartCart is an innovative AI-powered grocery delivery application that revolutionizes the way people shop for groceries. By simply entering a dish name, users get an instant, precise list of required ingredients sourced at competitive prices from local stores.

## Business Value & Impact 💡
- **For Customers**: 
  - Save time and money by automatically finding the best deals
  - Simplified meal planning and diet budgeting
  - Fresh food focus with optimized delivery schedules
  - Reduced food waste through smart purchasing

- **For Vendors**:
  - Optimized inventory management
  - Better demand forecasting
  - Increased local business growth
  - Resource optimization and waste reduction

## Key Features ✨
- AI-powered ingredient list generation from dish names
- Automated vendor comparison and selection
- Smart weekly meal planning
- Real-time price updates and comparisons
- Personalized recommendations
- Seasonal discount notifications
- Inventory tracking for both users and vendors

## Project Structure 📁
```
smart-delivery/
├── app/
│   ├── public/
│   └── icons/
├── back-end/
├── migrations/
├── tests/
├── smart_delivery/
│   ├── __init__.py
│   ├── manage.py
│   ├── settings.py
│   ├── urls.py
│   ├── views.py
│   └── wsgi.py
├── README.md
└── LICENSE
```

## Technologies Used 🔧
- **Backend**:
  - Python 3.9+
  - Django REST Framework
  - PostgreSQL
  - Redis for caching

- **AI/ML**:
  - Google's Gemini Pro model
  - PyTorch
  - Transformers (BERT)
  - scikit-learn

- **Frontend**:
  - React.js
  - Material-UI
  - Next.js
  - JavaScript/JSX
  - Tailwind CSS
  - HTML

- **Database**:
  - SQLite3 (configured in Django settings)

- **API/Communication**:
  - REST APIs
  - JSON for data exchange
  - CORS (Cross-Origin Resource Sharing)

- **Version Control/Environment**:
  - Git BASH

## Getting Started 🚀

### Prerequisites
- Python 3.9 or higher
- Node.js 14.x or higher
- PostgreSQL 13 or higher

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/smartcart.git
cd smartcart
```

2. Set up the backend
```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up database
python manage.py migrate
```

3. Set up the frontend
```bash
cd app
npm install
```

4. Start the development servers
```bash
# Backend (in one terminal)
python manage.py runserver

# Frontend (in another terminal)
cd app
npm start
```

5. Visit `http://localhost:3000` to access the application

### Using Docker
```bash
# Build and run containers
docker-compose up --build
```

## API Documentation 📚
The API documentation is available at `/api/docs` when running the server locally. Key endpoints include:

- `POST /api/dishes/analyze`: Convert dish name to ingredients
- `GET /api/vendors/compare`: Compare prices across vendors
- `POST /api/orders/create`: Create a new order
- `GET /api/recommendations`: Get personalized recommendations

## About the Project 🏆
This project was developed during the Innovaite 2025 hackathon conducted at Northeastern University, Boston, organized by the Artificial Intelligence club of NEU. Our team, the **Grocery Gurus**, worked to address real-world challenges in grocery shopping and delivery.

## Team Members 👥
- **Aatmaj Amol Salunke** - Database Management, Backend Development & AI Integration
- **Yueran Jia** - Frontend Development
- **Chenyuan Zhang** - AI Integration
- **Neelraj Nitta** - Front-end and Back end Integration
- **Krithika Murugesan** - UI/UX Design and Testing
- **Alex Saidov** - Frontend Development

## Contact 📧
- **Project Link**: [https://github.com/your-username/smartcart](https://github.com/aatmaj28/Innovaite-2025)
- **Team Email**: salunke.aa@northeastern.edu / nitta.v@northeastern.edu

## Acknowledgments 🙏
- Northeastern University Artificial Intelligence Club
- Innovaite 2025 Hackathon organizers
- All mentors and judges who provided valuable feedback

## Future Roadmap 🗺️
- [ ] Mobile application development
- [ ] Integration with more local vendors
- [ ] Advanced dietary restriction handling
- [ ] Recipe recommendation system
- [ ] Automated grocery list optimization
- [ ] Social sharing features
- [ ] Carbon footprint tracking

---
Built with ❤️ and ⚡ by Team **Grocery Gurus** at **Innovaite 2025**
