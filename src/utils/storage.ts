// storage.ts - This file is now largely deprecated as data is managed by the backend.
// Keeping it for now in case any other part of the app still references it, but its functions are no longer used for persistence.

export const saveShortUrl = (urls: any) => {
    // No longer saving to local storage as data is managed by backend
    console.log("saveShortUrl called, but data is now backend managed.", urls);
};

export const getShortUrls = () => {
    // No longer retrieving from local storage as data is managed by backend
    console.log("getShortUrls called, but data is now backend managed.");
    return [];
};