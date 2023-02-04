# Ecommerce Client
Client-side for Ecommerce application, written in TypeScript and React

Deployed version: [https://ecommerce-315d8.web.app/](https://ecommerce-315d8.web.app/)

**NOTE:** Due to the server using a free plan, it is possible for the application to be non-responding (or "frozen") for a few minutes if it has not been used by anyone for some time. Please be patient!

## How to run
```bash
npm install
npm run start
```

to run tests:

```bash
npm run test # this runs all test files in the src folder. Most of those test Redux reducers or utility functions

# OR

npm run test-ct # this runs all tests in the e2e folder

# OR

npm run test-ct-debug # this runs all e2e tests with visualization, good for inspecting what goes on and what went wrong if a test fails
```

By default, the E2E tests have a max timeout of 10 seconds, but this can be configured in ``playwright-ct.config.ts``. Furthermore, the test results are displayed as a list of ticks.

To run the server associated with this app, [Check out the Ecommerce server project](https://github.com/RyotaMitaraiWeb/ecommerce-server) for more information.


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
### ``interfaces.ts``
Exposes interfaces that are intended to be used throughout the application.


### ``themes.ts``
Contains objects and types related to MUI theme configurations.

### ``app/store.ts``
``store.ts`` holds all Redux reducers used in this application. Each reducer / slice is located in the ``features`` folder

### ``app/router``
This folder contains the router configurations.

The ``router.tsx`` file is the main entry point for those routes. It exports a ``Layout`` component, which is rendered via the ``RouterOutlet`` component in ``App.tsx``.

In addition, the router is split across several files for easier maintenance. Currently, the three main categories are:

* ``index`` - includes routes like ``login``, ``/`` and ``register`` that are not subroutes of other categories
* ``product`` - includes all children routes of ``/product``
* ``profile`` - includes all children routes of ``/product``

The 404 route is handled by ``router.tsx`` itself.

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

## Useful components
### Paginator
```typescript
interface IPaginator {
    total: number;
    endpoint: 'search' | 'all' | 'own';
}
```
The paginator component can be used on pages that display a list of products (like search results or a catalogue of all products). The component renders each page button as a hyperlink and also maintains all sort query strings if such are present in the URL.

Each page holds up to six products. If ``total`` is less than ``7``, the paginator won't be displayed

### Sorter
The sorted component can be used on pages that display a list of products (like search results or a catalogue of all products). The component renders a select menu, which manipulates query strings related to sorting the products. It also maintains any ``name`` and ``page`` query strings that may be present in the URL.

By default, the selected option is Name (Ascending). Currently, only name and price can be used to sort the products.

## License
MIT