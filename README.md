
# UK Restaurant Finder

A web application that displays restaurant data from the Just Eat API based on UK postcodes. This application fetches restaurant information based on a user-provided postcode, filters the data and displays it in a clean user-friendly interface.

---

## Features

- **Search for restaurants by UK postcode**
- **Display of key restaurant information:**
  - Name
  - Cuisines
  - Rating (as a number)
  - Address
- **Responsive design** that works on all device sizes
- **Sample postcodes** for quick testing
- **Clean error handling** and loading states

---

## Technologies Used

- **HTML5**
- **CSS3**
- **JavaScript (ES6+)**
- **Node.js**
- **Express.js**

## Prerequisites

To run this project, you'll need:

- [Node.js](https://nodejs.org/) (v14 or later)
- npm

---

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/mxhmoodem/just-eats-restaurant-finder.git
   ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Start the development server:**

    ```bash
    npm start
    ```

4. Open your browser and navigate to http://localhost:3000

---

## Project Structure

restaurant-finder/

├── public/                 
 │   └── index.html         
├── server.js           
├── package.json        
└── README.md   


---

## API Details

The application uses the Just Eat API to fetch restaurant data:

```text
https://uk.api.just-eat.io/discovery/uk/restaurants/enriched/bypostcode/{postcode}
```

---

## Acknowledgments

- **Just Eat API** for providing the restaurant data  
