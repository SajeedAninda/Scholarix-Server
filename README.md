# Scholarix
Scholarix is a web application designed to assist students and professionals in exploring educational opportunities, including courses, scholarships, study abroad programs, and consultation services. The platform provides users with access to comprehensive information about various educational offerings and allows them to bookmark courses, book consultation appointments, and make payments securely.

## Repo Intro
This Repo Contains the client side code of the Scholarix Project

## Table of Contents
- [Features](#features)
- [Frontend](#frontend)
  - [Technologies Used](#technologies-used)
- [Backend](#backend)
  - [Technologies Used](#technologies-used)
- [Live-Site](#live-site)

## Features

- Implemented secure user authentication and authorization using Google Firebase. 
- Displaying dynamic information using tabs from Headless UI.
- React Dynamic Countup to visually attract the audience in homepage.
- Parallel Filtering of courses by criteria such as tuition fees, country, degree, field of study, and available scholarships implemented from backend.
- Bookmarking Courses and View Bookmarked courses from User Profile.
- Discovering scholarships available for students based on different criteria and countries.
- Dynamically listing countries and country details with scholarships from different database collection.
- Connect with educational consultants for guidance on academic and career-related matters.
- Book consultants and confirm secure payment with card or mobile payment using SSLCommerz.
- Users can create profiles to manage their personal information, bookmarked courses, and consultation appointments.
- Users can view and update their profile information.
- Admin's can create courses, see course listings, edit and delete courses
- All of the listed courses added by admin will be shown in course page and the most recently added or updated ones will be shown in homepage.
- Admin's can add consultants, edit their info or delete them.
- Secure authorization mechanisms are implemented, ensuring that only authorized users can access certain features.
- Designed to be responsive, ensuring a seamless user experience across various devices, including desktops, tablets, and smartphones.

### Frontend
#### Technologies Used

- React: The frontend of Web App is built using React, a popular JavaScript library for building user interfaces.
- React Router DOM: To manage the routing and navigation of the application, React Router is used.
- Firebase: A platform for building web and mobile applications, used here for authentication and other features.
- Axios: A promise-based HTTP client for making network requests.
- Tanstack Query: A library for managing server state in React applications.
- Swiper Js: Modern mobile touch slider library, enabling smooth and efficient touch-based navigation.
- Lottie React: A library for adding Lottie animations to React applications.
- React Helmet Async: A library for managing document head metadata in React applications
- React Hot Toast: A library for displaying toast notifications in React applications
- React Icons: A library providing a collection of icons for React applications
- React Loader Spinner: A library for displaying loading spinners in React applications.
- React Intersection Observer: A library for observing elements entering or exiting the viewport in React applications.
- React Countup: A library for animating counting numbers in React applications


### Backend
#### Technologies Used

- Node.js: The backend is powered by Node.js, a server-side runtime environment for JavaScript. It allows for efficient server-side scripting.
- Express.js: The Express.js framework is used for building the RESTful API endpoints and handling routing on the server.
- MongoDB Atlas: Cloud-hosted MongoDB service for data storage.
- SSLCommerz LTS: A library for integrating SSLCommerz payment gateway with Node.js applications.
- CORS: A middleware for handling Cross-Origin Resource Sharing, allowing secure cross-origin communication in the browser.
- Dotenv: A zero-dependency module for loading environment variables from a .env file into process.env.


## Live-Site
To get a glimse of the Project, Please Visit https://scholarix.netlify.app/

