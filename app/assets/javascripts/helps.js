$(function(){
    $('.optionHelp').click(function(){
        console.log( $( this ).attr('id') )
        showSection($( this ).attr('id'))
    })
    
     var helpSections = ["communication","how","explorer","guide","legal","account"];
    // ​
        function removeActive(){
            helpSections.forEach(section=>{
                $( "#"+section ).removeClass("active-link");
            });
        }
        function hideSections(){
            helpSections.forEach(section=>{
                $( "#section-"+section ).addClass("d-none");
            });	
        }
    // ​
    function activateHelpLink(section){
        removeActive();
        $( "#"+section ).addClass("active-link");
    }
    // ​
    function activateHelpSection(section){
        hideSections();
        $( "#section-"+section ).removeClass("d-none");
    }
    // ​
    function showSection(section){
        activateHelpLink(section);
        activateHelpSection(section);
    }
        
})