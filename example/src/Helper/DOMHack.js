export const LoadScript = (id = false, src, crossorigin = false, integrity = false, callback = false, timeout = 1) => {
    // settimeout avoid blocking on main thread of reactjs
    setTimeout(() => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;

        id && (script.id = id);
        crossorigin && (script.crossorigin = crossorigin);
        integrity && (script.integrity = integrity);

        document.body.appendChild(script);

        script.onload = () => {
            if(typeof callback == "function") callback();
        }
    }, timeout)
}

export const LoadLink = (url, rel, integrity, callback, timeout) => {
    // settimeout avoid blocking on main thread of css
    setTimeout(() => {
        const script = document.createElement("link");

        script.rel = rel;
        script.href = url;
        integrity && (script.integrity = integrity);
        script.crossorigin = "";
        script.onload = () => {
            if(typeof callback == "function") callback();
        }

        document.body.appendChild(script);
    }, timeout)
}