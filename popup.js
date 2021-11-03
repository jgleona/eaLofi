var cartAmount = 0.0;
var totalSpent = 0.0;
var id = 0;
//create-todo <- create todo button onclick open ".new-item"
//new-item <- if button pressed it save & hide "new-item"

document.querySelector('.save-button').addEventListener('click', function () {
    document.querySelector('.new-item').style.display = 'flex';
});


document.querySelector('.purchases button').addEventListener('click',function(){
    clearBoughtItems();
    document.querySelector('ul.bought-items').innerHTML = '';
    totalSpent = 0.0;
    let spentHTML = `<h1>0 dollars</h1>`
    document.querySelector('.total-spent').innerHTML = spentHTML;

});

document.querySelector('.new-item button').addEventListener('click',function(){
    var itemName = document.querySelector('.new-item #name').value;
    var itemPrice = document.querySelector('.new-item #price').value;
    var itemLink = document.querySelector('.new-item #link').value;
    alert(itemName);

    if (itemName != '') {

        var itemsStorage = localStorage.getItem('todo-items');
        var itemsArr = JSON.parse(itemsStorage);
        // now let's check if the stored value is an array
        if(!(itemsArr instanceof Array)) {
            itemsArr = []; // if not, create one
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

function initialize() {
    
}

function fetchBoughtItems(){
    const boughtItemsList = document.querySelector('ul.bought-items');
    boughtItemsList.innerHTML = '';
    var newBoughtItemHTML = '';
   
    try{
        var boughtItemsStorage = localStorage.getItem('bought-items');
        var boughtItemsArr = JSON.parse(boughtItemsStorage);
        if(!(boughtItemsArr instanceof Array)) {
            boughtItemsArr = []; // if not, create one

        }
        else {
            alert("LENGTH" + boughtItemsArr.length);
            totalSpent = 0.0;
            for (let i = 0; i < boughtItemsArr.length; i++) {
                // alert(boughtItemsArr[i]);
                totalSpent += parseFloat(boughtItemsArr[i].itemPrice);
                newBoughtItemHTML += `<li> <span class="bought-item"><p><a target='_blank' href='${boughtItemsArr[i].itemLink}'>${boughtItemsArr[i].item}</a></p> <p>${boughtItemsArr[i].itemPrice}</p></span></li>`;
    
                // newBoughtItemHTML += "<p> Bought Item </p>";
            }
        }
        
        let spentHTML = `<h1>${totalSpent} dollars</h1>`
        document.querySelector('.total-spent').innerHTML = spentHTML;
        boughtItemsList.innerHTML = newBoughtItemHTML;
        
    }catch(e){
        alert("ERROR in bought items");
    }
}

function fetchItems() {

    const itemsList = document.querySelector('ul.todo-items');
    const cartAmountObj = document.querySelector('#cart-amount');
    itemsList.innerHTML = '';
    var newItemHTML = '';
    
    try{
        var itemsStorage = localStorage.getItem('todo-items');
        var itemsArr = JSON.parse(itemsStorage);
        cartAmount = 0.0;
        if(!(itemsArr instanceof Array)) {
            itemsArr = []; 
        }
        else {
            for (var i = 0; i < itemsArr.length; i++) {
                var status = '';
                if(itemsArr[i].status == 1){
                    status = 'class="done"';
                }
                cartAmount += parseFloat(itemsArr[i].itemPrice);
                newItemHTML += `<li data-itemindex="${i}" ${status}>
                <span class="item"><p><a target='_blank' href='${itemsArr[i].itemLink}'>${itemsArr[i].item}</a></p> <p>${itemsArr[i].itemPrice}</p></span>
                <div><span class="itemBought">✅</span><span class="itemDelete">🗑</span></div>
                </li>`;
            }
        }
        cartAmountObj.innerHTML = `Cart Value: $${cartAmount}`;
        itemsList.innerHTML = newItemHTML;
        
        var itemsListUL = document.querySelectorAll('ul.todo-items li');
        for (var i = 0; i < itemsListUL.length; i++) {
            itemsListUL[i].querySelector('.itemBought').addEventListener('click', function(){
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
    }catch(e){
        alert("ERROR in list items");
    }

}


function itemBought(index) {
    var itemsStorage = localStorage.getItem('todo-items');
    var itemsArr = JSON.parse(itemsStorage);
    var itemToBuy = itemsArr[index];
    var itemPrice = itemToBuy.itemPrice;
    totalSpent += parseFloat(itemPrice);

    let spentHTML = `<h1>${totalSpent} dollars</h1>`
    document.querySelector('.total-spent').innerHTML = spentHTML;
    var itemsBought = localStorage.getItem('bought-items');
    var itemsBoughtArr = JSON.parse(itemsBought);


    if(!(itemsBoughtArr instanceof Array)) {
        itemsBoughtArr = []; 
    }
    itemsBoughtArr.push(itemToBuy); 

    itemsArr.splice(index, 1);

    saveItems(itemsArr);
    saveBoughtItems(itemsBoughtArr);
    alert(JSON.stringify(itemsBoughtArr));
    document.querySelector('ul.todo-items li[data-itemindex="'+index+'"]').remove();
    return itemPrice;
}

function itemDelete(index) {
    
    var itemsStorage = localStorage.getItem('todo-items');
    var itemsArr = JSON.parse(itemsStorage);
    if(!(itemsArr instanceof Array)) {
        itemsArr = []; 
    }
    alert("item Delete: " + itemsArr[index]);
    alert("length" + itemsArr.length);
    var itemPrice = itemsArr[index].itemPrice;
    itemsArr.splice(index, 1);

    saveItems(itemsArr);

    document.querySelector('ul.todo-items li[data-itemindex="'+index+'"]').remove();
    return itemPrice;
}

function saveItems(obj) {

    var string = JSON.stringify(obj);

    localStorage.setItem('todo-items', string);

}

function saveBoughtItems(obj){

    var string = JSON.stringify(obj);

    localStorage.setItem('bought-items', string);

}



function clearBoughtItems(){
    localStorage.removeItem('bought-items');
}



fetchItems();
fetchBoughtItems();