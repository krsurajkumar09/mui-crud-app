# MUI CRUD App

A React-based CRUD (Create, Read, Update, Delete) application built with TypeScript, Vite, and Material-UI (MUI). This app demonstrates full CRUD operations on posts using the JSONPlaceholder API.

## Features

- **View Posts**: Display a list of posts fetched from JSONPlaceholder API
- **Create Posts**: Add new posts with title and body
- **Update Posts**: Edit existing posts inline
- **Delete Posts**: Remove posts from the list
- **Search Functionality**: Search posts by ID or title
- **Responsive Design**: Built with Material-UI for a clean, responsive interface
- **TypeScript**: Full type safety throughout the application
- **Real-time Updates**: Immediate UI updates after CRUD operations

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Material-UI (MUI)** - Component library
- **JSONPlaceholder** - Mock REST API for testing

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd mui-crud-app
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview the production build locally

## API Integration

This app uses [JSONPlaceholder](https://jsonplaceholder.typicode.com/) as a mock REST API. The following endpoints are utilized:

- `GET /posts?_limit=10` - Fetch initial posts
- `POST /posts` - Create a new post
- `PUT /posts/:id` - Update an existing post
- `DELETE /posts/:id` - Delete a post
- `GET /posts/:id` - Fetch a specific post by ID

**Note**: JSONPlaceholder is a fake API for testing and prototyping. All CRUD operations are simulated and won't persist data.

## Project Structure

```
src/
├── App.tsx          # Main application component
├── main.tsx         # Application entry point
├── index.css        # Global styles
└── assets/          # Static assets
```

## Development

This project uses Vite for fast development and building. The app is configured with:

- **ESLint** for code linting
- **TypeScript** for type checking
- **Material-UI** theme provider for consistent styling

## Expanding the ESLint Configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

## License

This project is for educational purposes and demonstration of CRUD operations with React and Material-UI.
