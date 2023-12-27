function build() {

    const date = buildDate();
    document.getElementById("date").innerText = date;

    addEventListeners();

}

function addEventListeners() {
    document.getElementById("quantity-1").addEventListener("input", quantityEventHandler)
    document.getElementById("price-1").addEventListener("input", priceEventHandler)
}

function buildDate() {

    const today = new Date();

    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let date = today.getDate();

    if (date < 10) date = '0' + date;
    if (month < 10) month = '0' + month;

    const formatted = `${date}/${month}/${year}`;

    return formatted

    

}

function addNewItem() {

    let tbody = document.getElementById("tr-collection");
    let index = parseInt(
        tbody.children[tbody.children.length-1].id.replace("tr-", "")
    );
    console.log(index)
    index++;

    const tr = element("tr", "", {"id": `tr-${index}`});

    let td01 = element("td");
    let inputItem = element("input", "table-input table-input-item", {"name": `item-${index}`, "id": `item-${index}`, "placeholder": "Item name"});
    td01.appendChild(inputItem);

    let td02 = element("td");
    let inputQuantity = element("input", "table-input table-input-quantity", {"name": `quantity-${index}`, "id": `quantity-${index}`, "value": "0"});
    td02.appendChild(inputQuantity);

    let td03 = element("td");
    let inputPrice = element("input", "table-input table-input-price", {"name": `price-${index}`, "id": `price-${index}`, "value": "0"});
    td03.appendChild(inputPrice);

    let td04 = element("td");
    let totalPrice = element("span", "tp", {"id": `total-price-${index}`}, "0");
    td04.appendChild(totalPrice);

    let td05 = element("td");
    let removeButton = element("button", "remove-button", {"onclick": `removeItem(${index})`});
    let trashImage = element("img", "icon", {"src": "https://cdn-icons-png.flaticon.com/512/542/542724.png"});
    removeButton.appendChild(trashImage);
    td05.appendChild(removeButton);

    inputQuantity.addEventListener("input", quantityEventHandler);
    inputPrice.addEventListener("input", priceEventHandler)

    appendChildren(tr, [td01, td02, td03, td04, td05]);

    tbody.appendChild(tr);


}

function removeItem(index) {
    
    const tr = document.getElementById(`tr-${index}`);
    let subTotal = parseInt(document.getElementById("sub-total").innerText);
    const totalPrice = parseInt(document.getElementById(`total-price-${index}`).innerText);

    subTotal -= totalPrice;
    document.getElementById("sub-total").innerText = subTotal;
    
    tr.remove();

}

function element(name, className, attributes, innerText) {

    const element = document.createElement(name);
    element.setAttribute("class", className);

    if (attributes) {

        Object.keys(attributes).forEach(attr => {
            element.setAttribute(attr, attributes[attr]);
        })
    }

    if (!!innerText) element.innerText = innerText;

    return element;

}

function appendChildren(element, children) {

    children.forEach(c => {
        element.appendChild(c);
    });

}

function quantityEventHandler() {

    let quantity = parseInt(this.value) || 0;
    let index = parseInt(this.id.replace("quantity-", ""));
    let price = document.getElementById(`price-${index}`).value;

    document.getElementById(`total-price-${index}`).innerText = `${price * quantity}`;

}

function priceEventHandler() {

    let price = parseInt(this.value) || 0;
    let index = parseInt(this.id.replace("price-", ""));
    let quantity = document.getElementById(`quantity-${index}`).value;
    
    document.getElementById(`total-price-${index}`).innerText = `${price * quantity}`;

    let total = parseInt(document.getElementById("sub-total").value) || 0;

    Array.from(document.getElementsByClassName("tp")).forEach(p => {
        total += parseInt(p.innerText)
    });
    
    document.getElementById("sub-total").innerText = total;

}

function finalize() {
    
    const items = document.getElementsByClassName("table-input-item");

    let itemsList = [];

    Array.from(items).forEach(i => {

        let index = i.id.replace("item-", "");
        
        let name = i.value;
        let quantity = document.getElementById(`quantity-${index}`).value;
        let price = document.getElementById(`price-${index}`).value;
        let tp = parseInt(document.getElementById(`total-price-${index}`).innerText);

        let tr = element("tr", "preview-table-tr");

        let td_name = element("td", "preview-table-td", {}, name);
        let td_quantity = element("td", "preview-table-td", {}, quantity);
        let td_price = element("td", "preview-table-td", {}, price);
        let td_tp = element("td", "preview-table-td", {}, tp);

        appendChildren(tr, [td_name, td_quantity, td_price, td_tp]);

        itemsList.push(tr);

    });

    let lastTr = element("tr", "preview-table-tr");
    let grandTotalTitle = element("td", "preview-table-td preview-table-total", {}, "Total");
    let grandTotal = element("td", "preview-table-td", {}, `Rs ${document.getElementById("sub-total").innerText}/-`);
    let emptyTd1 = element("td", "preview-table-td")
    let emptyTd2 = element("td", "preview-table-td")

    appendChildren(lastTr, [emptyTd1, emptyTd2, grandTotalTitle, grandTotal]);
    itemsList.push(lastTr)

    let invoiceFor = document.getElementById("invoice-for").value || "(not specified)";
    let formatted = buildDate();

    let previewWrapper = element("div", "preview-wrapper", {"id": "preview-wrapper"});
    let preview = element("div", "preview", {"id": "preview"});
    let title = element("div", "preview-title", {}, `Invoice details for ${invoiceFor}.`);
    let date = element("div", "preview-date", {}, `Date: ${formatted}.`);

    let table = element("table", "preview-table");
    let tbody = element("tbody", "preview-tbody");
    let heading = element("tr", "preview-heading");
    
    let th_item = element("th", "preview-table-heading", {}, "Item");
    let th_quantity = element("th", "preview-table-heading", {}, "Quantity");
    let th_price = element("th", "preview-table-heading", {}, "Price");
    let th_total = element("th", "preview-table-heading", {}, "Total");

    let sendButton = element("button", "preview-send", {"onclick": "generateReceipt()"}, "Generate receipt")
    let closeButton = element("button", "preview-close", {"onclick": "document.getElementById(\"preview-wrapper\").remove()"}, "Close")
    
    appendChildren(heading, [th_item, th_quantity, th_price, th_total]);
    
    tbody.appendChild(heading);
    appendChildren(tbody, itemsList);
    
    table.appendChild(tbody);

    appendChildren(preview, [title, date, table, closeButton, sendButton]);

    appendChildren(previewWrapper, [preview, closeButton, sendButton]);

    document.getElementById("body").appendChild(previewWrapper);


}


// https://wa.me/send/+923002369080?text=Hello:%202,%203,%206%0AWorld,%208,%205,%2040