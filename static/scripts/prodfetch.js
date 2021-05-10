
const onload = async (body) => {
    const data = await fetch("/productDetail/P-100106331");
    const resp = await data.json();
return resp;
  };
  let product=[];
  const gridContainer = $('.grid-container')
  onload().then( (resp) => {
      product = resp;
      console.log(resp);
      let desc=product['prodDesc'].split('. ').reduce((prev,item)=>{
        return `${prev}<li>${item}</li>`
      },'')
      const html = `<div class='grid-item mdc-elevation--z2' id='${product['prodID']}'>
                    <img src="${product['img']}" alt="">
                    <div class='details'>
                      <div class='title'>
                        ${product['prodName']}
                      </div>
                      <div class='priceTag'>
                      &#x20B9;
                        ${product['minPrice']}
                      </div>   
                      <div>
                      <ul>
                        ${desc}
                      </ul>
                      </div>
                      <button class="mdc-button mdc-button--raised button">
                                    <span class="mdc-button__ripple"></span>
                                    <i class="material-icons mdc-button__icon" aria-hidden="true">
                                        bolt
                                    </i>
                                    <span class="mdc-button__label">BUY NOW</span>
                                </button>
                    </div>                 
                </div>`
                
    gridContainer.append(html);
    // new MDCRipple(document.querySelector('.mdc-button')) 
  })
  