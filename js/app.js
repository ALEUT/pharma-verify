window.addEventListener("load", function() {
    var isExtensionExist = typeof(webExtensionWallet) !== "undefined";
    if(!isExtensionExist) {
        $('#extensionAlert').show();
    }
});
