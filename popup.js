$(function() {
    var $linksWr = $("#linksWr");
    var $articleWr = $("#articleWr");

    var $articleHeader = $("#articleHeader");
    var $articleBody = $("#articleBody");
    var $btnBackToLinks = $("#btnBackToLinks");

    var url = "http://rss.sme.sk/rss/rss.asp?id=smenajcit4";
    var html = "";
    var $ul = $("#headlines");


    function goToArticle() {
        chrome.tabs.create({
            url: this.href
        });
    }

    function setArticle(url, doc) {
        var $doc = $(doc);
        var $article = $doc.find("#itext_content");
        $articleHeader.html("").append($doc.find("h1").last());
        /*
        var $newH1 = $articleHeader.find("h1");
        $newH1.html("<h1><a href='" + url + "'>" + $newH1.html() + "</a></h1>");
        */
        $articleBody.html("").append($article);
    }

    function showArticle() {
        $linksWr.hide();
        $articleWr.show();
        window.scrollTo(0, 0);
    }

    function showLinks() {
        $articleWr.hide();
        $linksWr.show();
        window.scrollTo(0, 0);
    }

    function bindEvents() {
        $btnBackToLinks.bind("click", function(ev) {
            ev.preventDefault();
            showLinks();
        });
    }

    $.ajax({
        url: url,
        dataType: "xml",
        success: function(data) {
            $(data).find("item").each(function() {
                var $item = $(this);
                var title = $item.find("title").text();
                var link = $item.find("link").text();
                var description = $item.find("description").text();
                var pubDate = $item.find("pubDate").text();
                html += "<li><a href='" + link + "'>" + title + "</a><br>" + description + "<br><span class='pubDate'>" + pubDate + "</span></li>";
            });
            $ul.html(html);
        },
        error: function() {
            console.log("error");
        }
    });

    $("#headlines").delegate("li", "click", function() {
        var $link = $(this).find("a");
        var url = $link.attr("href");
        $.ajax({
            url: url,
            dataType: "html",
            success: function(doc) {
                setArticle(url, doc);
                showArticle();
            }
        });
    });

    bindEvents();


});