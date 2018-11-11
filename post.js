function formatDate(date) {
	var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	var day = date.getDate();
	var monthIndex = date.getMonth();
	var year = date.getFullYear();
	return day + '-' + monthNames[monthIndex] + '-' + year.toString().slice(2,4);
}

let a=formatDate(new Date());
console.log(a);