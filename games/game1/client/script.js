/* Wrap everything in async IIFE so we can use await */(async _=>{
    //If not logged in, redirect to login page
    let sessionData = await ((async ()=>new Promise(resolve=>{fetch('get-acc-info').then(res=>res.text().then(text=>resolve(JSON.parse(text))))}))());
    if(!sessionData.loggedin) window.location.href="/login";

    const socket = io();

    requestAnimationFrame((/**@param {T} f@returns {T}@template T*/ f=>(f(),f))(time=>{
        
    }));

})()