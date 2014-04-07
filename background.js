// Example sytax: #DONATE#[DOGE][DP875D1fhq76trrZ9dxvt5tjQjKEB4FXVg](100)|
var search_criteria = "#DONATE#";
var end_criteria = "|";
var i = 0;
var last = true;
// The limit is set to 100 so it doesn't get into any loops by chance
while(last==true||(i<100&&last&&last.html())){
	last = $('*:contains("'+search_criteria+'")').last()
	if(last&&last.html()){
		// We get the full string to replace
		start = last.html().indexOf(search_criteria)
		end = last.html().indexOf(end_criteria, start)
		full_str = last.html().substr(start, (end+end_criteria.length))
		// If there is a string to replace, we go ahead. 100 is just a safe length
		if(full_str&&full_str.length>0&&full_str.length<100){
			// We find the currency, address and amount
			str = full_str
			currency_init = str.indexOf("[")
			currency_end = str.indexOf("]", currency_init)
			currency = str.substr(currency_init+1, currency_end-currency_init-1)
			str = str.substr(currency_end+1, str.length)
			address_init = str.indexOf("[")
			address_end = str.indexOf("]", address_init)
			address = str.substr(address_init+1, address_end-address_init-1)
			str = str.substr(address_end+1, str.length)
			amount = 0
			amount_init = str.indexOf("(")
			if(amount_init!=-1){
				amount_end = str.indexOf(")", amount_init)
				amount = str.substr(amount_init+1, amount_end-amount_init-1)
				str = str.substr(currency_end+1, str.length)
			}
			// Now we create the div with the corresponding data
			if(currency.length>0&&address.length>0){
				new_div = "<div class='crypto-donations' id='crypto-donations-"+i+"'>"
				new_div = $(new_div).attr('currency', currency)
				new_div = $(new_div).attr('address', address)
				new_div = $(new_div).attr('amount', amount)
				last.html(last.html().replace(full_str, new_div[0].outerHTML))
			}
		}
	}
	i++;
}
// Now we generate the link or later a widget
$('.crypto-donations').each(function(){
	link = "<a>"
	currency = $(this).attr('currency')
	if(currency=="BTC"){
		link = $(link).attr('href', 'bitcoin:')
	}
	else if(currency=="DOGE"){
		link = $(link).attr('href', 'dogecoin:')
	}
	link = $(link).attr('href', $(link).attr('href')+$(this).attr('address'))
	amount = $(this).attr('amount')
	if(amount!="0"){
		link = $(link).attr('href', $(link).attr('href')+'?amount='+amount)
	}
	link = $(link).attr('target', '_blank')
	text = '+ Tip '+(amount!="0" ? ' '+amount+' ' : '')+currency
	link = $(link).text(text)
	$(this).append(link)
})


