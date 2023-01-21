// ==UserScript==
// @name         Page Join
// @namespace    pagejoin
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    const SITE=[{
        page: ".page-link:nth-child(2) a.post-page-numbers",
        image: ".entry img",
        outputBlock: ".entry p:nth-child(5)"
    },{
        page: ".pagination:nth-child(6) .pagination-link",
        image: ".article-fulltext img",
        start: 1,
        outputBlock: ".article-fulltext"
    },{
        page: ".pagination-site a.page-numbers",
        start: 1,
        end: -1,
        image: ".contentme img",
        outputBlock: ".contentme"
    },{
        page: "#paginator a",
        end: -2,
        image: "#display_image_detail img",
        outputBlock: "#display_image_detail"
    },{
        page: "#pages a",
        end: -1,
        autofill: true,
        image: ".pictures img.con_img",
        outputBlock: ".pictures"
    },{
        page: ".nav-links a.page-numbers",
        end: -1,
        autofill: true,
        image: "#image_div a img",
        outputBlock: "#image_div p:first-child"
    }];
    async function main(){
        console.log("start");
        for (let s = 0;s < SITE.length; s++){
            let processSite = await process(SITE[s]);
            if (processSite){
                console.log('success');
                break;
            }
        }
        console.log("finished");
    }
    async function process(site){
        try{
            let pages = document.querySelectorAll(site.page);
            if (!pages){
                return false;
            }
            console.log("pages::",pages);
            let outputBlock = document.querySelector(site.outputBlock);
            if (!outputBlock){
                return false;
            }

            for (let i= site.start || 0 ;i<pages.length + (site.end || 0 );i++){
                let href = pages[i].href;
                let response = await getRawHtml(href);

                let tempdiv = document.createElement("div");
                tempdiv.innerHTML = response.substring(
                    response.indexOf("<body"),
                    response.indexOf("</body>") + 7
                );

                let imgs = tempdiv.querySelectorAll(site.image);
                if (!imgs){
                    continue;
                }
                console.log("imgs::",imgs);
                for (let j = 0;j<imgs.length;j++){
                    if (imgs[j].dataset && imgs[j].dataset.src){
                        imgs[j].src = imgs[j].dataset.src;
                    }
                    outputBlock.appendChild(imgs[j]);
                }
                pages[i].style.display = "none";
            }
            return true;
        }
        catch(e){
            console.log(e);
            return false;
        }
    }
    async function getRawHtml(url) {
        console.log('getRawHtml::start',url);
        let header = {
            "content-type":
            "application/x-www-form-urlencoded; charset=UTF-8; boundary=---------------------------" + Date.now().toString(16),
            accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "content-encoding": "gzip"
        };

        let response = await fetch(url, {
            header: header,
            method: "GET"
        });
        let data = await response.text();
        console.log('getRawHtml::end', response.status);
        return data;
    }
    main();
}());