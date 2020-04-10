var map;
var markers = [];
var infoWindow;

function initMap() {
    var losAngeles = {
        lat: 34.063380,
        lng: -118.358080        // lat:  40.177200, lng:  44.503490
    };

    map = new google.maps.Map(document.getElementById('map'), {
        center: losAngeles,
        zoom: 11,
        mapTypeId: 'roadmap',
    });
    infoWindow = new google.maps.InfoWindow();
    searchStore()
}

function searchStore() {
    var foundStores = [];
    var zipCode = document.getElementById("zip-code-input").value;
    if (zipCode){
        for (let store of stores) {
            var postal = store["address"]["postalCode"].substring(0,5);
            if (postal === zipCode) {
                foundStores.push(store)
            }
        }
    } else {
        foundStores = stores;
    }
    clearLocations();
    displayStores(foundStores);
    showStoresMark(foundStores);
    setOnClickListener()
}

function clearLocations() {
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers.length = 0;
}

function setOnClickListener() {
    var storeElements = document.querySelectorAll(".store-container");
    storeElements.forEach(function (elem,index) {
        elem.addEventListener("click", function () {
            google.maps.event.trigger(markers[index], 'click');
        })
    });
}

//stores-list add store-container
function displayStores(stores) {
    var storesHtml = "";
    for (let [index, store] of stores.entries()){
        storesHtml +=`
                <div class="store-container">
                    <div class="store-info-container">
                        <div class="store-address">
                            <span>${store.addressLines[0]}</span>
                            <span>${store.addressLines[1]}</span>
                        </div>
                        <div class="store-phone-number">
                            ${store.phoneNumber}
                        </div>
                    </div>
                    <div class="store-number-container">
                        <div class="store-number">
                            ${index+1}
                        </div>
                    </div>
                </div>
                <hr>
        `;
        document.querySelector(".stores-list").innerHTML = storesHtml;
    }
}

function showStoresMark(stores) {
    var bounds = new google.maps.LatLngBounds();
    for (var [index, store] of stores.entries()){
        var latlng = new google.maps.LatLng(
            store["coordinates"]["latitude"],
            store["coordinates"]["longitude"],
        );
        let name = store["name"];
        let address = store["addressLines"][0];
        var openStatusText = store["openStatusText"];
        var phoneNumber = store["phoneNumber"];
        bounds.extend(latlng);
        createMarker(latlng, name, address, openStatusText , phoneNumber, index+1)
    }
    map.fitBounds(bounds);
}

function createMarker(latlng, name, address, openStatusText, phoneNumber, index) {
    var html =`
        <div class="store-info-window">
            <div class="store-info-name">
                ${name}
            </div>
            <div class="store-info-status">
                ${openStatusText}
            </div>
            <div class="store-info-address">
                <div class="circle">
                <!--<i class="fas fa-search-location"></i>-->
                     <i class="fas fa-location-arrow"></i>
                </div>
                ${address}
            </div>           
            <div class="store-info-phone">
                <div class="circle">
                     <i class="fas fa-phone-alt"></i>
                </div>
                ${phoneNumber}
            </div>
        </div>
    `;

    var marker = new google.maps.Marker({
        map: map,
        position: latlng,
        animation: google.maps.Animation.DROP,
        label : index.toString(),
        icon: {
            scaledSize: new google.maps.Size(70,70),
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        }
    });
    google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
    });
    markers.push(marker);
}