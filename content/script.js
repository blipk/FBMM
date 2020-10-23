$.confirm({
    title: 'Are you sure you want to delete all messages?',
    content: 'This can\'t be undone.<br>Please make sure your filters are set correctly and you are in the correct folder.',
    theme: 'modern',
    buttons: {
        confirm: {
            text: 'CONFIRM',
            action: function () {
                chrome.extension.sendMessage({'action': 'run'}, function (response) {});
            }
        },
        cancel: {
                text: `Cancel`,
                action: function () {
                    location.reload();
                    //chrome.extension.sendMessage({'action': 'close'}, function (response) {});
                }
            }
    }
});
$("html, body, .jconfirm.jconfirm-modern.jconfirm-open").css("overflow", "hidden");
/**/
//chrome.extension.sendMessage({'action': 'run'}, function (response) {});