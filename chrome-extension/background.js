"use strict";

chrome.runtime.onInstalled.addListener(() => {
	// ver. 0.1の時に使っていたlocalStorageの削除
	localStorage.clear();

	// 読み込み/更新時に既存のタブで実行する
	chrome.tabs.query({
		url: "*://*/*"
	}, tabs => {
		tabs.forEach(tab => {
			chrome.tabs.executeScript(tab.id, {
				file: "content_script.js",
				allFrames: true
			}, result => {
				if (typeof result === "undefined") {
					console.info("ページが読み込まれていません", tab);
				}
			});
		});
	});
});

chrome.runtime.onMessage.addListener((message, sender) => {
	if (message.method === "openLocalFile") {
		const localFileUrl = message.localFileUrl;
		const tab = sender.tab;
		openLocalFile(localFileUrl, tab);
	}
});


const openLocalFile = (localFileUrl, baseTab) => {
	chrome.tabs.create({
		url: localFileUrl,
		index: baseTab.index + 1
	});
};
