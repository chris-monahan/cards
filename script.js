//requires jQuery

var cardSelectApp = (function () {
    "use strict";
    
    var frameCount;
    
    var my = {};
    my.initialState = $("#cardSelectApp").html();
    
    my.init = function () {
        //console.log("hello world");
        frameCount = 1;

        var selectionCount = 0;
        $(".phase1").show();
        $(".phase2").hide();
        
        $(".card").each(function(){
            $(this).find("img")
                .wrap("<div class='cardFront'></div>");
            
            $(this).find(".cardFront")
                .after("<div class='cardBack'></div>");
            
            $(this).on("click", function(){
                selectionCount = selectionCount + 1;
                $(this).find("img")
                    .wrap("<div class='selectedCard' id='selected_"+selectionCount+"'></div>");
                
                var selectedCard = $(this).find(".selectedCard");
                var startingPosition = selectedCard.offset();
                
                console.log(startingPosition);
                
                startingPosition.top = startingPosition.top - $(document).scrollTop();
                startingPosition.left = startingPosition.left - $(document).scrollLeft();
                
                selectedCard.css("top",startingPosition.top)
                selectedCard.css("left",startingPosition.left);
                selectedCard.addClass("animated");
                
                
                
                if(selectionCount === 1){

                    selectedCard.animate({
                        top:"90vh",
                        left:(my.getGutterOffset(selectedCard) - 400)
                    });
                } else if (selectionCount === 2){
                    selectedCard.animate({
                        top:"90vh",
                        left:my.getGutterOffset(selectedCard)
                    });
                } else if (selectionCount === 3){
                    selectedCard.animate({
                        top:"90vh",
                        left:(my.getGutterOffset(selectedCard) + 400)
                    });
                    
                    my.phase2();
                }
                
            })
        });
    };
                
    my.repositionGutter = debounce(function() {
        
        var card1 = $("#selected_card_1");
        var card2 = $("#selected_card_2");
        var card3 = $("#selected_card_3");
        
        card1.css('left',my.getGutterOffset(card1) - 400);
        card2.css('left',my.getGutterOffset(card2));
        card3.css('left',my.getGutterOffset(card3) + 400);
    }, 250);
    
    my.getGutterOffset = function(residentCard){
        //debugger;
        return ($(document).width() / 2) - (residentCard.width() / 2);
    }
    
    
    //console.log(document.innerHTML);
    
    my.phase2 = function() {
        
        
        
        $(".card").off();
        $("div.phase1").delay(1000).hide(400,function(){
            
            $(".descriptionText").hide();
            $("#text1").show();
            
            $("div.phase2").show();
            
            
            $(".phase1 .selectedCard")
                .appendTo("div.phase2 .cardContainer")
                .addClass("card")
                .attr("style","");
            
            /*$(".selectedCard")
                .wrap("<div class='flipContainer flipped'></div>")
                .wrap("<div class='flipper'></div>");*/
            
            $("div.selectedCard:nth-child(1)").on('click',my.next);
            $("div.selectedCard:nth-child(1) .cardBack").after("<p>Past</p>");
            $("div.selectedCard:nth-child(2) .cardBack").after("<p>Present</p>");
            $("div.selectedCard:nth-child(3) .cardBack").after("<p>Future</p>");
                
        });
        
    };
    
    my.next = function(){
        if(frameCount === undefined){
            frameCount = 1;
        }

        if(frameCount === 1){
            my.flipCard(1);
            $("div.selectedCard:nth-child(1)").off();
            $("div.selectedCard:nth-child(2)").on('click',my.next);
        } else if(frameCount === 2){
            
            my.flipCard(1);
            my.flipCard(2);
            $("div.selectedCard:nth-child(2)").off();
            $("div.selectedCard:nth-child(3)").on('click',my.next);
        } else if(frameCount === 3){
            my.flipCard(2);
            my.flipCard(3);
        } else if(frameCount === 4){
            my.flipCard(3);
        } else if(frameCount === 5){
            my.flipCard(1);
            my.flipCard(2);
            my.flipCard(3);
            $("a#nextButton").hide();
        }
        
        if(frameCount < 6){
            $(".descriptionText").hide();
            $("#text"+frameCount).show();

            frameCount++;
        }
        
        
        
    }
    
    my.flipCard = function(flipNum){
        $("div.selectedCard:nth-child("+flipNum+")").toggleClass("flipped");
    }
    
    my.reset = function(){
        var appContainer = $("#cardSelectApp");
        appContainer.hide();
        appContainer.html("");
        //due to DOM syncronisation weirdness pause between each step
        window.setTimeout(function(){
            appContainer.html(my.initialState);
        },500);
        
        window.setTimeout(function(){
            my.init();
        }, 500);
        appContainer.show();
        
    }

    $(window).resize(my.repositionGutter());
    
    return my;
                
                
    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
    };
};
    
}());


$( window ).on( "load", cardSelectApp.init());