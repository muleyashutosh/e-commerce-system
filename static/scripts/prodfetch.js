const onload = async (body) => {
    const data = await fetch("/productDetail/P-100044339");
    const resp = await data.json();
    console.log(resp);  
return resp;
  };
  let product=[];
  onload().then( (resp) => {
      product = resp;
    //   console.log(resp);
      $('.grid-container').append(product);
  })
  