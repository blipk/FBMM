"use strict";

class PopupActions {
    constructor() {
        this.pageFacebook = "https://www.facebook.com/PAGE/inbox";
    }

    isMessagePage(url) {
        if(url.indexOf(this.pageFacebook) != -1) {
            return true;
        } else {
            return false;
        }
    }

    removeMessages() {
        chrome.windows.getCurrent(function (currentWindow) {
            chrome.tabs.query({active: true, windowId: currentWindow.id}, function (activeTabs) {
                activeTabs.map(function (tab) {
                    chrome.tabs.insertCSS(tab.id, {file: 'css/jquery-confirm.css', allFrames: false})
                    chrome.tabs.executeScript(tab.id, {file: 'libs/jquery-3.5.1.js', allFrames: false});
                    chrome.tabs.executeScript(tab.id, {file: 'libs/jquery-confirm.js', allFrames: false});
                    chrome.tabs.executeScript(tab.id, {file: 'content/script.js', allFrames: false});
                });
            });
        });
    }

    getLabels(context) {
        chrome.windows.getCurrent(function (currentWindow) {
            chrome.tabs.query({active: true, windowId: currentWindow.id}, function (activeTabs) {
                activeTabs.map(function (tab) {
                    chrome.tabs.insertCSS(tab.id, {file: 'css/jquery-confirm.css', allFrames: false})
                    chrome.tabs.executeScript(tab.id, {file: 'libs/jquery-3.5.1.js', allFrames: false});
                    chrome.tabs.executeScript(tab.id, {file: 'libs/jquery-confirm.js', allFrames: false});
                    chrome.tabs.executeScript(tab.id, {file: 'content/labels.js', allFrames: false});

                    window.actions.updateLabels();
                });
            });
        });
    }

    openManager(context) {
        chrome.windows.getCurrent(function (currentWindow) {
            chrome.tabs.query({active: true, windowId: currentWindow.id}, function (activeTabs) {
                activeTabs.map(function (tab) {
                    chrome.tabs.insertCSS(tab.id, {file: 'css/jquery-confirm.css', allFrames: false})
                    chrome.tabs.executeScript(tab.id, {file: 'libs/jquery-3.5.1.js', allFrames: false});
                    chrome.tabs.executeScript(tab.id, {file: 'libs/jquery-confirm.js', allFrames: false});
                    chrome.tabs.executeScript(tab.id, {file: 'content/labels.js', allFrames: false});

                    window.actions.updateLabels();
                });
            });
        });
    }

    openPage() {
        chrome.tabs.create({url: this.pageFacebook});
    }

    updateLabelValue() {
        //console.log($(this))
        let name = $(this).val();
        let val = $(this).is(":checked");
        //console.log(window.actions.labelValues)
        //console.log({[name]: val})
        window.actions.labelValues[name] = val;
        //Object.keys(window.actions.labelValues).forEach(key => key == "" ? delete window.actions.labelValues[key] : {});
        chrome.storage.sync.set({ 'labelValues': window.actions.labelValues }, () => console.log('Labels saved'));
    }
    updateDateValue() {
        let date = $("#dateBefore").val();
        this.beforeDateFilter = date;
        console.log(date)
        chrome.storage.sync.set({ 'beforeDateFilter': date }, () => console.log('Date saved'));
    }
    updateLabels() {
        console.log(this.labelValues)
        if (!this.labelValues) return;
        let labelsHTML = '';
        //console.log(this.labelValues)
        for(let [labelText, value] of Object.entries(this.labelValues)) {
            let checked = value ? 'checked' : '';
            labelsHTML += '<div><label for="'+labelText+'"> \
                            <input type="checkbox" class="labelCheckbox" id="'+labelText+'" name="'+labelText+'" value="'+labelText+'" '+checked+'>&nbsp;&nbsp;'+labelText+' \
                            </label><br></div>';
        }
        $("#excludedLabels").html(labelsHTML);
        $(".labelCheckbox").each(function(i, element) {
                $(this).on("click", window.actions.updateLabelValue.bind(this))
        });

    }
    build() {
        var d = new Date(Date.now());
        let today = d.toISOString().split('T')[0];
        d.setDate(d.getDate() + 1);
        let tomorrow = d.toISOString().split('T')[0];
        if (!this.beforeDateFilter) {
            this.beforeDateFilter = d.toISOString().split('T')[0];
            chrome.storage.sync.set({ 'beforeDateFilter': this.beforeDateFilter }, () => console.log('Date saved'));
        }

        $("#openManager").on("click", () => chrome.extension.sendMessage({'action': 'open'}, function (response) {}));

        if (this.isMessagePage(this.currentUrl) == true) {
            // Inject watcher script
            let me = this;
            $("#removeMessages").on("click", this.removeMessages.bind(this));
            $("#updateLabels").on("click", this.getLabels.bind(this, me));
            $("#dateBefore").on("change", this.updateDateValue.bind(this, me));

            $("#dateBefore").attr('value', this.beforeDateFilter)
            $("#dateBefore").attr('max', tomorrow)
            $("#openMessenger").addClass('disabled');
            $("#openMessenger").attr('disabled', 'disabled');
            $("#openMessenger").hide();
            $("#openMessenger").on("click", function (e) {
                e.preventDefault();
            })

            this.updateLabels();

            $(".labelCheckbox").each(function(i, element) {
                $(this).on("click",window.actions.updateLabelValue.bind(this, me))
            });

        } else {
            $("#openMessenger").on("click", this.openPage.bind(this))

            $("#updateLabels").hide();
            $("#dateLabel").hide();
            $("#dateBefore").hide();
            $("#excludedLabelsLabel").hide();
            $("#removeMessages").addClass('disabled');
            $("#removeMessages").attr('disabled', 'disabled');
            $("#removeMessages").hide();
            $("#removeMessages").on("click", function (e) {
                e.preventDefault();
                return
            })
        }
    }
    initAction() {
        let me = this;
        chrome.tabs.getSelected(null, function (tab) {
            this.currentUrl = tab.url;

            chrome.storage.sync.get(['labelValues', 'beforeDateFilter'], function(data) {
                this.labelValues = data['labelValues'];
                this.beforeDateFilter = data['beforeDateFilter'];
                this.build();
            }.bind(this));

            chrome.storage.onChanged.addListener(function(changes, namespace) {
                for (var key in changes) {
                    var storageChange = changes[key];
                     /*
                    console.log('Storage key "%s" in namespace "%s" changed. ' +
                                'Old value was "%s", new value is "%s".',
                                key,
                                namespace,
                                storageChange.oldValue,
                                storageChange.newValue);
                    */
                    if (key == 'labelValues') {
                       window.actions.labelValues = storageChange.newValue;
                       window.actions.updateLabels();
                    }
                }
            });

        }.bind(this));
    }
}

/**
 * @name init all
 */
$(function () {
    window.actions = new PopupActions();
    window.actions.initAction();
});
