document.addEventListener('DOMContentLoaded', function () {

    const apiKey = 'fb765688edmsh0b3e45722d81f5bp1c45bfjsncc4561c56f0b';
    const searchInput = document.getElementById('stock-symbol');
    const searchButton = document.getElementById('search-button');
    const searchResultsContainer = document.querySelector('.scrollable-container');
    const resultsContainer = document.getElementById('results-container');
	const resultsTable = document.getElementById('results-table');
	const currentPrice = document.getElementById("current-price");
	const candleStickChart = document.getElementById('candlestick-chart');
	
    searchButton.addEventListener('click', () => {
        const symbol = searchInput.value.trim();

        if (symbol !== '') {
            searchStock(symbol);
        }
    });
	
	searchInput.addEventListener('input', () => {
		const query = searchInput.value.trim().toLowerCase();
		searchStock(query);
	});

    async function searchStock(symbol) {
        // Construct the API URL
        const apiUrl = `https://yahoo-finance15.p.rapidapi.com/api/yahoo/sc/search/${symbol}`;
        const options = {
        	method: 'GET',
        	headers: {
        		'X-RapidAPI-Key': `${apiKey}`,
        		'X-RapidAPI-Host': 'yahoo-finance15.p.rapidapi.com'
        	}
        };

        // Make an API request
        fetch(apiUrl, options)
            .then(response => response.json())
            .then(data => {
				clearResultDropdown();
				currentPrice.innerHTML = '';
				resultsTable.innerHTML = '';
				candleStickChart.innerHtml = '';
				// stop interval if there is any
				if(intervalId){
                    clearInterval(intervalId);
                }
				displayResultsDropdown(data['body']);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
				searchResultsContainer.innerHTML = '';	
                displayError('Error fetching data. Please try again later.');
            });
    }

    function displayError(errorMessage) {
		const resultElement = document.createElement('div');
        resultElement.className = 'search-result';
		resultElement.innerHTML = `<p class="error-message">${errorMessage}</p>`
		searchResultsContainer.appendChild(resultElement);
    }
	
	const resultsDropdown = document.getElementById('results-dropdown');
    let intervalId;
    let stockCompanyName;
	function displayResultsDropdown(results) {
		// Clear previous results
		clearResultDropdown();

		if (results.length === 0) {
			resultsDropdown.style.display = 'none';
			return;
		}

		resultsDropdown.style.display = 'block';
		
		results.forEach(result => {
			const listItem = document.createElement('li');
			listItem.textContent = `${result["symbol"]} - ${result["name"]}`;
			listItem.addEventListener('click', () => {
			    stockCompanyName = `${result["name"]}`;
			    // Get current price
			    currentStockPrice(result["symbol"]);
				// Get weekly stock data
				getWeeklyStockData(result["symbol"]);
			    // Setting interval to update the current price in 10 minutes
			    if(intervalId){
			        clearInterval(intervalId);
			    }
			    if(!intervalId){
			        intervalId = setInterval( function(){currentStockPrice(result["symbol"]);}, 600000);
			    }
			});
			resultsDropdown.appendChild(listItem);
		});
	}
	
	function clearResultDropdown() {
		resultsDropdown.innerHTML = ''; // Clear the HTML content inside the dropdown
	}

	// Hide the dropdown when clicking outside of it
	document.addEventListener('click', (event) => {
		if (!resultsDropdown.contains(event.target) && event.target !== searchInput) {
			resultsDropdown.style.display = 'none';
		}
	});

    function currentStockPrice(symbol){

        // Construct the API URL
        const apiUrl = `https://yahoo-finance15.p.rapidapi.com/api/yahoo/hi/history/${symbol}/5m?diffandsplits=false`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': `${apiKey}`,
                'X-RapidAPI-Host': 'yahoo-finance15.p.rapidapi.com'
            }
        };

        // Make an API request
        fetch(apiUrl, options)
            .then(response => response.json())
            .then(data => {
                displayCurrentStockPrice(data, symbol);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                currentPrice.innerHTML = '';
                displayError('Error fetching data. Please try again later.');
            });
    }

    let currentStock;
    let stockPrice;
    function displayCurrentStockPrice(data, symbol){
        // Clear previous results
        currentPrice.innerHTML = '';

        // Extract weekly stock data
        const currentData = data['items'];

        const price = Object.entries(currentData).pop();
        currentPrice.innerHTML = `${symbol}` + "\t\t\t\tCurrent Price: " + price[1]['close'];

        currentStock = `${symbol}`;
        stockPrice = price[1]['close'];
    }
	
	function getWeeklyStockData(symbol) {
        // Construct the API URL
        const apiUrl = `https://yahoo-finance15.p.rapidapi.com/api/yahoo/hi/history/${symbol}/1d?diffandsplits=false`;
        const options = {
        	method: 'GET',
        	headers: {
        		'X-RapidAPI-Key': `${apiKey}`,
        		'X-RapidAPI-Host': 'yahoo-finance15.p.rapidapi.com'
        	}
        };

        // Make an API request
        fetch(apiUrl, options)
            .then(response => response.json())
            .then(data => {
				displayWeeklyStockData(data, symbol);
				createCandlestickChart(data)
            })
            .catch(error => {
                console.error('Error fetching data:', error);
				searchResultsContainer.innerHTML = '';	
                displayError('Error fetching data. Please try again later.');
            });
    }
	
	function displayWeeklyStockData(data, symbol) {
		// Clear previous results
		searchResultsContainer.innerHTML = '';	
		resultsTable.innerHTML = '';

		// Check if the API returned an error
		if (data['Error Message']) {
			displayError('Stock symbol not found.');
			return;
		}

		// Extract weekly stock data
		const weeklyData = data['items'];

		// Create a table element
		const table = document.createElement('table');
		table.classList.add('stock-table');

		// Create the table header
		const headerRow = document.createElement('tr');
		const headerCell = document.createElement('th');
		headerCell.colSpan = '8';
		headerCell.textContent = `${symbol} Weekly Stock Data`;
		headerRow.appendChild(headerCell);
		table.appendChild(headerRow);

		// Create the table headers for the data columns
		const headerRow2 = document.createElement('tr');
		const headers = ['Date', 'Open', 'High', 'Low', 'Close', 'Volume'];
		headers.forEach(headerText => {
			const headerCell = document.createElement('th');
			headerCell.textContent = headerText;
			headerRow2.appendChild(headerCell);
		});
		table.appendChild(headerRow2);

		// Create the table rows for the weekly data
		Object.entries(weeklyData).slice(-7).forEach(date => {
			const weeklyEntry = date[1];
			const row = document.createElement('tr');
			const rowData = [weeklyEntry['date'], weeklyEntry['open'], weeklyEntry['high'], weeklyEntry['low'], weeklyEntry['close'], weeklyEntry['volume']];
			rowData.forEach(cellText => {
				const cell = document.createElement('td');
				cell.textContent = cellText;
				row.appendChild(cell);
			});
			table.appendChild(row);
		});

		// Append the table to the resultsTable
		resultsTable.appendChild(table);
	}
	
	
	google.charts.load('current', { packages: ['corechart'] });
	google.charts.setOnLoadCallback(createCandlestickChart);
	
	// Create the candlestick chart using Google Charts
	function createCandlestickChart(data) {
		// Extract weekly stock data
		const weeklyData = data['items'];
		
		// Prepare data for the candlestick chart
		var candlestickData = [];
		candlestickData.push(['Date', 'Open', 'High', 'Low', 'Close']);


		Object.entries(weeklyData).slice(-7).forEach(date => {
			const weeklyEntry = date[1];
			const candle = [weeklyEntry['date'], weeklyEntry['open'], weeklyEntry['high'], weeklyEntry['low'], weeklyEntry['close']];
			
			candlestickData.push(candle);
		});
		
		var chartData = google.visualization.arrayToDataTable(candlestickData);

		// Define chart options
		var options = {
			legend: 'none',
			hAxis: {
				title: 'Date',
			},
			vAxis: {
				title: 'Price',
			},
		};

		// Create the candlestick chart
		var chart = new google.visualization.CandlestickChart(candleStickChart);
		chart.draw(chartData, options);
	}

	const decreaseQuantityButton = document.getElementById("decrease-quantity");
    const increaseQuantityButton = document.getElementById("increase-quantity");
    const stockQuantityInput = document.getElementById("stock-quantity");
    const buyButton = document.getElementById("buy-button");

    // Decrease stock quantity when "-" button is clicked
    decreaseQuantityButton.addEventListener("click", function () {
        let quantity = parseInt(stockQuantityInput.value);
        if (quantity > 1) {
            quantity--;
            stockQuantityInput.value = quantity;
        }
    });

    // Increase stock quantity when "+" button is clicked
    increaseQuantityButton.addEventListener("click", function () {
        let quantity = parseInt(stockQuantityInput.value);
        quantity++;
        stockQuantityInput.value = quantity;
    });

    buyButton.addEventListener('click', () => {
        const cookie = getCookies();
        const token = cookie['token'];

        // Construct the API URL
        const apiUrl = `http://localhost:8080/buy`;
        const options = {
            method: 'POST',
            body: JSON.stringify({
                  symbol: currentStock,
                  companyName: stockCompanyName,
                  quantity: stockQuantityInput.value,
                  price: stockPrice
              }),
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        };

        // Make an API request
        fetch(apiUrl, options)
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    });

    function getCookies() {
        let cookies = document.cookie.split(';').reduce(
            (cookies, cookie) => {
                const [name, val] = cookie.split('=').map(c => c.trim());
                cookies[name] = val;
                return cookies;
            }, {});
        return cookies;
    }

});