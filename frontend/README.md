# School Manager - Frontend

The frontend is built with [Solid Website](https://solidjs.com), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/) and [TailwindCSS](https://tailwindcss.com)

## Frontend development
Ensure that you have Node and node package manager on your system.

- Within the `frontend` directory, install the necessary NPM packages:
  ```
    npm install
  ```
- And start the live server with the following `npm` script:
  ```
    npm run dev
  ```
- Then open your browser at `http://localhost:5173/`

## Generate Client 
- Download the OpenAPI JSON file from `http://127.0.0.1:8000/api/openapi.json` and copy it to a new file `openapi.json` at the root of the `frontend` directory.

- To simplify the names in the generated frontend client code, modify the `openapi.json` file by running the following script:
```
  node modify-openapi-operationids.js
```

- To generate the frontend client, run:
```
  npm run generate-client
```

- Commit the changes.

`Note: ` that everytime the `backend` changes (changing the OpenAPI schema), you should follow these steps again to update the `frontend` client.
