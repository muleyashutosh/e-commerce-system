Waves.attach('#reset')
Waves.attach('#apply')
Waves.attach('#menu')
Waves.attach('#category')
Waves.init();

document.getElementById('reset').addEventListener('click', function (event) {
    document.getElementById('filter').reset();
    return false;
})
$(document).ready(function () {
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
                        html += "<div class='priceTag'>&#x20B9; " + res[x]['minPrice'] + ".00</div><button class= 'addToCart'><i class='fas fa-cart-plus'></i>Add to Cart</button></div>"
                    }
                    $('.noItemsFound').remove()
                    $('.grid-container').empty();
                    $('.grid-container').append(html);
                    $('.pageswitcher').hide();

                    $('.grid-item').mouseenter(function () {
                        $(this).children('div').css('opacity', '0.55');
                        $(this).children('img').css('opacity', '0.55');
                        $(this).css('z-index', '0')
                        $(this).children('.addToCart').fadeIn(50).css('display', 'block');
                        $(this).children('.addToCart').css('top', '50%');
                        $(this).children('.addToCart').css('left', '50%');
                        $(this).children('.addToCart').css('transform', 'translate(-50%,-68%)');

                    })
                    $('.grid-item').mouseleave(function () {
                        $(this).children('.addToCart').fadeOut(50).css('display', 'block');
                        $(this).children('div').css('opacity', '1');
                        $(this).children('img').css('opacity', '1');
                    })
                }
            })
        }
    })

    $('.grid-item').mouseenter(function () {
        $(this).children('div').css('opacity', '0.55');
        $(this).children('img').css('opacity', '0.55');
        $(this).css('z-index', '0')
        $(this).children('.addToCart').fadeIn(50).css('display', 'block');
        $(this).children('.addToCart').css('top', '50%');
        $(this).children('.addToCart').css('left', '50%');
        $(this).children('.addToCart').css('transform', 'translate(-50%,-68%)');

    })
    $('.grid-item').mouseleave(function () {
        $(this).children('.addToCart').fadeOut(50).css('display', 'block');
        $(this).children('div').css('opacity', '1');
        $(this).children('img').css('opacity', '1');
    })

    $('#search').keypress(function (e) {
        if (e.keyCode == 13) {
            $('#search-icon').click()
        }
    })


    $('#menu').click(function () {
        if ($('.category-filter').css('display') === 'none') {
            $('.grid-container').css('grid-template-columns', '25% 25% 25% 25%')
            $('.main').css('left', '15%')
            $('.main').css('width', '83%')

        }
        else {
            $('.grid-container').css('grid-template-columns', '20% 20% 20% 20% 20%')
            $('.main').css('left', '2%')
            $('.main').css('width', '95%')

        }
        $('.category-filter').animate({
            width: 'toggle'
        })

    })

})