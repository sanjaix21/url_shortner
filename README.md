# URL Shortener Application

This project implements a URL shortener application with a React frontend and a Node.js/Express backend, adhering to the requirements outlined in the "Campus Hiring Evaluation" documents.

## Table of Contents

- [Submission Guidelines](#submission-guidelines)
- [Project Overview](#project-overview)
- [Requirements & Constraints](#requirements--constraints)
- [Deliverables & Evaluation Considerations](#deliverables--evaluation-considerations)
- [Setup and Running the Application](#setup-and-running-the-application)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Endpoints](#api-endpoints)

## Submission Guidelines

*   **Public Repository:** Create a Public Repository on your GitHub Account with your Roll Number as the Repository Name.
*   **Folder Structure:**
    *   For Full Stack tracks, create 3 distinct folders inside the repository for the following:
        *   `Logging Middleware` (implemented in `src/middleware/logger.ts` for frontend, and integrated into backend)
        *   `Backend Test Submission` (backend code in `backend/`)
        *   `Frontend Test Submission` (frontend code in `src/`)
*   **Naming Convention:** Ensure that your Name, or any mention of Affordmed, is entirely absent from the Repository Name, the README file, and all commit messages.
*   **Comprehensive Solutions:** For each question, submit comprehensive solutions. This includes your architecture design, complete code, and clear output screenshots. Incomplete submissions will not be considered for evaluation.
*   **Regular Commits:** We strongly encourage you to commit and push your code to GitHub regularly, at logical milestones in your development process.
*   **Production-Grade Standards:** Please adhere to production-grade coding standards. This includes employing proper naming conventions, maintaining a well-organised folder structure, and providing appropriate comments within your code to enhance readability.
*   **Backend Track:** Select any Backend Framework without utilising external libraries for algorithms. Capture output screenshots from API clients like Insomnia or Postman, displaying request body, response, and response time for the average calculator problem. The output screenshots have to be taken of API calls to your app and not the test server.
*   **Frontend Track:** It is mandatory to use React or Next. While JavaScript is permitted, the use of TypeScript is preferred. Capture output screenshots of both mobile and desktop views of your web application. For styling, only Material UI or Vanilla CSS are permitted.
*   **Plagiarism:** Any instance of plagiarism, including using another applicant's API credentials, LLMs will lead to immediate rejection.

## Project Overview

This application provides core URL shortening functionality and displays analytical insights, all managed within the client-side application, interacting with a custom-built backend.

## Requirements & Constraints

*   **Mandatory Logging Integration:** The app MUST extensively use the Logging Middleware. Use of inbuilt language loggers or console logging is not allowed.
*   **Application Architecture:** Implement a React application for the frontend and a Node.js/Express application for the backend.
*   **Authentication:** For the purpose of this evaluation, assume users accessing your APIs are pre-authorized. Your application must not require user registration or login mechanisms for API access. (Note: For demonstration purposes, a basic registration/login flow is implemented in this project).
*   **Short Link Uniqueness:** All generated short links within the application must be unique. The application must manage this uniqueness.
*   **Default Validity:** If a user does not specify a validity period for a shortened URL, it must default to 30 minutes. Validity input from the user will always be provided as an integer representing minutes.
*   **Custom Shortcodes:** Users may optionally provide a custom shortcode of their choice. If a shortcode is provided, your service must attempt to use it, ensuring it is unique and valid (e.g., alphanumeric, reasonable length). If no shortcode is provided, your service must automatically generate a unique shortcode.
*   **Redirection:** When a user accesses a shortened URL (e.g., `http://hostname:port/abcd1`) from the short URL creation's result page or from the statistics page, the React application must handle the route and redirect them to the original long URL. This implies client-side routing and management of the URL mappings.
*   **Error Handling:** Implement robust client-side error handling. Display appropriate user-friendly messages for invalid inputs (e.g., malformed URL, shortcode collision) and other operational issues.
*   **Running Environment:** Your React application must run exclusively on `http://localhost:3000`.
*   **User Experience:** Care must be taken to avoid cluttering the page. The UI must prioritize user experience, with a focus on highlighting key elements of each page.
*   **Styling Framework:** Use Material UI only. If you are not familiar with Material UI, employ native CSS. Use of ShadCN or other CSS Libraries is prohibited.

## Deliverables & Evaluation Considerations

*   **Code Implementation:** Deliver a fully functional, responsive React frontend web application that adheres to all specified requirements and general constraints, demonstrating robust error handling, high code quality, and efficient UI design suitable for a production environment.
*   **Design Document:** Provide a concise document that outlines your architectural and code design choices for the React application. This should include key decisions, data modeling (especially for client-side persistence), technology selections with justifications, routing strategy for URL handling/redirection, and any assumptions made, reflecting a comprehensive understanding of scalable, maintainable, and user-centric system design. (Note: This README serves as a high-level design document for this submission).

## Setup and Running the Application

This project consists of two main parts: a Node.js backend and a React frontend.

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the backend server:**
    ```bash
    node server.js &
    ```
    The backend server will run on `http://localhost:3001`.

### Frontend Setup

1.  **Navigate to the project root directory:**
    ```bash
    cd .. # If you are in the backend directory
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the frontend application:**
    ```bash
    npm start
    ```
    The frontend application will open in your browser, typically at `http://localhost:3000`.

## API Endpoints

The backend provides the following API endpoints:

*   **`POST /evaluation-service/register`**: User registration.
*   **`POST /evaluation-service/auth`**: User authentication to obtain a token.
*   **`POST /shorten`**: Shorten a URL. Requires authentication token.
*   **`GET /:shortCode`**: Redirect to the original URL.
*   **`GET /stats`**: Get statistics for all shortened URLs. Requires authentication token.
*   **`POST /evaluation-service/logs`**: Log application events. Requires authentication token.