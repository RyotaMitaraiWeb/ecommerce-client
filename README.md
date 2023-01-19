# Ecommerce Client
Client-side for Ecommerce application, written in TypeScript and React

## How to run
```bash
npm install
npm run start
```

to run tests:

```bash
npm run test
```

To run the server associated with this app, [https://github.com/RyotaMitaraiWeb/ecommerce-server](check out Ecommerce server) for more information.


## Environment variables
This app uses environment variables that are not exposed in this repository. To recreate those for your own purposes, you need an ``environment`` folder within the ``src`` folder. Create ``env.development.ts`` and ``env.production.ts`` inside ``environment`` and populate each of them with an object akin to this one:

```typescript
export const environment = {
    api: 'http://addresstoyourserver',
    // + other properties you may want to add
};
```

You can use Create React App's ``NODENV`` variable to conditionally use each environment's properties, depending on whether the application is running in production or development stage.

## App structure

### ``router.tsx``
Contains the route configurations and exports a Layout component that properly displays the outlet between the header and footer.

### ``themes.ts``
Contains objects and types related to MUI theme configurations.

### ``app/store.ts``
``store.ts`` holds all Redux reducers used in this application. Each reducer / slice is located in the ``features`` folder

### ``features``
This folder contains Redux reducers/slices and any associated components (for example, the snackbar component is directly tied to its reducer, so it is located there).

### ``util``
This folder contains various utility functions that make certain tasks easier

#### ``requests``
``requests.ts`` contains a function to easily make requests to the Ecommerce server. In order to use the function, you can use one of its exported variants: ``get``, ``post``, ``put``, and ``delete``, depending on the request method.

``redirect.ts`` contains a function that redirects the user to the appropriate pages when the server returns a 403 or 404 error. The ``redirectViaStatus`` function should only be used within a ``loader`` property of the ``router`` object.

#### ``test-utils``
This folder contains utility functions to make testing easier. It exports all of React Testing Library's functions and objects, alongside a custom render function to load all necessary providers.

#### ``dispatchOutsideOfComponent.ts``
This function should be used when you need to dispatch an action outside of a component.

#### ``httpstatus.enum.ts``
The HttpStatus enum provides an easy-to-use interface for status codes. This enum holds only status codes that have been used in the application at least once.

## License
MIT