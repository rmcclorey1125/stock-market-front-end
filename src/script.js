document.addEventListener("DOMContentLoaded", function(e){
    const stocksUrl = "http://localhost:3000/api/v1/stocks"
    const stockCollection = document.querySelector("#stock-collection")
    const navBarUl = document.querySelector('.navBarUl')
    const searchInput = document.getElementById("search-input")
  
    let userName = ""
    let userPassword = ""
  
    document.addEventListener("click", function(e){
      e.preventDefault()
  
      if (e.target.id === "onTheMoveNav"){
        stockCollection.innerHTML = ""
        stockCollection.setAttribute("id", "onTheMove")
        getStocks()
  
      } else if (e.target.textContent === "Sign up"){
  
        renderForm("signUp")
  
      } else if (e.target.textContent === "Log in"){
  
         renderForm("logIn")
  
      } else if (e.target.id === "searchButton"){
  
        e.preventDefault()
         getStock(searchInput.value)
  
      } else if (e.target.className === "show-info"){
        const stockDiv = e.target.parentNode
        const stockData = e.target.parentNode.dataset
        // console.log(stockData)
        const moreInfo = document.createElement('div')
  
        moreInfo.className = "more-info"
          e.target.textContent = "Hide Market Data"
  
        // newsArray = stockData.news.split("#<IEX::Resources::News ")
        //   newsArray.shift()
        //   newsArray.forEach(i => {
        //     i.slice(1, -3)
        //     let keyVal = i.split("=");
        //     obj = { }
        //     obj["date"] = keyVal[1].slice(0, -9)
        //     obj["headline"] = keyVal[2].slice(1, -1)
        //     obj["body"] = keyVal[5].slice(1, -5)
        //     obj["src"] = keyVal[6].slice(1, -8)
  
        //      li = document.createElement('li')
        //      li.innerHTML =
        //        `<h3>${obj.headline}</h3><br>
        //          <p>${obj.body}<br>source: ${obj.src}</p><br>
        //         `
        //          stockNewsUl.append(li)
        //   })
  
        moreInfo.innerHTML = `
          <p>Latest price: ${stockData.latest_price}</p>
          <p>Total volume: ${stockData.avg_total_volume}</p>
          <p>Change percent: ${stockData.change_percent}</p>
          <p>Latest update: ${stockData.latest_update}</p>
          <p>Market cap: ${stockData.market_cap}</p>
          <p>P/E ratio: ${stockData.pe_ratio}</p>
          <p>Primary exchange: ${stockData.primary_exchange}</p>
          <p>Symbol: ${stockData.symbol}</p>
          <p>YTD change: ${stockData.ytd_change}</p>
        `
        // moreInfo.append(stockNewsUl)
        stockDiv.append(moreInfo)
  
        // stockDiv.append(stockNewsUl)
        e.target.className = "hide-info"
        e.target.textContent = "Hide Market Data"
        if (stockCollection.id !== "myStocks"){
          button = document.createElement("button")
          button.setAttribute("type", "submit")
          button.setAttribute("id", "trackButton")
          button.textContent = "Start Tracking"
          moreInfo.append(button)
        }
        //  console.log(stockCollection.id)
  
      // console.log(stockDiv.childNodes[6])
  
      } else if (e.target.className === "hide-info"){
  
        const moreInfo = document.querySelector(".more-info")
        moreInfo.remove()
        e.target.className = "show-info"
        e.target.textContent = "View Market Data"
  
      } else if (e.target.id === "signUp") {
        userName = e.target.parentNode.childNodes[3][0].value
        userPassword = e.target.parentNode.childNodes[3][1].value
             signUp(userName, userPassword)
  
      } else if (e.target.id === "myStocks") {
        // console.log(e.target.parentNode.childNodes)
  
         let stockObj = {}
         let x = []
        stockObj[`"user_name"`] = userName
        fetch(`http://localhost:3000/api/v1/user_stocks/${userName}`,{
        headers: {
        'Content-Type' : 'application/json'
          },
        })
        .then(response => response.json())
        .then(data => {
              // console.log('Success:', data);
              stockCollection.innerHTML = ""
              data.forEach(i => {
                getUserStock(i["symbol"])
                // console.log(i["symbol"])
                x.push(i)
              });
  
         })
        .catch((error) => {
         console.error('Error:', error);
        })
        // console.log(x)
  
      } else if (e.target.id === "logOut") {
  
        logOut(userName)
  
      } else if (e.target.id === "logIn") {
        e.preventDefault()
              userName = e.target.parentNode.childNodes[3][0].value
              userPassword = e.target.parentNode.childNodes[3][1].value
        setSession(userName, userPassword)
  
      } else if (e.target.id === "trackButton") {
                  e.target.textContent = "Stop Tracking"
                  tracker(e)
  
      } else if (e.target.id === "searchtrackButton") {
          e.target.textContent = "Stop Tracking"
              searchtracker(e)
      } 
    })
  
  function renderNews(newsArray){
    const stockNewsUl = document.createElement('ul')
    stockNewsUl.setAttribute("class", "newsUl")
    newsArray.forEach(i => {
      // console.log("THIS", i)
      newsDiv = document.createElement("div");
      newsImg = document.createElement("img");
      newsImg.src = i.image
      newsImg.setAttribute("class", "news-img")
      newsDiv.setAttribute("class", "news-div")
      // newsImg.style.width = '50%';
      newsDiv.innerHTML = `
      <li class="newsLi">
        <a href="${i.url}">${i.headline}</a>
        <br>
        <p>${i.summary}</p>
      </li>`
  
     stockNewsUl.append(newsImg)
     stockNewsUl.append(newsDiv)
      // console.log(stockNewsUl)
    });
    return stockNewsUl;
  }
  
  function logOut(userName){
    fetch("http://localhost:3000/api/v1/sessions",{
    method: "DELETE",
    headers: {
    'Content-Type' : 'application/json'
      },
    body: JSON.stringify({
      "name": userName,
      "password": userPassword
    })
  })
   .then(response => response.json())
   .then(data => {
    //  console.log(data);
       if(data[0] === "wrong password or username"){
         renderForm("signIn")
         form = document.querySelector(".form")
         form.innerHTML += `<br><h3style="text-align:center">${data[0]}<h3>`
       } else {
        //  console.log('Success:', data);
          location.reload();
       }
     })
   .catch((error) => {
     console.error('Error:', error);
   })
  
  }
  
  function searchtracker(e){
          let stockObj = {}
           let x = []
           symbol = e.target.parentNode.childNodes[34].textContent
          //  console.log("TRACK", e.target.parentNode.childNodes[34].textContent)
          stockObj[`"symbol"`] = symbol
          stockObj[`"user_name"`] = userName
          console.log("BEING SENT", stockObj)
          
          fetch("http://localhost:3000/api/v1/user_stocks", {
          method: "POST",
          headers: {
          'Content-Type' : 'application/json'
            },
          body: JSON.stringify({
               stockObj
          })
        })
         .then(response => response.json())
         .then(data => {
                console.log('Success:', data);
                if (data.message) {
                 x.push(data.message)
               } else {
                data.forEach(i => {
                  getStock(i["symbol"])
                  // console.log(i["symbol"])
                });
              }
              stockCollection.childNodes[0].prepend(x[0])
           })
         .catch((error) => {
           console.error('Error:', error);
         })
  
     }
  
  function tracker(e){
          // console.log(e.path[4])
          const stockDataArray = e.target.parentNode.parentNode.id
  
        //   console.log("ETARGET", e.target.parentNode.parentNode.id)
           let stockObj = {}
           let x = []
          stockObj[`"symbol"`] = stockDataArray[1]
          stockObj[`"user_name"`] = userName
          // console.log("YAY", stockObj)
  
          fetch("http://localhost:3000/api/v1/user_stocks",{
          method: "POST",
          headers: {
          'Content-Type' : 'application/json'
            },
          body: JSON.stringify({
               stockObj
          })
        })
         .then(response => response.json())
         .then(data => {
                // console.log('Success:', data);
                stockCollection.innerHTML = ""
                data.forEach(i => {
                  getStock(i["symbol"])
                  // console.log(i["symbol"])
                  x.push(data)
                });
           stockCollection.innerHTML += x[0].message
           })
         .catch((error) => {
           console.error('Error:', error);
         })
        // console.log(x)
     }
  
  // function stopTracker(e) {
  
  // }
  
  function signUp(userName, userPassword){
    fetch("http://localhost:3000/api/v1/users",{
    method: "POST",
    headers: {
    'Content-Type' : 'application/json'
      },
    body: JSON.stringify({
      "name": userName,
      "password": userPassword
    })
  })
   .then(response => response.json())
   .then(data => {
    //  console.log(data);
     errors = []
       if(Array.isArray(data)){
         renderForm("signUp")
         form = document.querySelector(".form")
          data.forEach(e => {
            // console.log(e)
            errors.push(" " + e)
          });
         form.innerHTML += errors
       } else {
        //  console.log('Success:', data);
         setSession(userName, userPassword)
       }
     })
   .catch((error) => {
     console.error('Error:', error);
   })
  }
  
  function setSession(userName, userPassword){
    fetch("http://localhost:3000/api/v1/sessions",{
    method: "POST",
    headers: {
    'Content-Type' : 'application/json'
      },
    body: JSON.stringify({
      "name": userName,
      "password": userPassword
    })
  })
   .then(response => response.json())
   .then(data => {
     // console.log('Success:', data);
       if(data[0] === "wrong password or username"){
         renderForm("signIn")
         form = document.querySelector(".form")
         form.innerHTML += `<br><h3style="text-align:center">${data[0]}<h3>`
       } else {
        //  console.log('Success:', data);
  
         renderUserPage(userName, data)
       }
     })
   .catch((error) => {
     console.error('Error:', error);
   })
  
  }
  
  // function getUser(){
  //    user = {}
  //    stockCollection.innerHTML = ""
  //    const userStocksUrl = `http://localhost:3000/api/v1/users/${userName}`
  //    fetch(userStocksUrl)
  //    .then(response => response)
  //    .then(data => {
  //      console.log(data)
  //      stockCollection.innerHTML = ""
  //      data.forEach(i => {
  //        getStock(i["symbol"])
  //      })
  //    })
  //  }
  
  function renderUserPage(userName, userStocks){
    //  console.log(userName)
    //  console.log(userStocks.length)
     stockCollection.innerHTML = `<h1 style="color:#f8cf26">Welcome ${userName}!<h1>`
     stockCollection.setAttribute("id", "myStocks")
  
     const myStocks = document.createElement("li")
     const logOut = document.createElement("li")
  
     const signUp = document.getElementById('signUp')
     const logIn = document.getElementById('logIn')
     const onTheMove = document.getElementById("onTheMoveNav")
  
     myStocks.setAttribute("id", "myStocks")
     myStocks.innerHTML = "My Stocks"
  
     logOut.setAttribute("id", "logOut")
     logOut.innerHTML = "Log Out"
  
     navBarUl.removeChild(signUp)
     navBarUl.removeChild(logIn)
     navBarUl.removeChild(onTheMove)
  
     navBarUl.prepend(logOut)
     navBarUl.prepend(onTheMove)
     navBarUl.prepend(myStocks)
      renderUserStocks(userStocks)
  
  }
  
  function renderForm(s){
        e.preventDefault()
  
        stockCollection.innerHTML = ""
        signUpdiv = document.createElement("div")
        button = document.createElement("button")
        button.setAttribute("type", "submit")
        button.setAttribute("id", `${s}`)
        button.textContent = "go"
        signUpdiv.setAttribute("class", "form")
        signUpdiv.innerHTML= `
         <h1>ENTER</h1>
         <form class="form" action="index.html" method="post">
            <label for="user-name-input">Username:</label>
           <input type="text" id="user-name-input" name="user-name-input">
  
           <label for="user-password-input">Password:</label>
          <input type="password" id="user-password-input" name="user-password-input">
         </form>
  `
        signUpdiv.append(button)
        stockCollection.append(signUpdiv)
      }
  
  function getStock(stockSymbol){
        const stockUrl = `https://cloud.iexapis.com/stable/stock/${stockSymbol}/batch?types=quote,news,logo&range=1m&last=10&token=pk_f57a13c9af324593872971b36ca28c8c`
        fetch(stockUrl)
        .then(response => response.json())
        .then(data => {
          // console.log("Stock search", data)
          renderSearch(data)
       })
  
       fetch("http://localhost:3000/api/v1/stocks", {
        method: "POST",
        headers: {
        'Content-Type' : 'application/json'
          },
        body: JSON.stringify({
             symbol: stockSymbol
        })
      })
       .then(response => response.json())
       .then(data => {
              // console.log('Success:', data);
       })
      
  }
  
  function renderSearch(stock){
    stockCollection.innerHTML = ""
  
     let searchImg = document.createElement('img')
      let stockDiv = document.createElement('div')
      let userStocksUl = document.createElement('ul')
          // setStockImage(stock.quote.symbol)
       searchImg.setAttribute("class", "company_logo")
       searchImg.src = stock.logo.url
        //  console.log(searchImg)
        stockDiv.setAttribute("class", "each-stock")
        stockDiv.innerHTML = `
        <h1>${stock.quote.companyName}</h1><br>
        <b>Latest Price: </b>${stock.quote.latestPrice}<br>
        <b>Avg Total Volume: </b>${stock.quote.avgTotalVolume}<br>
        <b>Change Percent: </b>${stock.quote.changePercent}<br>
        <b>Latest Update: </b>${stock.quote.latestTime}<br>
        <b>Market Cap: </b>${stock.quote.marketCap}<br>
        <b>PE Ratio: </b>${stock.quote.peRatio}<br>
        <b>Primary Exchange: </b> ${stock.quote.primaryExchange}<br>
        <b>Symbol: </b>${stock.quote.symbol}<br>
        <b>Week 52 High: </b>${stock.quote.week52High}<br>
        <b>Week 52 Low: </b>${stock.quote.week52Low}<br>
        <b>YTD Change: </b>${stock.quote.ytdChange}<br>
        `
        stockDiv.prepend(searchImg)
        userStocksUl.append(stockDiv)
        stockCollection.append(userStocksUl)
        button = document.createElement("button")
        button.setAttribute("type", "submit")
        button.setAttribute("id", "searchtrackButton")
        button.textContent = "Start Tracking"
        button.addEventListener("click", function(e){
            searchtracker(e)
        });
        stockDiv.append(button)
    }
  
  function getUserStock(stockSymbol){
  
           const stockUrl = `https://cloud.iexapis.com/stable/stock/${stockSymbol}/batch?types=quote,news,logo&range=1m&last=10&token=pk_f57a13c9af324593872971b36ca28c8c`
           fetch(stockUrl)
           .then(response => response.json())
           .then(data => {
            //  console.log(data)
             renderUserStocks(data)
          })
         }
  
  function renderUserStocks(stock){
          let searchImg = document.createElement('img')
           let stockDiv = document.createElement('div')
           let userStocksUl = document.createElement('ul')
              //  setStockImage(stock.quote.symbol)
            searchImg.setAttribute("class", "company_logo")
            searchImg.src = stock.logo.url
              // console.log("STOCK NEWS", stock.news)
             stockDiv.setAttribute("class", "each-stock")
             stockDiv.innerHTML = `
             <h1>${stock.quote.companyName}</h1><br>
             <b>Latest Price:</b> ${stock.quote.latestPrice}<br>
             <b>Avg Total Volume:</b> ${stock.quote.avgTotalVolume}<br>
             <b>Change Percent:</b> ${stock.quote.changePercent}<br>
             <b>Latest Update:</b> ${stock.quote.latestTime}<br>
             <b>Market Cap:</b> ${stock.quote.marketCap}<br>
             <b>PE Ratio:</b> ${stock.quote.peRatio}<br>
             <b>Primary Exchange:</b> ${stock.quote.primaryExchange}<br>
             <b>Symbol:</b> ${stock.quote.symbol}<br>
             <b>Week 52 High:</b> ${stock.quote.week52High}<br>
             <b>Week 52 Low:</b> ${stock.quote.week52Low}<br>
             <b>YTD Change:</b> ${stock.quote.ytdChange}<br>
             <b>News:</b><br>
             `
  
            //  button = document.createElement("button")
            //  button.setAttribute("type", "submit")
            //  button.setAttribute("id", "stop-track")
            //  button.textContent = "Stop Tracking"
            //  stockDiv.append(button)
  
             news = renderNews(stock.news.slice(0, 3))
             stockDiv.prepend(searchImg)
             stockDiv.append(news)
             userStocksUl.append(stockDiv)
             stockCollection.append(userStocksUl)
         }
  
  // function setStockImage(stockSymbol){
  //   let stock = document.getElementById(`${stockSymbol}`)
  //   let stockImg = document.createElement('img')
  //       fetch(`http://localhost:3000/api/v1/stocks/${stockSymbol}`)
  //        .then(response => response)
  //        .then(data => {
  //           stockImg.src = data.url
  //           stock.prepend(stockImg)
  //        })
  
  //     }
  
  function getStocks()
      {fetch(stocksUrl)
      .then(response => response.json())
      .then(data => {
          renderStocks(data)
      })
    }
  
  function renderStocks(stocks){
    //  console.log(stocks)
     if(Array.isArray(stocks)){
       stocks.forEach(stock =>{
            renderStock(stock)
      })
     } else {
      alert("You are not tracking any stocks.")
     }
    }
  
  function renderStock(stock){
      const stockDiv = document.createElement('div')
      button = document.createElement("button")
      button.setAttribute("type", "submit")
      button.setAttribute("id", `${stock.symbol}`)
      button.textContent = "View Market Data"
        // stockImg.src = img.url
        // stockNewsUl.className = "stock-news"
      // stockImg.src = stock.logo_url
      // stockImg.setAttribute("class", "company_logo")
  
      stockDiv.innerHTML = `
      <h1>${stock.company_name}</h1><br>
      <button class="show-info">View Market Data</button>
      `
      stockDiv.className = "each-stock"
      stockDiv.dataset.avg_total_volume = `${stock.avg_total_volume}`
      stockDiv.dataset.change_percent = `${stock.change_percent}`
      stockDiv.dataset.latest_price = `${stock.latest_price}`
      stockDiv.dataset.latest_update = `${stock.latest_update}`
      stockDiv.dataset.market_cap = `${stock.market_cap}`
      stockDiv.dataset.pe_ratio = `${stock.pe_ratio}`
      stockDiv.dataset.primary_exchange = `${stock.primary_exchange}`
      stockDiv.dataset.symbol = `${stock.symbol}`
      stockDiv.dataset.ytd_change = `${stock.ytd_change}`
      stockDiv.dataset.news = `${stock.news}`
      stockDiv.setAttribute(`id`, `${stock.symbol}`)
      // stockDiv.prepend(stockImg)
          // stockDiv.append(stockNewsUl)
  
  
          stockCollection.append(stockDiv)
          // setStockImage(stock.symbol)
  
      }
  
  })
  
  
  // else if (e.target.textContent === "Stop Tracking") {
  //   stopTracker(e) 