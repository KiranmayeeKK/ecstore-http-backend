# ECStore Application
## An ecommerce application  with React frontend and NodeJS backend. To use this application, download the https://github.com/KiranmayeeKK/ecstore-http-frontend.git

## Configuration
1. Create .env file in the ecs_server folder
2. In ecs_server/.env file initialize the following variables
PORT, SSI_BRIDGE_URL
3. Update api.js to allow cors origin variable. set it to the frontend domain name 

## Runninng the applications
use `npm install` and `npm start` commands to run the applications

## Checking the functionality
1. Open `http://ecstore.com:3000` (to use a domain name, add it to the hosts file of the system 127.0.0.1	ecstore.com
::1	ecstore.com) or `http:\\localhost:3000` in the web / mobile browser
2. Select the items and add them to cart
3. Click on cart to view the items added to cart
4. If any of the added items are adult products, it asks for credential
5. Upload `credential.json` file (received from the bank) and click upload button
6. On Upload, the request is sent to backend server where it checks its validity with the Ecommerce SSI bridge 
7. On successful verification, the `proceed to checkout` button is enabled which when clicked redirects to payment page
8. If credential verification is unsuccessful, corresponding error message is displayed to the front end like `Invalid credential, please upload a valid credential`
