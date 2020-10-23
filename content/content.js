window.onload = function(){
    // Event for postMessage from frame
    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    var eventer = window[eventMethod];
    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
    eventer(messageEvent,function(msg) {
        if (msg.data.status == 'Success') {
            console.log("Manager loaded.");
            window.fcw.postMessage({status: "Running on inbox."}, "chrome-extension://cemifaebmiadmmondlkcdmejghoapfnm/");
            window.fcw.postMessage({run: "loadLabels", arguments: [true]}, "chrome-extension://cemifaebmiadmmondlkcdmejghoapfnm/");
            window.fcw.postMessage({run: "loadUsers", arguments: [true]}, "chrome-extension://cemifaebmiadmmondlkcdmejghoapfnm/");
            init();
        }
    },false);

    // Create frame
    elt = document.createElement('iframe');
    elt.id = 'facebook_load_frame';
    elt.src = 'chrome-extension://cemifaebmiadmmondlkcdmejghoapfnm/index.html';
    elt.style.display = 'none';
    document.getElementsByTagName('body')[0].appendChild(elt);
    window.fcw = elt.contentWindow;
}

function checkExists(className, func, options = {maxRetries: 30, commitAfterRetry: false}) {
    let retries = 0;
    var timer = setInterval(function(opts = options) {
        let target = $(className, $('iframe').contents())
        if (target.length) {
            func(target)
            clearInterval(timer);
            retries = -1;
        }
        retries++;
        if (retries == opts.maxRetries) {
            if (opts.commitAfterRetry)
                func(target);
            clearInterval(timer);
        }
        }, 250);
}

function triggerEvent(el, type){
    if ('createEvent' in document) {
        var lastValue = el.value;
        var event = new Event(type, { bubbles: true });
        event.simulated = true;
        var tracker = el._valueTracker;
        if (tracker) {
            tracker.setValue(lastValue);
        }
        el.dispatchEvent(event);
    }
};

function injectManager() {
    checkExists('._8q1-', (assignmentBox) => {
        if (assignmentBox.initiated) return;
        let conversationName = $('._8g7e', $('iframe').contents()).text();
        assignmentBox.append('<img style="width: 20px; height: 20px; margin-left: 4px;" src="data:image/png;base64,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" alt="" />');
        assignmentBox.on('click', () => {
            checkExists('._8q0v', (orgUserButtons) => {
                //Button for each org user. Also _8q0y
                orgUserButtons.each((i, el)=> {    
                    let username = $(el).find('._8q29').text();
                    if ($(el).find('._8q0-').length)
                        assignmentBox.currentlyAssigned = username;

                    if (!el.initiated) {
                        $(el).on('mousedown', (e)=> {
                            window.fcw.postMessage({run: "createLabel",
                                arguments: [conversationName, username]},
                                "chrome-extension://cemifaebmiadmmondlkcdmejghoapfnm/");

                            // Remove it from other users
                            window.fcw.postMessage({run: "removeLabel",
                                arguments: [conversationName, assignmentBox.currentlyAssigned]},
                                "chrome-extension://cemifaebmiadmmondlkcdmejghoapfnm/");

                            console.log(username + " | " + conversationName);
                            e.preventDefault();
                        })
                    }

                    el.initiated = true;
                })

                // Remove assignment button
                let removeButton = $('._8q2n', $('iframe').contents());
                if (!removeButton.initiated) {
                    removeButton.on('mousedown', (e) => {
                        // Remove label from currently assigned (Maybe should be from all + Delete Label)
                        window.fcw.postMessage({run: "removeLabel",
                            arguments: [conversationName, assignmentBox.currentlyAssigned]},
                            "chrome-extension://cemifaebmiadmmondlkcdmejghoapfnm/");

                        console.log("Assignment removed from " + conversationName)
                        e.preventDefault();
                    })
                }
                removeButton.initiated = true;
            });
            assignmentBox.initiated = true;
        });
    });
}

function init() {
    injectManager();
    checkExists('._4k8w', (messages) => {
        messages.each((i, el)=> {    //Button for each org user. Also _8q0y
            $(el).on('click', (e)=> {
                console.log("Changed message")
                injectManager();
            })
        })
    });
}