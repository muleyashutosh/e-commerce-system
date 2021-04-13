const { MDCFormField } = mdc.formField;
const { MDCRadio } = mdc.radio;

const radios = [].map.call(document.querySelectorAll('.mdc-radio'), el => {
    return new MDCRadio(el);
})

const formFields = [].map.call(document.querySelectorAll('.mdc-form-field'), el => {
    return new MDCFormField(el);
})

formFields.map((el, index) => {
    el.input = radios[index];
})


function showForm(id) {
    if (id === 'login') {
        var curr = 'login';
        var other = 'signup';
        document.getElementById(other + '-btn').style.boxShadow = 'inset 10px -10px 5px 0px #888888';
        document.getElementById(curr + '-btn').style.boxShadow = 'none';
        document.getElementById('forms').style.transform = 'translateX(-50%)'
    }
    else {
        var curr = 'signup'
        var other = 'login'
        document.getElementById(other + '-btn').style.boxShadow = 'inset -10px -10px 5px 0px #888888'
        document.getElementById(curr + '-btn').style.boxShadow = 'none';
        document.getElementById('forms').style.transform = 'translateX(0%)'
    }
    // document.getElementById(curr).style.display = 'block';
    document.getElementById(curr + '-btn').style.backgroundColor = '#e1e6e2';
    document.getElementById(curr + '-btn').style.fontWeight = 'bold';
    document.getElementById(other + '-btn').style.backgroundColor = '#a4a6a6';
    // document.getElementById(other).style.display = 'none';
    document.getElementById(other + '-btn').style.fontWeight = 'normal';
    document.getElementById('error1').style.display = 'none';

}

function showPass() {
    var x = document.getElementById('passIn')
    var eye = document.getElementById('eye')
    if (x.type === 'password') {
        x.type = 'text';
        eye.src = "https://ik.imagekit.io/milyzn5unt/e-commerce-system/showPassSelected_Z472MnFZm.svg"
    }
    else {
        x.type = 'password';
        eye.src = "https://ik.imagekit.io/milyzn5unt/e-commerce-system/showPassNormal_hI4WkY3i2z.svg"
    }
}

function hide() {
    document.getElementById('error').style.display = 'none';
    document.getElementById('error1').style.display = 'none';
}

function checker2(x) {
    x.style.border = '2px solid #f2a305'
    x.style.transform = 'scale(1.03,1.03)'
    var label = document.getElementById(x.id + 'Lab')
    // console.log(x.style.transform)
    label.style.zIndex = 1;
    label.style.fontWeight = 'bold';
    label.style.top = '-15px';
    label.style.color = '#f2a305';
    label.style.fontSize = '14px';
}

function checker1(x) {
    if (x.value == '') {
        x.style.border = '2px solid #3f3f3f';
        x.style.transform = 'scale(1,1)'
        var label = document.getElementById(x.id + 'Lab')
        label.zIndex = '-1'
        label.style.color = '#999999';
        label.style.fontWeight = 'normal';
        label.style.top = '5px';
    }
    else if (!x.checkValidity()) {
        x.style.transform = 'scale(1.05,1.05)'
        x.style.border = '2px solid #d32710';
        var label = document.getElementById(x.id + 'Lab')
        label.style.zIndex = 1;
        label.style.color = '#d32710';
        label.style.fontWeight = 'bold';
        label.style.top = '-15px';
        label.style.fontSize = '14px';
    }
    else if (x.checkValidity()) {
        x.style.border = '2px solid #3f3f3f';
        var label = document.getElementById(x.id + 'Lab')
        label.style.color = '#3f3f3f';
        label.style.transform = 'scale(1.03,1.03)'
    }
}


const userRadioInputs = document.querySelectorAll('.userRadio')
const orgName = document.getElementById('orgName')
const orgInput = document.getElementById('orgInput')

userRadioInputs.forEach(el => {
    el.addEventListener('change', (event) => {
        const target = event.target;
        if (target.id === 'custoption') {
            orgName.style.display = 'none';
            orgInput.required = false;
            // orgInput.disabled = true;
        } else {
            orgName.style.display = 'block';
            orgInput.required = true;
            // orgInput.disabled = false;
        }
    })
})

