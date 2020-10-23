(function ($$) {
    class Processing {
        constructor($$) {
            this.$$ = $$;

            this.loader = `<div id="body"><div class="loader loader--style5" title="4"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"  width="24px" height="30px" viewBox="0 0 24 30" style="enable-background:new 0 0 50 50;" xml:space="preserve"><rect x="0" y="0" width="4" height="10" fill="#333"><animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0" dur="0.6s" repeatCount="indefinite" /></rect><rect x="10" y="0" width="4" height="10" fill="#333"><animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0.2s" dur="0.6s" repeatCount="indefinite" /></rect><rect x="20" y="0" width="4" height="10" fill="#333"> <animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0.4s" dur="0.6s" repeatCount="indefinite" /></rect></svg></div></div>`;
            $("html, body").css("overflow", "hidden");
            $("body").append(this.loader);
        }

        checkExists(className, func, options = {maxRetries: 20, commitAfterRetry: true}) {
            let retries = 0;
            var timer = setInterval(function(opts = options) {
                let target = $(className, $('iframe').contents())
                if (target.length) {
                    func(target)
                    clearInterval(timer);
                }
                retries++;
                if (retries == opts.maxRetries) {
                    if (opts.commitAfterRetry)
                        func(target);
                    clearInterval(timer);
                }
             }, 100);
        }
        scrollMessages() {
            // Find and scroll down message view before/after each loop
            var q = jQuery.Event( "scroll", {deltaY: 650, bubble: true} );
            let boxbox = $('._8daj', $('iframe').contents());
            let messageBox = $('._5-dk', $('iframe').contents());
            let messageBox2 = $('._24tx', $('iframe').contents()); //SimpleList.React //isScrolling
            let messageBox3 = $('._6yv6', $('iframe').contents()); //messages
            let scrollbar = $('._1t0w', $('iframe').contents()); //_1t0w _1t0z _1t0_
            let messages1 = $('._4k8w', $('iframe').contents()).eq(3);

            function triggerEvent(el, type, properties = { bubbles: true }){
                if ('createEvent' in document) {
                    var lastValue = el.value; var event = new Event(type, properties);
                    event.simulated = true;
                    var tracker = el._valueTracker;
                    if (tracker) {
                        tracker.setValue(lastValue);
                    }
                    el.dispatchEvent(event);
                }
            };

            //react component event
            function triggerMouseEvent(_elem, _evtName, _eventInitProps) {
                var $ = window.jQuery;
                let elem = _elem;
                var evt = document.createEvent('MouseEvents');
                var evtGroupName = _evtName + '.protractor';
                evt.initEvent(_evtName, true, false);
                _eventInitProps.passive = true;
                $.extend(evt, _eventInitProps);
                elem.one(evtGroupName, function(e) { // create wheel event handler to do the vertical scroll programmatically
                    var originalEvent = e.originalEvent;
                    //console.log('internal ' + e.type + ' handler: deltaY=', originalEvent.deltaY, ' detail=', originalEvent.detail, ' wheelDelta =', originalEvent.wheelDelta);

                    if (!e.isDefaultPrevented() && !originalEvent.shiftKey) {
                        var curElem = $(this);
                        curElem.scrollTop(curElem.scrollTop() + originalEvent.deltaY);
                    }
                });
                elem.each(function() {
                        this.dispatchEvent(evt);
                    }).unbind(evtGroupName);
            }
            //messageBox2[0].scrollTop = 0;
            //messageBox2.isScrolling = true;
            //triggerMouseEvent(boxbox, 'wheel', {deltaY: 7000, wheelDelta: -120, wheelDeltaY: -120, bubbles: true})
            triggerMouseEvent(messageBox2, 'wheel', {deltaY: -700, deltaX: -0,
                deltaZ: 0, wheelDelta: -120, wheelDeltaX: 0, wheelDeltaY: -120})
            //triggerMouseEvent(messageBox2, 'mouseover', {bubbles: true})
            //triggerEvent(messageBox2[0], ['wheel'], {deltaY: 100, wheelDelta: -240, wheelDeltaY: -240, bubbles: false})
            //messageBox.stop().animate({ scrollTop: 1500}, 1000);
            //triggerMouseEvent(messageBox2, 'fb-scroll', {delta: -100, deltaY: -1000, wheelDelta: -2400, wheelDeltaY: -2400})
            //let test;
            /*
            messageBox2.on('wheel', function(evt, info, context = messageBox2){
                console.log('wheel', evt);
            });
            */

            //triggerMouseEvent(messageBox2, 'scroll', {deltaY: 100, wheelDelta: -240, wheelDeltaY: -240, bubbles: false})
            //triggerMouseEvent(messageBox3, 'wheel', {deltaY: 7000, wheelDelta: -120, wheelDeltaY: -120, bubbles: true})
            //triggerMouseEvent(scrollbar, 'wheel', {deltaY: 7000, wheelDelta: -120, wheelDeltaY: -120, bubbles: true})
            //window.scrollTo(0, document.body.scrollHeight);
            //window.scrollTo(0, document.body.scrollHeight);
            //this.messages[this.messages.length-1].scrollIntoView();
        }
        runAction(start = 0, deletedCount = 0) {
            let me = this;
            this.messages = $('._4k8w', $('iframe').contents());

            // Find timestamps and cleanup
            let duds = [];
            this.messages.each(function(i, element) {
                let timestamp = $(this).find('.timestamp');
                if (!timestamp.text()) {
                    duds.push(i)
                    return;
                }
                let ts = [timestamp.attr('title'), timestamp.text()]; // Today or DayLong or NNMonthLong, Time or DayShort or NN MonthShort
                me.messages[i].timestamp = ts;
                //console.log(ts);
            });
            for (let i in duds) messages.slice(i, 1);

            // Set up vars and process
            chrome.storage.sync.get(['labelValues', 'beforeDateFilter'], function(data) {
                me.labelValues = data['labelValues'];
                me.beforeDateFilter = data['beforeDateFilter'];
            }.bind(this));
            this.deletedCount = deletedCount;
            this.processMessage(start)
        }
        processMessage(start) {
            console.log("----------------")
            if (start >= this.messages.length) {
                console.log("Deleted " + this.deletedCount + " messages");

                // Prompt finish or direct to scroll
                this.finishAction()
                return;
            }

            let me = this;
            let skipMessage = false;
            let message = this.messages[start];
            // Open message
            message.click();

            // Check filters for exclusion matches
            this.checkExists('._8g4q', function (actionButtons) {
                // Find labels
                this.checkExists('._3-8y', function (containers) {
                    let labelElems = containers.find('._64u3');
                    labelElems.each(function(i, element) {
                        let messageLabelText = $(this).text();
                        console.log(messageLabelText)

                        for(let [labelText, value] of Object.entries(me.labelValues)) {
                            if (labelText.toLowerCase() == messageLabelText.toLowerCase()) {
                                if (value) {
                                    skipMessage = true;
                                    console.log("Excluded filter found: " + messageLabelText)
                                } else {
                                    //console.log("No exclude")
                                }
                            }
                        }
                    });

                    // Check if timestamp is in range
                    let timestamp = message.timestamp;
                    var d = new Date(Date.now());   //today
                    let today = d.getDay();
                    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                    console.log(message.timestamp)
                    let messageDay = (timestamp[0] == 'Today') ? today : days.indexOf(timestamp[0]);
                    let difference = (timestamp[0] == 'Today') ? 0 : (messageDay - (messageDay-today)) - (days.length-messageDay);
                    
                    console.log(messageDay);
                    console.log(difference);
                    if (messageDay == -1) {
                        let day = timestamp[0].split(" ")[0];
                        let month = timestamp[0].split(" ")[1];
                        d.setMonth(months.indexOf(month));
                        d.setDate(parseInt(day));
                    } else {
                        d.setDate(d.getDate() + difference); //message day
                    }
                    //let tsHours = timestamp[1].split(':');
                    //if (tsHours[1]) d.setHours(tsHours[0], tsHours[1], 0);
                    console.log("Delete Before: " + me.beforeDateFilter);
                    console.log("Message Date:  " + d.toISOString().split('T')[0]);
                    let beforeDateFilterObj = new Date(me.beforeDateFilter);
                    if (d < beforeDateFilterObj) {
                        //console.log("Date is before filter")
                    } else if (d.getDay() == beforeDateFilterObj.getDay()){
                        //console.log("Date is on filter")
                        skipMessage = true;
                    } else {
                        //console.log("Date is after filter")
                        skipMessage = true;
                    }


                    console.log("skip: " +  skipMessage)
                    // Find delete button and click through to confirmation popup
                    if (!skipMessage) {
                        console.log("Deleting message..")
                        let deleteButton;
                        actionButtons.each(function(i, element) {
                            let classes = $(this).attr('class')
                            if (classes.includes('_8g4m')) deleteButton = $(this);
                        });
                        deleteButton.click()

                        this.checkExists('._61mx', (popup)=>{
                            let popupButtons = popup.find('button');
                            //[0] exit
                            //[1] cancel
                            //[2] delete
                            popupButtons[0].click();
                            me.deletedCount++;
                            //me.processMessage(start+1);
                            me.runAction(start, me.deletedCount); //Start from beginning with updated message list
                        });
                    } else {
                        me.processMessage(start+1);
                    }
                }.bind(this));
            }.bind(this));
        }

        finishAction() {
            $.confirm({
                title: 'Deleted ' + this.deletedCount + ' messages.',
                content: 'If unwanted messages remain you may need to scroll the list to a spot between a filtered and unfiltered message then try again.',
                theme: 'modern',
                buttons: {
                    confirm: {
                        text: 'Ok',
                        action: function () {
                            location.reload();
                        }
                    }
                }
            });
        }
    }
    
    new Processing($$).runAction();
})(function (selector) {
    return document.querySelector(selector);
});

//let target = $(this).find('*:not(:has("*"))'); // deepest child