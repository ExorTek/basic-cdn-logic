# Basic CDN Logic

This project demonstrates basic CDN functionality, developed with **Node.js** and **Express.js**. It simulates the behavior of a Content Delivery Network (CDN) by serving static files with caching logic.

## Setup Instructions

### Step 1: Clone and Install Dependencies

First, clone the repository and open the project in your preferred IDE. Then, open a terminal and install the necessary packages using one of the following commands:

```bash
yarn install
# or
npm install
```

### Step 2: Run the Project

Once the dependencies are installed, you can start the CDN server with the following command:

```bash
yarn dev
# or
npm run dev
```
By default, the origin server will run on http://localhost:5000

By default, the CDN server will run on http://localhost:5001

### Step 3: Test the CDN

To test the CDN, open your browser and navigate to the following URLs:

- [http://localhost:5001/cdn/1.jpg](http://localhost:5001/cdn/1.jpg)
- [http://localhost:5001/cdn/animate.min.css](http://localhost:5001/cdn/animate.min.css)
- [http://localhost:5001/cdn/react.min.js](http://localhost:5001/cdn/react.min.js)

You should see the respective files being served by the CDN server.

### Step 4: Adding New Files

To serve new static files, simply add them to the public folder in your project directory. Once the files are added, they can be accessed via the following URL pattern:

```
http://localhost:5001/cdn/<filename>
```
