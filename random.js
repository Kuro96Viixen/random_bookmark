// Developed by Kuro96Viixen at 20241009

const BOOKMARK_MENU_ID = "random_bookmark"
const BOOKMARK_MENU_TITLE = "Open random bookmark"


browser.contextMenus.create({
    id: BOOKMARK_MENU_ID,
    title: BOOKMARK_MENU_TITLE,
    contexts: ["bookmark"],
});

browser.contextMenus.onClicked.addListener(async (info) => {
    // Which button was clicked to open bookmark
    // 0 = Left
    // 1 = Middle
    // 2 = Right
    let buttonClicked = info.button;

    try {

        let createProperties = await urlProperties(info.bookmarkId);

        if (buttonClicked === 0) {
            // Current tab
            browser.tabs.update(createProperties);
        } else if (buttonClicked === 1) {
            // New tab
            browser.tabs.create(createProperties);
        }
    } catch (error) {
        console.error(error);
    }
});

async function urlProperties(bookmarkId) {
    let [bookmarkInfo] = await browser.bookmarks.get(bookmarkId);

    let isFolder = bookmarkInfo.type === "folder";

    let bookmarkUrl = '';

    if (isFolder) {
        // Get all Bookmarks in folder
        let bookmarks = await browser.bookmarks.getChildren(bookmarkId);
        // Filter to get only the bookmarks, not the folder
        let bookmarksUrls = bookmarks.filter(b => b.type === 'bookmark').map(b => b.url);
        // Get a random number based on quantity of bookmarks
        let randomNumber = Math.floor(Math.random() * bookmarksUrls.length);

        bookmarkUrl = bookmarksUrls[randomNumber];
    } else {
        bookmarkUrl = bookmarkInfo.url;
    }

    // This is a separator
    if (bookmarkUrl === "data:") {
        throw Error('Separator is not a valid bookmark or bookmark folder');
    }

    let createProperties = {
        active: true,
        url: bookmarkUrl,
    };

    return createProperties;
}
