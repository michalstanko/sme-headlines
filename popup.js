$(function() {


var $linksWr = $("#linksWr");
var $articleWr = $("#articleWr");

var $articleHeader = $("#articleHeader");
var $articleBody = $("#articleBody");
var $btnBack = $("#btnBack");

var urls = {
    "frontpage": "http://rss.sme.sk/rss/rss.asp?id=frontpage",
    "smenajcit4": "http://rss.sme.sk/rss/rss.asp?id=smenajcit4",
    "smenajcit24": "http://rss.sme.sk/rss/rss.asp?id=smenajcit24",
    "zdom": "http://rss.sme.sk/rss/rss.asp?sek=smeonline&rub=online_zdom",
    "zahr": "http://rss.sme.sk/rss/rss.asp?sek=smeonline&rub=online_zahr",
    "ekon": "http://rss.sme.sk/rss/rss.asp?sek=ekon",
    "kult": "http://rss.sme.sk/rss/rss.asp?sek=kult",
    "sport": "http://rss.sme.sk/rss/rss.asp?sek=sport"
};
var $menu = $("#menu");
var $headlines = $("#headlines");



function setArticle(url, doc) {
    var $doc = $(doc);
    var $article = $doc.find("#itext_content");
    if (!$article.length) {
        // didn't find the article, maybe it's from blog.sme.sk:
        $article = $doc.find(".article");
    }
    $articleHeader.html("").append($doc.find("h1").last());
    $articleBody.html("").append($article);
    $articleBody.find("div").css("width", "auto"); // some DIVs have inline styles setting their width
}

function showArticle() {
    $linksWr.hide();
    $articleWr.show();
    window.scrollTo(0, 0);
}

function getArticle(url) {
    $.ajax({
        url: url,
        dataType: "html",
        success: function(doc) {
            setArticle(url, doc);
            showArticle();
        }
    });
}

function showLinks() {
    $articleWr.hide();
    $linksWr.show();
    window.scrollTo(0, 0);
}

function fetchRss(feedUrl) {
    var html = "";
    $.ajax({
        url: feedUrl,
        dataType: "xml",
        success: function(data) {
            $(data).find("item").each(function() {
                var $item = $(this);
                var title = $item.find("title").text();
                var link = $item.find("link").text();
                var description = $item.find("description").text();
                var pubDate = $item.find("pubDate").text();
                html += "<li><a href='" + link + "'>" + title + "</a><br>" + ((description) ? description + "<br>" : "");
                html += "<span class='pubDate'>" + ( moment(pubDate).format("D. M. YYYY HH:mm") ) + "</span>";
                html += "</li>";
            });
            $headlines.html(html);
        },
        error: function() {
            console.log("error"); // TODO
        }
    });
}


function bindEvents() {
    // RSS selection menu:
    $menu.delegate("a", "click", function() {
        var $t = $(this);
        $menu.find("a").removeClass("sel");
        $t.addClass("sel");
        fetchRss(urls[$t.data("rss")]);
    });

    // #headlines li - click
    // Fetch article after an item on the main page was clicked:
    $headlines.delegate("li", "click", function() {
        var $link = $(this).find("a");
        var url = $link.attr("href");
        getArticle(url);
    });

    // Back button from the article to the list of articles 
    $btnBack.bind("click", function(ev) {
        ev.preventDefault();
        showLinks();
    });

    // All links inside an article:
    // If the link points to sme.sk, try fetching an article
    // Otherwise ignore the click
    $articleWr.delegate("a", "click", function(ev) {
        ev.preventDefault();
        var url = this.href;
        if (url.indexOf("sme.sk/") === -1) {
            return false;
        }
        getArticle(url);
    });
}


fetchRss(urls["frontpage"]);
bindEvents();


});