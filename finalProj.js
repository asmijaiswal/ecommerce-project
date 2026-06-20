console.log("JavaScript Loaded Successfully");

let products=[
    {
        id:1,
        name:"Shirts",
        price:600,
        category:"clothing",
        image:"shirts.jpg",
        rating:4.5,
        reviews:1359
    },
    {
        id:2,
        name:"Earring",
        price:300,
        category:"accessories",
        image:"earring.jpg",
        rating:4.3,
        reviews:145
    },
    {
        id:3,
        name:"Nosering",
        price:200,
        category:"accessories",
        image:"nosering.webp",
        rating:4.7,
        reviews:1574
    },
    {
        id:4,
        name:"Jeans",
        price:1000,
        category:"clothing",
        image:"jeans.jpg",
        rating:4.6,
        reviews:198
    },
    {
        id:5,
        name:"Laptop",
        price:60000,
        category:"electronics",
        image:"laptop.jpg",
        rating:4.8,
        reviews:3954
    },
    {
        id:6,
        name:"Mouse",
        price:1000,
        category:"electronics",
        image:"mouse.jpg",
        rating:4.4,
        reviews:189
    },
    {
        id:7,
        name:"Keyboard",
        price:2000,
        category:"electronics",
        image:"keyboard.jpg",
        rating:4.7,
        reviews:362
    }
];

let cart=JSON.parse(localStorage.getItem("cart"))||[];

function addToCart(productID){

   let product=products.find(item=>item.id===productID);

   let existingProduct=cart.find(
       item=>item.id===productID
   );

    if(existingProduct){
        existingProduct.quantity++;
    }
    else{
        cart.push(
            {
                id:product.id,
                name:product.name,
                price:product.price,
                quantity:1
            }
        );
    }

    saveCart();
    updateCartCount();
    displayCart();
}

function saveCart(){
    localStorage.setItem("cart",JSON.stringify(cart));
}

function updateCartCount(){
    let count=cart.reduce((sum,item)=>sum+item.quantity,0);
    document.getElementById("count").innerHTML=count;
}

let discount=0;
function applyCoupon(){
    let coupon=document.getElementById("couponInput").value;
    if(coupon==="SAVE10"){
        discount=10;
        showToast("Coupon Applied!");
    }
    else{
        discount=0;
        showToast("Invalid Coupon");
    }
    displayCart();
}

function displayCart(){
    if(cart.length===0){
        document.getElementById("cartItems").innerHTML="<h3>Your Cart Is Empty</h3>";
        document.getElementById("Total").innerHTML="Total: ₹0";
        return;
    }

    let cartHtml=cart.map(
        (item,index)=>

        `<div class="cartItem">
        <h4> Name:${item.name}</h4>
        <p>Price:₹${item.price}</p>
        <button onclick="decreaseQty(${index})">-</button>
        <span>Qty: ${item.quantity}</span>
        <button onclick="increaseQty(${index})">+</button>
        </div>
        <button onclick="removeProduct(${index})">Remove</button>`
    ).join("");

    let total=cart.reduce(
        (sum,item)=>
        sum+(item.price*item.quantity),0
    );

    let discountAmount=(total*discount)/100;

    let finalAmount=total-discountAmount;

    document.getElementById("cartItems").innerHTML=cartHtml;

    document.getElementById("Total").innerHTML=
    `<p>Total: ₹${total}</p>
    <p>Discount: ₹${discountAmount}</p>
    <h3>Final Total: ₹${finalAmount}</h3>`;
}
function increaseQty(index){
    cart[index].quantity++;
    saveCart();
    updateCartCount();
    displayCart();
}

function decreaseQty(index){
    cart[index].quantity--;

    if(cart[index].quantity===0){
        cart.splice(index,1);
    }

    saveCart();
    updateCartCount();
    displayCart();
}

updateCartCount();
displayCart();

function showProducts(productArray){

    let html=productArray.map((product)=>{

        return `<div class="card">

           <h3>Name:${product.name}</h3>

           <img src="${product.image}" alt="${product.name}">

           <p>Price:₹ ${product.price}</p>

           <p>Category:${product.category}</p>

           <p>⭐ ${product.rating}</p>

           <p>${product.reviews} Reviews</p>

           <button onclick="addToCart(${product.id})">
           Add to cart
           </button>

           <button onclick="showDetails(${product.id})">
           View Details
           </button>

           <button onclick="addToWishlistByName('${product.name}')">
           Add to Wishlist
           </button>

           </div>`;

    });

    html=html.join("");

    document.getElementById(
        "products"
    ).innerHTML=html;
}

function showAllProducts(){
    showProducts(products);
}

function showDetails(productId){

    let product=products.find(
        item=>item.id===productId
    );

    let html=

    `<h2>${product.name}</h2>

    <p>Price: ₹${product.price}</p>

    <p>Category: ${product.category}</p>`;

    document.getElementById("modelBody").innerHTML=html;

    document.getElementById("productModel").style.display="block";
}

function closeModal(){
    document.getElementById("productModel").style.display="none";
}
function applyFilters(){

    let result=[...products];

    let keyword=
    document.getElementById(
        "search"
    ).value;

    if(keyword!==""){

        result=result.filter(
            product=>
            product.name
            .toLowerCase()
            .includes(
                keyword.toLowerCase()
            )
        );
    }

    let category=document.getElementById("categoryFilter").value;

    if(category!=="all"){
        result=result.filter(
            function(product){
                return product.category===category;
            }
        );
    }

    let priceLmt=document.getElementById("priceFilter").value;
    if(priceLmt!=="all"){
        result=result.filter(function(product){
            return product.price<Number(priceLmt);
            }
        );
    }

    let SortOption=document.getElementById("sortOption").value;

    if(SortOption==="lowToHigh"){
        result.sort(function(a,b){
                return a.price-b.price;
            }
        );
    }
    else if(
        SortOption==="highToLow"
    ){

        result.sort(function(a,b){
                return b.price-a.price;
            }
        );
    }

    showProducts(result);
}

showProducts(products);
let timeoutId;

document.getElementById("search").addEventListener("input",(event)=>{
        let keyword=event.target.value;
        console.log(keyword);
        clearTimeout(timeoutId);

        timeoutId=setTimeout(function(){
                applyFilters();
            },500
        );
    }
);

document.getElementById("categoryFilter").addEventListener("change",function(){
        applyFilters();
    }
);

document.getElementById("priceFilter").addEventListener("change",function(){
        applyFilters();
    }
);

document.getElementById("sortOption").addEventListener("change",function(){
    applyFilters();
    }
);

let wishlist=JSON.parse(localStorage.getItem("wishlist")) || [];
function addToWishlist(product){
    let existingProduct=
    wishlist.find(item=>item.name===product.name);
    if(existingProduct){
        alert("Already added!");
    }
    else{
        wishlist.push(product);
        localStorage.setItem("wishlist",JSON.stringify(wishlist));

        alert("Added!");
    }
}

function addToWishlistByName(name){
    let product=products.find(p=>p.name===name);
    addToWishlist(product);
    updateWishlistCount();
}
function displayWishlist(){
    if(wishlist.length===0){
        document.getElementById("wishlistItems").innerHTML="<h3>Your Wishlist Is Empty</h3>";
        return;
    }

    let html=wishlist.map(
        item=>
        `<div>
        <h4>${item.name}</h4>
        <p>${item.price}</p>
        <button onclick="removeWishlist(${item.id})">Remove</button>
        </div>`
    ).join("");
    document.getElementById("wishlistItems").innerHTML=html;
}

function removeWishlist(productID){
    let index=wishlist.findIndex(item=>item.id===productID);

    if(index!==-1){
        wishlist.splice(index,1);
        localStorage.setItem("wishlist",JSON.stringify(wishlist)
        );
        displayWishlist();
        updateWishlistCount();
    }
}
displayWishlist();

function updateWishlistCount(){
    document.getElementById("wishCount").innerHTML=wishlist.length;
}

function toggleDarkMode(){
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode",document.body.classList.contains("dark-mode"));
}

if(
    localStorage.getItem("darkMode")==="true"){
        document.body.classList.add("dark-mode");
}

function showToast(message){
    let toast=document.getElementById("toast");
    toast.innerHTML=message;
    toast.style.display="block";
    setTimeout(
        function(){
            toast.style.display="none";
        },2000
    );
}

function checkout(){
    if(cart.length===0){
        showToast("Cart Is Empty");
        return;
    }
    let name=document.getElementById("customerName").value;

    let phone=document.getElementById("phone").value;
    let address=document.getElementById("address").value;

    if(name==="" ||phone==="" ||address===""){
        showToast("Fill All Fields");
        return;
    }

    let total=cart.reduce((sum,item)=>sum+(item.price*item.quantity), 0);
    document.getElementById("orderSummary").innerHTML=
    `
    <h2>Order Summary</h2>

    <p>Name: ${name}</p>

    <p>Phone: ${phone}</p>

    <p>Address: ${address}</p>

    <p>Total Items:${cart.length}</p>

    <p>Total Price:₹${total}</p>

    <button onclick="placeOrder()">Place Order</button>
    `;
}

let orders=JSON.parse(localStorage.getItem("orders")) || [];
function placeOrder(){
    orders.push({
        date:new Date().toLocaleString(),
        customerName:document.getElementById("customerName").value,
        phone:document.getElementById("phone").value,
        address:document.getElementById("address").value,

        items:[...cart]});
    localStorage.setItem("orders",JSON.stringify(orders)
    );
    cart=[];
    saveCart();
    updateCartCount();
    displayCart();
    displayOrders();
}
function displayOrders(){
    if(orders.length===0){
        document.getElementById("orders").innerHTML="<h3>No Orders Yet</h3>";
        return;
    }

    let html=orders.map(
        order=>
        `<div>
            <h3>${order.date}</h3>
            <p>Name:${order.customerName}</p>
            <p>Phone:${order.phone}</p>
            <p>Address:${order.address}</p>
            <p>Items:${order.items.length}</p>

        </div>`
    ).join("");
    document.getElementById("orders").innerHTML=html;
}

async function loadProducts(){
    let response=await fetch("https://fakestoreapi.com/products");
    let data=await response.json();
    console.log(data);
}

function removeProduct(index){
    let check=confirm("Remove This Product?");
    if(check){
        cart.splice(index,1);
        saveCart();
        updateCartCount();
        displayCart();
    }
}
showProducts(products);
displayOrders();
updateWishlistCount();