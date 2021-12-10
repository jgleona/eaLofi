var cartAmount = 0.0;
var totalSpent = 0.0;
var id = 0;
//create-todo <- create todo button onclick open ".new-item"
//new-item <- if button pressed it save & hide "new-item"



// document.querySelector('.create-todo').addEventListener('click', function () {
//     document.querySelector('.new-item').style.display = 'flex';
// });

document.querySelector('.purchases button').addEventListener('click', function () {
    clearBoughtItems();
    document.querySelector('ul.bought-items').innerHTML = '';
    totalSpent = 0.0;
    let spentHTML = `<p>$ 0</p>`
    document.querySelector('.total-spent').innerHTML = spentHTML;

});


async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };

    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;

}

// var tab_title = '';
// function display_h1(results) {
//     h1 = results;
//     alert(h1);
//     document.querySelector(".developertools").innerHTML = "<p>tab title: " + tab_title + "</p><p>dom h1: " + h1 + "</p>";
// }

document.querySelector('.create-todo').addEventListener('click', async function () {
    //var itemName = document.querySelector('.new-item #name').value;
    var itemName;
    // var itemPrice = parseFloat(document.querySelector('.new-item #price').value).toFixed(2);
    var itemPrice;
    let itemLink = await getCurrentTab();
    itemLink = itemLink.url;
    if (itemLink.includes("nike")) {
        itemName = "Air Jordan 11 Cool Grey";
        itemPrice = 225;
    }
    else if (itemLink.includes("amazon")) {
        itemName = "New Apple AirPods (3rd Generation)";
        itemPrice = 169.98;
    }

    // alert(itemLink.url);

    // document.querySelector('.developertools').innerHTML = itemLink.url;

    // await chrome.tabs.query({ active: true }, function (tabs) {
    //     alert("hello");
    //     var tab = tabs[0];
    //     tab_title = tab.title;
    //     chrome.tabs.executeScript(tab.id, {
    //         code: 'document.querySelector("#productTitle").textContent'
    //     }, function (result) {
    //         alert("hello1");
    //         alert(result);
    //         // result has the return value from `code`
    //     });
    // });


    if (itemName != '') {

        var itemsStorage = localStorage.getItem('todo-items');
        var itemsArr = JSON.parse(itemsStorage);
        // now let's check if the stored value is an array
        if (!(itemsArr instanceof Array)) {
            itemsArr = []; // if not, create one
        }
        itemsArr.push({ "item": itemName, "itemPrice": itemPrice, "itemLink": itemLink, "status": 0 });

        saveItems(itemsArr);
        fetchItems();
        document.querySelector('.new-item #name').value = '';
        document.querySelector('.new-item #price').value = '';
        // document.querySelector('.new-item #link').value = '';
        document.querySelector('.new-item').style.display = 'none';
    }
});

document.querySelector('.cancel-button').addEventListener('click', function () {
    document.querySelector('.new-item').style.display = 'none';

});


function initialize() {

}

function fetchBoughtItems() {
    const boughtItemsList = document.querySelector('ul.bought-items');
    boughtItemsList.innerHTML = '';
    var newBoughtItemHTML = '';

    try {
        var boughtItemsStorage = localStorage.getItem('bought-items');
        var boughtItemsArr = JSON.parse(boughtItemsStorage);
        if (!(boughtItemsArr instanceof Array)) {
            boughtItemsArr = []; // if not, create one

        }
        else {
            // alert("LENGTH" + boughtItemsArr.length);
            totalSpent = 0.0;
            for (let i = 0; i < boughtItemsArr.length; i++) {
                // alert(boughtItemsArr[i]);
                totalSpent += parseFloat(boughtItemsArr[i].itemPrice);
                newBoughtItemHTML +=
                    `<li>
                        <div class="bought-item">
                            <p><a target='_blank' href='${boughtItemsArr[i].itemLink}'>${boughtItemsArr[i].item}</a></p>
                            <p>${boughtItemsArr[i].itemPrice}</p>
                        </div>
                    </li>`;

                // newBoughtItemHTML += "<p> Bought Item </p>";
            }
        }

        let spentHTML = `<p>Total: $${totalSpent}</p>`
        document.querySelector('.total-spent').innerHTML = spentHTML;
        boughtItemsList.innerHTML = newBoughtItemHTML;

    } catch (e) {
        alert("ERROR in bought items");
    }
}

function fetchItems() {

    const itemsList = document.querySelector('ul.todo-items');
    const cartAmountObj = document.querySelector('#cart-amount');
    itemsList.innerHTML = '';
    var newItemHTML = '';

    try {
        var itemsStorage = localStorage.getItem('todo-items');
        var itemsArr = JSON.parse(itemsStorage);
        cartAmount = 0.0;
        if (!(itemsArr instanceof Array)) {
            itemsArr = [];
        }
        else {

            for (var i = 0; i < itemsArr.length; i++) {
                // alert("In loop");
                // alert(JSON.stringify(itemsArr));
                if (itemsArr[i] == null) {
                    continue;
                }
                var status = '';
                if (itemsArr[i].status == 1) {
                    status = 'class="done"';
                }
                cartAmount += parseFloat(itemsArr[i].itemPrice);
                newItemHTML +=
                    `<li data-itemindex="${i}" ${status}>
                        <div class="item">
                            <p><a target='_blank' href='${itemsArr[i].itemLink}'>${itemsArr[i].item}</a></p>
                            <p>${itemsArr[i].itemPrice}</p>
                        </div >
                        <div>
                            <div class="itemBought">✅</div>
                            <div class="itemDelete">🗑</div>
                        </div>
                    </li>`;
            }
        }
        cartAmountObj.innerHTML = `Cart Value: $${cartAmount}`;
        itemsList.innerHTML = newItemHTML;

        var itemsListUL = document.querySelectorAll('ul.todo-items li');
        for (var i = 0; i < itemsListUL.length; i++) {
            itemsListUL[i].querySelector('.itemBought').addEventListener('click', function () {
                //
                var index = this.parentNode.parentNode.dataset.itemindex;
                var itemPrice = parseFloat(itemBought(index));
                cartAmount -= itemPrice;
                cartAmountObj.innerHTML = `Cart Value: $${cartAmount}`;
                fetchBoughtItems();
                fetchItems();
            });
            itemsListUL[i].querySelector('.itemDelete').addEventListener('click', function () {
                //
                var index = this.parentNode.parentNode.dataset.itemindex;
                var itemPrice = parseFloat(itemDelete(index));
                cartAmount -= itemPrice;
                cartAmountObj.innerHTML = `Cart Value: $${cartAmount}`;
                fetchItems();
            });
        }
    } catch (e) {
        alert("ERROR in list items");
    }

}


function itemBought(index) {
    var itemsStorage = localStorage.getItem('todo-items');
    var itemsArr = JSON.parse(itemsStorage);
    var itemToBuy = itemsArr[index];
    var itemPrice = itemToBuy.itemPrice;
    totalSpent += parseFloat(itemPrice);

    let spentHTML = `<p>$ ${totalSpent}</p>`
    document.querySelector('.total-spent').innerHTML = spentHTML;
    var itemsBought = localStorage.getItem('bought-items');
    var itemsBoughtArr = JSON.parse(itemsBought);


    if (!(itemsBoughtArr instanceof Array)) {
        itemsBoughtArr = [];
    }
    itemsBoughtArr.push(itemToBuy);

    itemsArr.splice(index, 1);

    saveItems(itemsArr);
    saveBoughtItems(itemsBoughtArr);
    document.querySelector('ul.todo-items li[data-itemindex="' + index + '"]').remove();
    return itemPrice;
}

function itemDelete(index) {

    var itemsStorage = localStorage.getItem('todo-items');
    var itemsArr = JSON.parse(itemsStorage);
    if (!(itemsArr instanceof Array)) {
        itemsArr = [];
    }
    var itemPrice = itemsArr[index].itemPrice;
    itemsArr.splice(index, 1);

    saveItems(itemsArr);

    document.querySelector('ul.todo-items li[data-itemindex="' + index + '"]').remove();
    return itemPrice;
}

function saveItems(obj) {

    var string = JSON.stringify(obj);

    localStorage.setItem('todo-items', string);

}

function saveBoughtItems(obj) {

    var string = JSON.stringify(obj);

    localStorage.setItem('bought-items', string);

}



function clearBoughtItems() {
    localStorage.removeItem('bought-items');
}



fetchItems();
fetchBoughtItems();