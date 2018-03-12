//requires jQuery

var cardSelectApp = (function () {
    "use strict";
    
    var frameCount;
    
    var my = {};
    
    my.init = function () {
        //console.log("hello world");
        var selectionCount = 0;
        $(".phase2").hide();
        
        $(".card").each(function(){
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
                        left:($(document).width() / 2) - 400,
                    });
                } else if (selectionCount === 2){
                    selectedCard.animate({
                        top:"90vh",
                        left:($(document).width() / 2)
                    });
                } else if (selectionCount === 3){
                    selectedCard.animate({
                        top:"90vh",
                        left:($(document).width() / 2) + 400,
                    });
                    
                    my.phase2();
                }
                
            })
        });
    };
    
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
            
            $(".selectedCard")
                .wrap("<div class='flipContainer flipped'></div>")
                .wrap("<div class='flipper'></div>");
            
            $(".selectedCard img")
                .wrap("<div class='cardFront'></div>");
            
            $(".selectedCard .cardFront")
                .after("<div class='cardBack'></div>");
            
            $("div.flipContainer:nth-child(1)").on('click',my.next);
            $("div.flipContainer:nth-child(1) .flipper").after("<p>Past</p>");
            $("div.flipContainer:nth-child(2) .flipper").after("<p>Present</p>");
            $("div.flipContainer:nth-child(3) .flipper").after("<p>Future</p>");
                
        });
        
    };
    
    my.next = function(){
        if(frameCount === undefined){
            frameCount = 1;
        }

        if(frameCount === 1){
            my.flipCard(1);
            $("div.flipContainer:nth-child(1)").off();
            $("div.flipContainer:nth-child(2)").on('click',my.next);
        } else if(frameCount === 2){
            
            my.flipCard(1);
            my.flipCard(2);
            $("div.flipContainer:nth-child(2)").off();
            $("div.flipContainer:nth-child(3)").on('click',my.next);
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
        $("div.flipContainer:nth-child("+flipNum+")").toggleClass("flipped");
    }

    
    return my;
    
}());


$( window ).on( "load", cardSelectApp.init());