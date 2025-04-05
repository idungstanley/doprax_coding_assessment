# Cloud Service Configuration Wizard

This is a Vue 3 application that provides a multi-step wizard for configuring and deploying cloud services. It uses TypeScript, VeeValidate for form validation, Vue Router for navigation, and `localStorage` for data persistence in edit mode.

## Prerequisites

Before running the project, ensure you have the following installed:

- **Node.js**: Version 16 or later
- **npm**: Version 7 or later (or **yarn** if you prefer)
- **Git**: Optional, for cloning the repository

You can check your Node.js and npm versions by running:

```bash
node --version
npm --version
```

## Installation

Follow these steps to set up the project on your local machine:

1. **Clone the Repository** (if applicable):

   If the project is hosted in a Git repository, clone it to your local machine:

   ```bash
   git clone https://github.com/idungstanley/doprax_coding_assessment.git
   cd doprax_coding_assessment
   ```

   If you’re working with a local copy, skip this step and navigate to the project directory.

2. **Install Dependencies**:

   Install the required npm packages using one of the following commands:

   Using npm:

   ```bash
   npm install
   ```

   Or using yarn:

   ```bash
   yarn install
   ```

   This will install all dependencies listed in `package.json`, including Vue 3, TypeScript, VeeValidate, Vue Router, and Tailwind CSS.

## Running the Project

To run the project in development mode with hot reloading, follow these steps:

1. **Start the Development Server**:

   Use the following command to start the Vite development server:

   Using npm:

   ```bash
   npm run dev
   ```

   Or using yarn:

   ```bash
   yarn dev
   ```

   This will start the development server, and you’ll see output indicating the local URL where the app is running, typically:

   ```
   VITE v4.0.0  ready in 300 ms

     ➜  Local:   http://localhost:3000/
     ➜  Network: http://192.168.1.100:5173/
   ```

2. **Access the Application**:

   Open your browser and navigate to the URL provided (e.g., `http://localhost:3000`). You should see the "Configure New Cloud Service" page, which is the starting point of the wizard.

## Building for Production

To create a production-ready build of the project, follow these steps:

1. **Build the Project**:

   Run the following command to build the project for production:

   Using npm:

   ```bash
   npm run build
   ```

   Or using yarn:

   ```bash
   yarn build
   ```

   This will generate optimized production files in the `dist` directory.

2. **Preview the Production Build** (optional):

   To preview the production build locally, run:

   Using npm:

   ```bash
   npm run preview
   ```

   Or using yarn:

   ```bash
   yarn preview
   ```

   This will start a local server (e.g., at `http://localhost:4173`) to serve the production build.

## Usage

Once the application is running, you can use it to configure and deploy cloud services:

1. **Create a New Service**:

   - Start on the "Configure New Cloud Service" page.
   - **Step 1 (Service Basics)**: Enter the service name, description, region, and optionally upload a cover image.
   - **Step 2 (Resources)**: Configure the instance type, vCPU, memory, and storage.
   - **Step 3 (Network)**: Set up the VPC, subnet, public IP assignment, and security groups.
   - **Step 4 (Review)**: Review your configuration and click "Deploy" to save the service to `localStorage`.

   After submission, the service will be saved in `localStorage` with a generated ID (e.g., `cloudService_123456789`). Check the browser’s DevTools (Application > Storage > Local Storage) to verify.

2. **Edit an Existing Service**:

   - Navigate to the edit route using the service ID (e.g., `/edit/123456789`).
   - The form will load with the values stored in `localStorage`.
   - Make changes and click "Deploy" to update the service in `localStorage`.

3. **View Services**:

   - Navigate to the `/services-list` route to view a list of saved services (you may need to implement this view if not already present).