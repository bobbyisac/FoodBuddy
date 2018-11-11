const url = `https://9nfmj2dq1f.execute-api.ap-south-1.amazonaws.com/Development/menu/get-all`;
let speechOutput = "Items on today's menu are : ";

fetch(url) 
.then(function() {
    let responseObj = JSON.parse(body);
	let arindex = responseObj.Menu_ITEMS.length;
	for (i=0;i<arindex;i++) {
		speechOutput = speechOutput + responseObj.Menu_ITEMS[i].ItemName;
		speechOutput = speechOutput + " priced at rupees " + responseObj.Menu_ITEMS[i].Price;
		if (i < (arindex-2)){
			speechOutput = speechOutput + ", ";
		}
		else if (i == arindex-2){
			speechOutput = speechOutput + " and ";
		}
		else if (i == arindex-1){
			speechOutput = speechOutput + ".";
		}
	}
	console.log("speech:",speechOutput);
})
.catch(function() {
    
});