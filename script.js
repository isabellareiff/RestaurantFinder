function getDataFromApi(){
    var inputElement = document.getElementById('search')
    var value = inputElement.value
    var searchTerm = `${value.replace(" ", "%20")}`
    var api_key = '9a017b0bbf09d1291641ffb6f2238ff5'
    var url = "https://developers.zomato.com/api/v2.1/locations?query="+searchTerm;
    var myHeaders = new Headers()
    myHeaders.append("user-key", api_key)
    var options = {
        headers: myHeaders
    }
    fetch (url, options) // Fetch issues GET requests
    .then ( function(data) {
        return data.json() ;
    })
    .then(function(json){
        console.log(json)
        var lat = json.location_suggestions["0"].latitude;
        var lon = json.location_suggestions["0"].longitude;
        var url2 = "https://developers.zomato.com/api/v2.1/geocode?lat="+lat+"&lon="+lon;
        fetch (url2, options)
        .then (function(data){
            return data.json();
        })
        .then(function (json){
            console.log(json);
            var finalHTML = '';
            var length = json.nearby_restaurants.length;
            if (length > 8){
                length = 8;
            }
            finalHTML +=   `<div class="center-align"><h5>Showing ${length} Results From ${json.location.city_name}</h5></div>
<br>`
                for (var i = 0; i < length; i++){
                    finalHTML +=   `
                    <div class="col s3 m3">    
                      <div class="card medium">
                        <div class="card-image waves-effect waves-block waves-light">
                          <img class="activator" src="${json.nearby_restaurants[i].restaurant.thumb}">
                        </div>
                        <div class="card-content">
                          <span class="card-title activator white-text text-darken-4">${json.nearby_restaurants[i].restaurant.name}<i class="material-icons right">more_vert</i></span>
                        </div>
                        <div class="card-reveal">
                          <span class="card-title grey-text text-darken-4">Rated ${json.nearby_restaurants[i].restaurant.user_rating.aggregate_rating}/5<i class="material-icons right">close</i></span>
                          <p>Based on ${json.nearby_restaurants[i].restaurant.user_rating.votes} votes</p>
                          
                          <span class="card-title grey-text text-darken-4">Cuisine Style</span>
                          <p>${json.nearby_restaurants[i].restaurant.cuisines}</p>
                          
                          <span class="card-title grey-text text-darken-4">Average cost for two people</span>
                          <p>$${json.nearby_restaurants[i].restaurant.average_cost_for_two}</p>
                          
                          <span class="card-title grey-text text-darken-4">Located in</span>
                          <p>${json.nearby_restaurants[i].restaurant.location.locality}</p>
                          
                          <span class="card-title grey-text text-darken-4">Address</span>
                          <p>${json.nearby_restaurants[i].restaurant.location.address}</p>
                        </div>
                        <div class="card-action">
                          <a class = "white-text" href="${json.nearby_restaurants[i].restaurant.menu_url}" target = "_blank">See the full menu</a>
                        </div>
                      </div>
                    </div>`
                }
            var resultDiv = document.getElementById('result')
            resultDiv.innerHTML = finalHTML
            document.getElementById('search').blur();
        })
        .catch(function(error){
            console.log(error);
        })  
    })
    .catch(function(error){
        console.log(error)
    })
}
function clearFields() {
     document.getElementById("search").value = "";
}
