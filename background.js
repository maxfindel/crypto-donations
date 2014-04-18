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
		// If there is a string to replace, we go ahead. 140 is just a good max-length
		if(full_str&&full_str.length>0&&full_str.length<140){
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
				new_div = $(new_div).attr('style', 'position: relative')
				last.html(last.html().replace(full_str, new_div[0].outerHTML))
			}
		}
	}
	i++;
}
// Now we generate the link or later a widget
$('.crypto-donations').each(function(){
	link = "<a class='crypto-donations-btn' />"
	//Add the TwitterBootstrap .btn.btn-default.btn-xs css 
	$(this).attr('style', 'display: inline-block;margin-bottom: 0;font-weight: 400;text-align: center;vertical-align: middle;cursor: pointer;background-image: none;border: 1px solid transparent;white-space: nowrap;padding: 1px 5px;font-size: 12px;line-height: 1.5;border-radius: 3px;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;color: #333;background-color: #fff;border-color: #ccc;');
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
	text = ' Tip '+(amount!="0" ? ' '+amount+' ' : '')+currency
	link = $(link).text(text)
	// we create a default img with the add-on icon
	img = "<img/>"
	img = $(img).attr('src', 'https://lh4.googleusercontent.com/qNP0k3Q69mNaeD36pWFJrC5WbRQVTkN_c4NVDR8WGQeFgqpKoZIrfIHYudC6BeOI83UpsdbV=s128-h128-e365')
	img = $(img).attr('style', 'height: 15px;margin-top: -5px;')
	link = $(link).prepend(img)
	$(this).append(link)
})
// Now we setup the events
$('.crypto-donations').click(function(event){
	console.log('click')
	event.stopPropagation();
	// We fire up the QT if clicked with the CDM or Ctrl btn pressed
	if(!event.ctrlKey&&!event.metaKey){
		event.preventDefault();
	}
	else{
		return;
	}
	// We remove all opened popups
	if($(this).children('.crypto-donations-popup').length==0){
		$('.crypto-donations-popup').remove()
		// We create a new popup and append it to the button
		popup = "<div class='crypto-donations-popup' />"
		popup = $(popup).attr('style','position: absolute; width: auto; min-width: 250px; height: 50px; background: white;border: 1px solid #ccc; padding: 5px;z-index: 100;')
		// Now we add the fun part to the box
		// The x to close
		x = "<div class='crypto-donations-x' />"
		x = $(x).attr('style','float: right; font-weight: bold; font-size: 15px;margin-top: -5px;')
		x = $(x).text('x');
		$(popup).append(x)
		// The top tile
		title = "<div class='crypto-donations-title' />"
		title = $(title).attr('style','text-align: left;font-weight: bold;font-size: 13px;')
		title = $(title).text($(this).children('.crypto-donations-btn').text()+':')
		$(popup).append(title)
		// The input field to copy and the link to the wallet
		input_holder = "<div class='crypto-donations-input-holder' />"
		input = "<input type='text' class='crypto-donations-input' />"
		input = $(input).attr('style','width: 70%; float: left; display: inline-block;height: 20px;padding: 4px 6px;margin-bottom: 10px;font-size: 14px;line-height: 20px;color: #555555;-webkit-border-radius: 4px;-moz-border-radius: 4px;border-radius: 4px;vertical-align: middle;')
		input = $(input).attr('value',$(this).attr('address'))
		input_holder = $(input_holder).append(input)
		wallet_link = "<a class='crypto-donations-wallet-link' />"
		wallet_link = $(wallet_link).attr('style','29%; float: left; line-height: 30px;padding-left: 5px;')
		wallet_link = $(wallet_link).text('Wallet ->')
		wallet_link = $(wallet_link).attr('target', '_blank')
		wallet_link = $(wallet_link).attr('href', $(this).children('.crypto-donations-btn').attr('href'))
		input_holder = $(input_holder).append(wallet_link)
		$(popup).append(input_holder)

		$(this).append(popup)
		linkClose()
	}
})

// Closes the popup if anywhere but the button is clicked
function linkClose(){
	$(document).unbind('click')
	$(document).bind('click',function(event){
		$('.crypto-donations-popup').remove()
	})
	$('.crypto-donations-x').click(function(event){
		$('.crypto-donations-popup').remove()
		event.stopPropagation();
	})
	$('.crypto-donations-input').click(function(event){
		$(this).select();
	})
	$('.crypto-donations-wallet-link').click(function(event){
		window.open($(this).attr('href'));
	})
}
linkClose()



