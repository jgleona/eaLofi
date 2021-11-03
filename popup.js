let all_listings = [];
let key = 'ea_all_items';

const form  = document.getElementById('add-item');

form.addEventListener('submit', (event) => {
    var scrollbar = $('.scroll-area');
    var product_name = form.elements['pname'].value;
    var price = form.elements['price'].value;
    var entry_str = "<div> <p>" + product_name + "</p> <p>" + price + "</p>  </div>";

    let listing = {
        "product_name": product_name,
        "price": price,
    };
    all_listings.push(listing);
    alert("all" + all_listings.length);

    chrome.storage.local.set({key: all_listings}, function() {
        alert('successfully added item:');
    });

    chrome.storage.local.get(['ea_all_items'], function(result) {
        alert(result.ea_all_items[0].product_name);
        // all_listings = result.append(listing);
    });
    scrollbar.append(entry_str);

    event.preventDefault();
    // Clear text fields
    $('#pname').val("");
    $('#price').val("");
});

$(document).ready(function () {
    
    var scrollbar = $('.scroll-area');
    chrome.storage.local.get(['ea_all_items'], function(result) {
        for (let i = 0; i < result.ea_all_items.length; ++i) {
            let entry_str = "<div> <p>" + result.ea_all_items[i].product_name + "</p> <p>" + result.ea_all_items[i].price + "</p>  </div>";
            scrollbar.append(entry_str);
            alert(entry_str);
            let listing = {
                "product_name": result.ea_all_items[i].product_name,
                "price": result.ea_all_items[i].price,
            }
            
            all_listings.push(listing);
        }
    });
});


