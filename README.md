## Getting Started
First, ensure you have node and mongo installed on your system.

```sh
# clone it
git clone git@github.com:kylealwyn/node-rest-api-boilerplate.git
cd node-rest-api-boilerplate

# Make it your own
rm -rf .git && git init

# Install dependencies
npm install

# Run it
npm start

# Try it!
curl -H "Content-Type: application/json" -X POST -d '{"username":"jamesdean", "email": "example@gmail.com", "password":"password1"}' http://localhost:4567/users
```

## Environment Variables
Your `.env` file can look something like this:

```shell
MONGO_URI=mongodb://somewhere:27017
SESSION_SECRET=lolthisissecret
```

Now we can access one of these variables with something like `process.env.MONGO_URI`!

## NPM Scripts

- **`npm start`** - Start live-reloading development server
- **`npm test`** - Run test suite
- **`npm run test:watch`** - Run test suite with auto-reloading
- **`npm run coverage`** - Generate test coverage
- **`npm run build`** - Generate production ready application in `./build`

## License
MIT
