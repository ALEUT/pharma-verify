window.addEventListener("load", function() {
    var isExtensionExist = typeof(webExtensionWallet) !== "undefined";
    if(!isExtensionExist) {
        $('#extensionAlert').show();
        $('#register').prop('disabled', true);
        $('#check').prop('disabled', true);
    }
});
