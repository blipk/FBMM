function checkExists(className, func, options = {maxRetries: 20, commitAfterRetry: true}) {
    let retries = 0;
    var timer = setInterval(function(opts = options) {
        let target = $(className, $('iframe').contents())
        if (target.length) {
            try {
                func(target)
            } catch(e) {console.log(e)}
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

checkExists('.rfloat', (linkLabels)=>{
    let target = 0;
    linkLabels.children().each(function(i, element) {
        if ($(this).text().toLowerCase() != 'manage labels') return;
        target = $(this);
    });
    
    if (!target.length) return;
    
    //react component click event
    let el = target[0];
    function triggerEvent(el, type){ 
        if ('createEvent' in document) { 
            var lastValue = el.value; var event = new Event(type, { bubbles: true }); 
            event.simulated = true; 
            var tracker = el._valueTracker; 
            if (tracker) { 
                tracker.setValue(lastValue); 
            } 
            el.dispatchEvent(event);
        }
    };
    triggerEvent(el, ['click'])
    
    
    checkExists('._1wea', (labels)=>{
        let newLabels = {};
        labels.each(function(i, element) {
            let labelText = $(this).children().eq(1).children().eq(0).text()
            newLabels[labelText] = false;
            //console.log(labelText)
        });

        chrome.storage.sync.get('labelValues', function(data) {
            this.labelValues = data['labelValues'];
            var mergedLabels = Object.assign(newLabels, labelValues)
            chrome.storage.sync.set({ 'labelValues': mergedLabels }, () => console.log('Labels saved'));
        }.bind(this)); 
        
        let closeButton = $('.layerCancel', $('iframe').contents());
        //console.log(closeButton)
        closeButton.click();
    });
});