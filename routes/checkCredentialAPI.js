var express = require("express");
var router = express.Router();
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

//This verifiable credential (VC) verification function is valid for APIv0.1 of SSI bridge. In the later version the request body format is changed
// invoked on post call to the ecstore server on check credential page
router.post("/", async function(req,res,next) {
//	const file = req.files.filename;
  console.log(req.body);
  try {
	  //parse the body into objects
  var credentialParse = await JSON.parse(JSON.stringify(req.body));
  console.log(credentialParse);
  try{
	  	  //parse the body to retrieve the VC from the  request body
	let trim_vcString = await JSON.parse(JSON.stringify(credentialParse.verifiableCredentials))[0];
	let vcString_JSONobj = JSON.stringify(trim_vcString);
		console.log(vcString_JSONobj);
		//check if VC size is not null, if null return error
	if(vcString_JSONobj.length > 0)
	  {
		  //read the ssi bridge url from .env file
		const ssi_bridge_url = process.env.SSI_BRIDGE_URL;
		console.log(ssi_bridge_url);
		console.log("forwarding request to SSI bridge: " + ssi_bridge_url );
		//make a post request to the SSI bridge at URL provided in the .env file and VC as body. 
		/*
		Sample VC format:
        {
            "@context": "https://www.w3.org/2018/credentials/v1",
            "id": "did:iota:fetfQxwcZFbJZNTnw6Xgd7DV2Wu15SpNdXL4oXLGrT3w",
            "type": [
                "VerifiableCredential",
                "BasicIdentityCredential"
            ],
            "credentialSubject": {
                "id": "did:iota:fetfQxwcZFbJZNTnw6Xgd7DV2Wu15SpNdXL4oXLGrT3w",
                "@context": "https://schema.org/",
                "birthDate": "1980-06-21",
                "familyName": "abc",
                "givenName": "def",
                "initiatorId": "did:iota:45hfbok7z6oHdGHVoPSnmXizn18S3Y7VEY4GH7ecsis",
                "name": "abc def",
                "type": "Person"
            },
            "issuer": "did:iota:EDsvfdZqbUTaTHnL6yNGzPzuxTNLuE5VEbz7SndkgYCP",
            "issuanceDate": "2021-06-21T14:46:00Z",
            "proof": {
                "type": "MerkleKeySignature2021",
                "verificationMethod": "#key-collection-0",
                "signatureValue": "EeCDzL3Z6V783bjS8Ja8g4RyMJ1Ug6LYm1gDuQFRQomZ1LDWrHtJjm6AFjqnTEsHQQLnB6YTgjS1HvWcqeo4Y9nFKg6V9BBwyHiXgL7SmpjD6VAmhKPyebSm91kAKhPdgyLkj3jEje4iLQFQpJhkZJT4A9JeXghdirqUgE4mEMZ3zqad9xgj3nqUj7QyGAXWeRuVRb13xQEHskKeWiDU9T4DMbwxU6nwRJtKGS51hsjcbyChvGB4eAW4KdSXgrJpA2FYG86rzgcmjty6pJL6cTWzpq33MzaaXEFxzotT1TjaSYAVcSesPpDaMYrSRyMtBCdoo1f2So9t3Cdgb2fq5zszWGPNZ3AUQJo48eb5jmnKx5TZfzDiLttvf6Psy49U34C34h7T5gJ3DJDFcbbouzrV9kLEZJDdWm1tcRZHZ4iphgckPqftQFkWcF6kYZM1fFyA21PC7YX2oR2L7d7ECUqNsc1yMvFN1xj4UC7UWfCYvf1dge5pVr6q7LgeFpJ4ZvDpjqmRxsse9R1B5rvi4BDEeRgJkQ2LQoyxRULZHZtjCUWAk2MspjDULM4yW.RiJWAUFzAYuxBU3QBGtqVgpWqhT4XktM9RAkPg1rNXxArmCPvbFFz5PuwS12d1hAH5K3vSUwh9GcyPmj44nYChe"
            }
        }
		*/
		axios.post(ssi_bridge_url, vcString_JSONobj, { headers: {
    'content-type': 'application/json'
		}})
	  .then(SSI_res => {
		  console.log(SSI_res.data);
		  let SSI_response = JSON.stringify(JSON.parse(JSON.stringify(SSI_res.data)).isVerified);
		  console.log("response value : " + SSI_response);
		  //If the response from the server { isVerified: true }, then send the response to the client as valid
		if(SSI_response == "true")
		{ console.log("success");
		res.statusCode = 200;
		res.send("valid");
		}
		else {
			//If the response from the server { isVerified: false }, then send the response to the client as BAD_REQUEST with corresponding error message
			res.statusCode = 400;
			res.send("Invalid credential, please upload a valid credential");
			}
	  })
	  .catch(error => {
		console.error(error)
	  }) 
	  }
	  else {
		//If the contents of VC is null, then send the response to the client as BAD_REQUEST with corresponding error message
		res.statusCode = 400;
		res.send("Missing credential information in the uploaded file");
	  }
}
catch(error) {
		//If the VC is not in the required format, then send the response to the client as BAD_REQUEST with corresponding error message
	console.log("Missing credential information in the uploaded file");
	res.statusCode = 400;
	res.send("Missing credential information in the uploaded file");
	}
}
catch(error) {
	//If the VC is not in the required format, then send the response to the client as BAD_REQUEST with corresponding error messag
	console.log("Error parsing JSON input");
	res.statusCode = 400;
	res.send("Expected a JSON file");
}
})
module.exports=router; 