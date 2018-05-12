var dappAddress = "n233msrZLUNe3VRuXwUvpymftX1Q4uHNTNM";
var NebPay = require("nebpay");
var nebPay = new NebPay();

window.addEventListener("load", function () {
    var isExtensionExist = typeof(webExtensionWallet) !== "undefined";
    if (!isExtensionExist) {
        $('#extensionAlert').show();
        $('#register').prop('disabled', true);
        $('#check').prop('disabled', true);
    }

    $('#registerForm').submit(register);
});

function register() {
    var upic = Math.random().toString(36).substr(2, 9);
    var drugName = $('#drugName').val();
    var drugCode = $('#drugCode').val();
    var bestBefore = $('#bestBefore').val();

    var func = "register";
    var args = [upic, drugName, drugCode, bestBefore];
    nebPay.call(dappAddress, 0, func, JSON.stringify(args), {
        listener: registerCallback
    });

    return false;
}

function registerCallback(resp) {
    console.log(resp); // todo: remove
    if (typeof resp === 'string' && resp.startsWith("Error:")) {
        alert(resp);
    } else if (resp.result.startsWith("Error:")) {
        alert(resp.result);
    } else {
        $('#upicRO').val(resp.result);
        alert('Registered successfully');
    }
}
