var dappAddress = "n1i4GALDhsaM4cBJbdossuHxrsNDnDEumu6";
var NebPay = require("nebpay");
var nebPay = new NebPay();

var transactionId;

window.addEventListener("load", function () {
    var isExtensionExist = typeof(webExtensionWallet) !== "undefined";
    if (!isExtensionExist) {
        $('#extensionAlert').show();
        $('#register').prop('disabled', true);
        $('#check').prop('disabled', true);
    }

    $('#registerForm').submit(register);
    $('#checkForm').submit(check);
});

function register() {
    var upic = Math.random().toString(36).substr(2, 9);
    var drugName = $('#drugName').val();
    var drugCode = $('#drugCode').val();
    var bestBefore = $('#bestBefore').val();

    var func = "register";
    var args = [upic, drugName, drugCode, bestBefore];
    transactionId = nebPay.call(dappAddress, 0, func, JSON.stringify(args), {
        listener: registerCallback
    });

    $('#upicRO').val(upic);

    return false;
}

function registerCallback(resp) {
    if (!handleCallbackError(resp)) {
        disableRegisterForm(true);
        $('#register').text('Registration in progress...');

        var intervalId = setInterval(function () {
            nebPay.queryPayInfo(transactionId)
                .then(function (resp) {
                    console.log("tx result: " + resp);
                    var respObject = JSON.parse(resp);
                    if (respObject.code === 0) {
                        clearInterval(intervalId);

                        disableRegisterForm(false);
                        $('#register').text('Register');

                        alert('Registration successful!');
                    }
                })
                .catch(function (err) {
                    console.log(err);
                });
        }, 5000);
    }
}

function check() {
    var upic = $('#upic').val();

    var func = "get";
    var args = [upic];
    nebPay.simulateCall(dappAddress, 0, func, JSON.stringify(args), {
        listener: checkCallback
    });

    return false;
}

function checkCallback(resp) {
    if (!handleCallbackError(resp)) {
        var drugEntry = JSON.parse(resp.result);
        if (drugEntry !== null) {
            $('#drugNameResult').text(drugEntry.drugName);
            $('#drugCodeResult').text(drugEntry.drugCode);
            $('#bestBeforeResult').text(drugEntry.bestBefore);

            $('#checkResult').show();

            window.scrollBy({
                top: 185,
                behavior: "smooth"
            })
        } else {
            alert('Drug with given UPIC not found.');
        }
    }
}

function disableRegisterForm(disable) {
    $('#drugName').prop('disabled', disable);
    $('#drugCode').prop('disabled', disable);
    $('#bestBefore').prop('disabled', disable);
    $('#register').prop('disabled', disable);
}

function handleCallbackError(resp) {
    console.log(resp); // todo: remove
    if (typeof resp === 'string') {
        alert(resp);
    } else if (typeof resp.result === 'string' && resp.result.indexOf("Error:") !== -1) {
        alert(resp.result);
    } else {
        return false;
    }

    return true;
}