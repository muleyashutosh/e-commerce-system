// const {MDCRipple} = mdc.ripple;
const { MDCCheckbox } = mdc.checkbox;
const { MDCFormField } = mdc.formField;
const { MDCRadio } = mdc.radio;


const filterRipples = [].map.call(document.querySelectorAll('.filter-button'), (el) => {
    new MDCRipple(el);
})


document.getElementById('reset').addEventListener('click', function (event) {
    document.getElementById('filter').reset();
    return false;
})

$(document).ready(function () {

    const checkboxes = [].map.call(document.querySelectorAll('.mdc-checkbox'), (el) => {
        return new MDCCheckbox(el);
    })

    const formFieldsCheckboxes = [].map.call(document.querySelectorAll('.mdc-form-field-checkboxes'), (el) => {
        return new MDCFormField(el);
    })

    formFieldsCheckboxes.map((el, index) => {
        el.input = checkboxes[index];
    })

    const radios = [].map.call(document.querySelectorAll('.mdc-radio'), (el) => {
        return new MDCRadio(el);
    })
    
    const formFieldsRadios = [].map.call(document.querySelectorAll('.mdc-form-field-radios'), (el) => {
        return new MDCFormField(el);
    })
    
    formFieldsRadios.map((el, index) => {
        el.input = radios[index];
    })


    const filterRipples = [].map.call(document.querySelectorAll('.filter-button'), (el) => {
        new MDCRipple(el);
    })

    const initialize_button_Ripples = () => {
        const ripples = [].map.call(document.querySelectorAll('.addToCart'), (el) => {
            new MDCRipple(el);
        })
    }
    initialize_button_Ripples();


    pages = $('.pageswitcher').children('a')
    dot_count = 0;
    for (x of pages) {
        if (x.text == '.') {
            dot_count++;
            x.style.display = 'none'
        }
    }
    dots = 0;
    for (x of pages) {
        if (x.text == '.' && dots < 5) {
            x.style.display = ''
            dots++;
        }
    }
    dots = 0
    for (x of pages.get().reverse()) {
        if (x.text == '.' && dots < 5) {
            x.style.display = ''
            dots++;
        }
    }
    // console.log(pages.get().reverse())


    function QuerySearch(query, category, callback) {
        $.ajax({
            url: '/getproducts',
            data: {
                search: query,
                category: category
            },
            success: callback
        })
    }
    var allproducts = $('.grid-container').contents();
    // console.log(allproducts)
    $('#search-icon').click(function () {
        if ($('#search').val().trim() == '') {
            if (allproducts.length == 0) {
                // console.log('val empty, productslist empty')
                var error = '<div class="noItemsFound"><h2>Oops, No Items matching your search were found!</h2><hr></div>'
                $('.main').append(error);
                $('.grid-container').empty()
            }
            else {
                // console.log('val empty, productslist not empty')
                $('.noItemsFound').remove();
                if (!$('.grid-container').contents().length)
                    $('.grid-container').append(allproducts);
                $('.pageswitcher').slideDown();
            }

        }
        else {

            QuerySearch($('#search').val().trim(), $('#category').val(), function (res) {
                // console.log(res)
                if (res.length == 0) {
                    // console.log('val ' + $("#search").val().trim() + ', res empty')
                    var error = '<div class="noItemsFound"><h2>Oops, No Items matching your search were found!</h2><hr></div>'
                    if (!$('.main').has('.noItemsFound').length)
                        $('.main').append(error)
                    $(".grid-container").empty()
                }
                else {
                    // console.log('val ' + $("#search").val().trim() + ', res not empty')
                    html = ''
                    for (let x = 0; x < res.length; x++) {
                        html += "<div class='grid-item' id='" + res[x]['prodID'] + "'>"
                        html += '<img src="' + res[x]['img'] + '" alt="">'
                        html += "<div>" + res[x]['prodName'] + "</div>"
                        html += `<div class='priceTag'>&#x20B9; ` + res[x]['minPrice'] + `.00</div>
                                    <span class="addCartButtonContainer">
                                        <button class="addToCart mdc-button mdc-button--raised">
                                            <span class="mdc-button__ripple"></span>
                                            <i class="material-icons mdc-button__icon" aria-hidden="true">
                                                add_shopping_cart
                                            </i>
                                            <span class="mdc-button__label">Add to Cart</span>
                                        </button>
                                    </span>
                                </div>`
                    }
                    $('.noItemsFound').remove()
                    $('.grid-container').empty();
                    $('.grid-container').append(html);
                    $('.pageswitcher').hide();

                    initialize_button_Ripples();

                }
            })
        }
    })


    $('#search').keypress(function (e) {
        if (e.keyCode == 13) {
            $('#search-icon').click()
        }
    })


    $('#menu').click(function () {
        if ($('.category-filter').css('display') === 'none') {
            $('.main').css('left', '15%')
            $('.main').css('width', '83%')
        }
        else {
            $('.main').css('left', '2%')
            $('.main').css('width', '95%')
        }
        $('.category-filter').animate({
            width: 'toggle'
        })

    })

})