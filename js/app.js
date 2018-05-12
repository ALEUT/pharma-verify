var dappAddress = "test"; // todo: fill
var NebPay = require("nebpay");
var nebPay = new NebPay();

var transactionId;
var intervalId;

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
    // transactionId = 123;
    // registerCallback({
    //     result: "123"
    // });

    return false;
}

function registerCallback(resp) {
    console.log(resp); // todo: remove
    if (typeof resp === 'string') {
        alert(resp);
    } else if (resp.result.indexOf("Error:") !== -1) {
        alert(resp.result);
    } else {
        $('#upicRO').val(resp.result);

        $('#drugName').prop('disabled', true);
        $('#drugCode').prop('disabled', true);
        $('#bestBefore').prop('disabled', true);
        $('#register').prop('disabled', true);
        $('#register').text('Registration in progress...');

        intervalId = setInterval(function () {
            nebPay.queryPayInfo(transactionId)
                .then(function (resp) {
                    console.log("tx result: " + resp);
                    var respObject = JSON.parse(resp);
                    if (respObject.code === 0) {
                        clearInterval(intervalId);

                        $('#drugName').prop('disabled', false);
                        $('#drugCode').prop('disabled', false);
                        $('#bestBefore').prop('disabled', false);
                        $('#register').prop('disabled', false);
                        $('#register').text('Register');

                        alert('Registration successful!');
                    }
                })
                .catch(function (err) {
                    console.log(err);
                });
        }, 2000);
    }
}

function check() {
    var upic = $('#upic').val();

    var func = "get";
    var args = [upic];
    nebPay.simulateCall(dappAddress, 0, func, JSON.stringify(args), {
        listener: checkCallback
    });
    // checkCallback({
    //     result: JSON.stringify({
    //         drugName: 'Test name',
    //         drugCode: 'Test code',
    //         bestBefore: '03/04/2019',
    //         dateAdded: '05/12/2018'
    //     })
    // });

    return false;
}

function checkCallback(resp) {
    console.log(resp); // todo: remove
    if (typeof resp === 'string') {
        alert(resp);
    } else if (resp.result.indexOf("Error:") !== -1) {
        alert(resp.result);
    } else {
        var drugEntry = JSON.parse(resp.result);
        $('#drugNameResult').text(drugEntry.drugName);
        $('#drugCodeResult').text(drugEntry.drugCode);
        $('#bestBeforeResult').text(drugEntry.bestBefore);
        $('#dateAddedResult').text(drugEntry.dateAdded);

        $('#checkResult').show();

        window.scrollBy({
            top: 185,
            behavior: "smooth"
        })
    }
}
