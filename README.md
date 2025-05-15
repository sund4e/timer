Simple online timer, check out [aika.app](https://aika.app/)

TODO:

- CI/CD: run tests, ts compile and lint, deploy only after that
- Revisit eslint.config.js hacks
- Fix editor config to show lint and ts errors
- Add ts errors to lint
- Improved test coverage
- Rewrite notification logic
- Make focus clearer: Increase contrast by darkeining background when focused
- Update text to less lame

---

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (Version 18 or later recommended)
- [Yarn](https://yarnpkg.com/) (Version 1.x)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/sund4e/timer.git
    cd timer
    ```
2.  Install dependencies:
    ```bash
    yarn install
    ```

### Running Locally

To start the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) (or the specified port) in your browser to see the application.

## Running Tests

To run the automated tests for this project:

```bash
yarn test
```

## Linting

To check the code for linting errors:

```bash
yarn lint
```

## Deployment

This project is deployed using [Vercel](https://vercel.com/). Pushes to the `main` branch trigger automatic deployments (though CI/CD improvements are noted in the TODO).

## Built With

- [React](https://reactjs.org/) - JavaScript library for building user interfaces.
- [Next.js](https://nextjs.org/) - React framework for production.
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript.
- [Styled Components](https://styled-components.com/) - For component-level styling.
- [ESLint](https://eslint.org/) - For code linting.
- [Jest](https://jestjs.io/) & [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) - For testing.
