🎓 School Management Tool

Welcome to the School Management Tool, a full-stack app for managing your school’s teachers, pupils, and subjects. Built with cutting-edge technologies like Express.js, GraphQL, Prisma, and React.js, this app makes school management easier, faster, and smoother!

🌟 Features

Authentication: Secure login with JWT
CRUD Operations: Manage teachers, pupils, and subjects with ease
Teacher-Subject & Pupil-Subject Relations: Seamless relationships at your fingertips
Pagination & Search: Quick navigation through large data sets
Stylish Frontend: Responsive, sleek design with Material-UI

🚀 Quick Start

💻 Prerequisites
Before we get started, make sure you have the following installed on your machine:

Node.js (v16.x or higher)
MySQL (for the database)
Git
npm or yarn

🛠️ Setting Up the Backend

Clone the repository:

git clone https://github.com/arthakopian/buildern-task.git

Navigate to the backend:

cd school-management-tool/school-management-backend

Install dependencies:

npm install

Create a .env file:

In the school-management-backend directory, create a .env file. (Contact repository owner)

npx prisma migrate dev

Start the backend server:

npm start

🎉 Backend is now running on http://localhost:4000!

🎨 Setting Up the Frontend

Navigate to the frontend:

cd ../school-management-frontend

Install frontend dependencies:

npm install

Start the frontend server:

npm start

🎉 Frontend is live at http://localhost:3000!

🎯 Access the App

Now that both the backend and frontend are running, you can access the app in your browser by going to:

Frontend: http://localhost:3000

Backend (GraphQL Playground): http://localhost:4000/graphql
