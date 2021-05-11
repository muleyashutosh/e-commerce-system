NProgress.configure({ showSpinner: false })

const { MDCRipple } = mdc.ripple;
const { MDCTooltip } = mdc.tooltip;

const { MDCDialog } = mdc.dialog;

const dialogEl = document.querySelector('.mdc-dialog')
const dialog = new MDCDialog(dialogEl);

const tooltips = [].map.call(document.querySelectorAll('.mdc-tooltip'), el => {
    return new MDCTooltip(el);
});


const iconRipples = [].map.call(document.querySelectorAll('.mdc-icon-button'), el => {
    return new MDCRipple(el);
})

iconRipples.map(el => {
    el.unbounded = true;
})


const tooltipsCleanup = () => {
    tooltips.map(({ root }) => {
        if (root.classList.contains('mdc-tooltip--showing') || root.classList.contains('mdc-tooltip--hide')) {
            root.classList.remove('mdc-tooltip--showing')
            root.classList.remove('mdc-tooltip--hide')
        }
    })
}

setInterval(tooltipsCleanup, 25)


$(document).ready(() => {
    
    $('#dropbtn').click(function() {
        $('#drop-content').slideToggle(200);    
    })

    $('#search').focusin(function() {
        $('#category').css("border", '2.5px solid #fdc100')
        $('#category').css("border-right", 'none')
        $('#search').css('border-top', '2.5px solid #fdc100')
        $('#search').css('border-bottom', '2.5px solid #fdc100')
    })
    $('#search').focusout(function() {
        $('#category').css("border", 'none')
        $('#search').css('border', 'none')
    })
    $('#category').focusin(function() {
        $('#search').css('border', '2.5px solid #fdc100')
        $('#search').css('border-left', 'none')
        $('#search').css('border-right', 'none')
        $('#category').css("border", '2.5px solid #fdc100')
        $('#category').css("border-right", 'none')
    })

    window.onclick = function(e) {
        if (!e.target.matches('#dropbtn') && !e.target.matches('#drop-btn')) {
            $('#drop-content').slideUp();
        }
        
    }

    $('#category').change(function() {
        // console.log('resizing')
        $('#resizerOption').html($('#category option:selected').text())
        // console.log($('#resizerOption').width())
        $('#category').width($('#resizerSelect').width())
    })

    $('.logout').click(() => {
        dialog.open()
    })

    $('.logout_button').click(() => {
        const a = document.createElement('a');
        a.href = '/logout';
        a.style = "display: none"
        document.body.appendChild(a)
        a.click();
    })


})
