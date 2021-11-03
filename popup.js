// let all_listings = [];
// let key = 0;

// const form  = document.getElementById('add-item');
// // $('.entry-remove-btn').click(function() {
// //     alert("got in");
// //     $(this).parent('div.order_number').remove();
// // });

// function removeItem() {
//     alert("got in");
//     $(this).parent('div.order_number').remove();
// }

// form.addEventListener('submit', (event) => {
//     var scrollbar = $('.scroll-area');
//     var product_name = form.elements['pname'].value;
//     var price = form.elements['price'].value;
//     var entry_str = "<div class='order_number' id='" + key.toString() + "'> <p>" + product_name + "</p> <p>" + price + "</p> <input type='button' class='entry-remove-btn' value='remove' onclick='removeItem()' />  </div>";


//     let listing = {
//         "key": key,
//         "product_name": product_name,
//         "price": price,
//     };

//     all_listings.push(listing);
//     // alert("all" + all_listings.length);
//     // let newItemKey = "item" + key.toString();
//     // key++;
//     // chrome.storage.local.set({'test_string': "test1"});
//     // chrome.storage.local.set({newItemKey: listing}, function() {
//     //     alert('successfully added item:');
//     // });

//     // chrome.storage.local.get(['ea_all_items'], function(result) {
//     //     alert("here here");
//     //     alert(result.item0);
//     //     // all_listings = result.append(listing);
//     // });
//     // chrome.storage.local.get(['test_string'], function(result) {
//     //     alert("here here");
//     //     alert(result.test_string);
//     // });
//     scrollbar.append(entry_str);

//     event.preventDefault();
//     // Clear text fields
//     $('#pname').val("");
//     $('#price').val("");
// });

// $(document).ready(function () {
// $('.entry-remove-btn').on('click',function(){
//     alert("got in");
//     $(this).parent('div.order_number').remove();
// });




// var scrollbar = $('.scroll-area');
// chrome.storage.local.get(['ea_all_items'], function(result) {
//     if (result.ea_all_items != undefined) {
//         alert("data exists");
//         for (let i = 0; i < result.ea_all_items.length; ++i) {
//             let entry_str = "<div> <p>" + result.ea_all_items[i].product_name + "</p> <p>" + result.ea_all_items[i].price + "</p>  </div>";
//             scrollbar.append(entry_str);
//             alert(entry_str);
//             let listing = {
//                 "product_name": result.ea_all_items[i].product_name,
//                 "price": result.ea_all_items[i].price,
//             }

//             all_listings.push(listing);
//         }
//     }
//     else {
//         alert("no data exist");
//     }
// });
// });







//create-todo <- create todo button onclick open ".new-item"
//new-item <- if button pressed it save & hide "new-item"

document.querySelector('.create-todo').addEventListener('click', function () {
    document.querySelector('.new-item').style.display = 'flex';
});

document.querySelector('.save-button').addEventListener('click', function () {
    var itemName = document.querySelector('.new-item #name').value;
    var itemPrice = document.querySelector('.new-item #price').value;
    var itemLink = document.querySelector('.new-item #link').value;
    alert(itemName);

    if (itemName != '') {

        var itemsStorage = localStorage.getItem('todo-items');
        var itemsArr = JSON.parse(itemsStorage);
        // now let's check if the stored value is an array
        if (!(itemsArr instanceof Array)) {
            itemsArr = [itemsArr]; // if not, create one
        }
        itemsArr.push({ "item": itemName, "itemPrice": itemPrice, "itemLink": itemLink, "status": 0 });

        saveItems(itemsArr);
        fetchItems();
        document.querySelector('.new-item #name').value = '';
        document.querySelector('.new-item #price').value = '';
        document.querySelector('.new-item #link').value = '';
        document.querySelector('.new-item').style.display = 'none';
    }
});


function fetchItems() {

    const itemsList = document.querySelector('ul.todo-items');
    itemsList.innerHTML = '';
    var newItemHTML = '';
    try {
        var itemsStorage = localStorage.getItem('todo-items');
        var itemsArr = JSON.parse(itemsStorage);

        for (var i = 0; i < itemsArr.length; i++) {
            var status = '';
            if (itemsArr[i].status == 1) {
                status = 'class="done"';
            }
            newItemHTML += `<li data-itemindex="${i}" ${status}>
            <span class="item"><p><a target='_blank' href='${itemsArr[i].itemLink}'>${itemsArr[i].item}</a></p> <p>${itemsArr[i].itemPrice}</p></span>
            <div><span class="itemComplete">✅</span><span class="itemDelete">🗑</span></div>
            </li>`;
        }

        itemsList.innerHTML = newItemHTML;

        var itemsListUL = document.querySelectorAll('ul li');
        for (var i = 0; i < itemsListUL.length; i++) {
            itemsListUL[i].querySelector('.itemComplete').addEventListener('click', function () {
                //
                var index = this.parentNode.parentNode.dataset.itemindex;
                itemComplete(index);
            });
            itemsListUL[i].querySelector('.itemDelete').addEventListener('click', function () {
                //
                var index = this.parentNode.parentNode.dataset.itemindex;
                itemDelete(index);
            });
        }
    } catch (e) {
        //.
        //create a deafut item list..
    }

}

function itemComplete(index) {

    var itemsStorage = localStorage.getItem('todo-items');
    var itemsArr = JSON.parse(itemsStorage);

    itemsArr[index].status = 1;

    saveItems(itemsArr);

    document.querySelector('ul.todo-items li[data-itemindex="' + index + '"]').className = 'done';

}
function itemDelete(index) {

    var itemsStorage = localStorage.getItem('todo-items');
    var itemsArr = JSON.parse(itemsStorage);

    itemsArr.splice(index, 1);

    saveItems(itemsArr);

    document.querySelector('ul.todo-items li[data-itemindex="' + index + '"]').remove();

}

function saveItems(obj) {

    var string = JSON.stringify(obj);

    localStorage.setItem('todo-items', string);

}


fetchItems();
