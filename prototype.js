/* Initialize variables: */ 
var selected = 1, // determines which comparison box to update
                  // 1 = top box, 2 = bottom box, 3 = neither 
    first = false, // true if the top box is filled 
    second = false; // true if the bottom box is filled 

/* Set properties of width, height, etc. */
var width = 1000, // sets svg width 
    height = 600, // sets svg height 
    nodePadding = 4, // defines separation between same-artist nodes
    clusterPadding = 6 // defines separation between different-artist nodes 


/* Define shapeSvg to draw shapes within: */ 
var shapeSvg = d3.select("body").append("svg") // appends new svg 
    .attr("class", "noPointers") // eliminates pointer conflicts 
    .style("margin", "30px") // adds svg margin 
    .style("position", "absolute") // eliminates positioning conflicts 
    .attr("overflow", "visible") // shows elements outside of svg 
    .attr("width", width) // sets svg width 
    .attr("height", height); // sets svg height 
    
/* Create g element 'g0' to group elements together: */ 
var g0 = shapeSvg.append("g"); 

/* Draw rectangle to contain visualization: */ 
g0.append("rect") // appends new rectangle to shapeSvg 
    .attr("x", "0px") // sets x position 
    .attr("y", "0px") // sets y position 
    .attr("width", width + 50) // sets rectangle width 
    .attr("height", height + 50) // sets rectangle height 
    .style("fill", "none") // eliminates fill 
    .style("stroke", "black") // sets stroke color to black 
    .style("stroke-width", 2); // sets stroke width 

/* Draw vertical line: */ 
g0.append("line") // appends new line to shapeSvg 
    .attr('x1', 780) // sets start x position 
    .attr('y1', 0) // sets start y position 
    .attr('x2', 780) // sets end x position 
    .attr('y2', height + 50) // sets end y position 
    .style("stroke", "black") // sets stroke color to black 
    .style("opacity", ".3") // lowers opacity 
    .style("stroke-width", 2); // sets stroke width 

/* Draw horizontal line: */ 
g0.append("line") // appends new line to shapeSvg 
    .attr('x1', 780) // sets start x position 
    .attr('y1', (height / 2) + 25) // sets start y position 
    .attr('x2', width + 50) // sets end x position 
    .attr('y2', (height / 2) + 25) // sets end y position 
    .style("stroke", "black") // sets stroke color to black 
    .style("opacity", ".3") // lowers opacity 
    .style("stroke-width", 2); // sets stroke width 


/* Define main svg: */ 
var svg = d3.select("body").append("svg") // appends svg to html body 
    .style("margin", "50px") // adds svg margin 
    .attr("overflow", "visible") // shows elements outside of svg 
    .attr("width", width) // sets svg width 
    .attr("height", height); // sets svg height 

/* Create g element 'g' to group elements together: */
var g = svg.append("g");


/* Select top card initially: */
g.append("rect") // appends new rect to svg 
    .attr("class", "noPointers") // eliminates pointers 
    .attr("x", 770) // sets x position 
    .attr("y", -10) // sets y position 
    .attr("width", 250) // sets width 
    .attr("height", 305) // sets height 
    .style("fill", "none") // eliminates fill 
    .style("stroke", "lightblue") // sets stroke color 
    .style("stroke-opacity", "0.5") // lowers opacity 
    .style("stroke-width", 20); // sets stroke width 


/* Create (invisible) clickable rectangle that extends across entire page: */ 
g.append("rect") // appends new rect to svg 
    .attr("x", -1000) // sets x position 
    .attr("y", -1000) // sets y position 
    .attr("width", 4000) // sets width 
    .attr("height", 4000) // sets height 
    .style("opacity", "0") // makes rect invisible 

    /* When clicked: */ 
    .on("click", function() { 
        
        /* Select neither box: */ 
        selected = 3; 

        /* Cover top box's blue rect with white rect: */ 
        g.append("rect")
            .attr("class", "noPointers")
            .attr("x", 770)
            .attr("y", -10)
            .attr("width", 250)
            .attr("height", 305)
            .style("fill", "none")
            .style("stroke", "white")
            .style("stroke-width", 20); 
                
        /* Cover bottom box's blue rect with white rect:  */ 
        g.append("rect")
            .attr("class", "noPointers")
            .attr("x", 770)
            .attr("y", 315)
            .attr("width", 250)
            .attr("height", 305)
            .style("fill", "none")
            .style("stroke", "white")
            .style("stroke-width", 20);
        
    });


/* Create (invisible) clickable rectangle inside top box: */ 
g.append("rect") 
    .attr("x", 760) 
    .attr("y", -20)
    .attr("width", 270)
    .attr("height", 325)
    .style("fill", "white")
    .style("opacity", "0")

    /* When rect moused-over: */ 
    .on("mouseover", function() {
        
        /* If the top box is not currently selected: */ 
        if (selected != 1) {
        
        /* Draw a lightblue rect of low opacity: */
        /* (Indicates that the user is able to select the box) */ 
        g.append("rect")
            .attr("class", "noPointers")
            .attr("x", 770)
            .attr("y", -10)
            .attr("width", 250)
            .attr("height", 305)
            .style("fill", "none")
            .style("stroke", "lightblue")
            .style("stroke-opacity", "0.25")
            .style("stroke-width", 20); 
            
        }
        
    })

    /* When cursor leaves area of rect: */ 
    .on("mouseout", function() {
        
        /* If the top box is not currently selected: */ 
        if (selected != 1) { 
        
        /* Cover previous lightblue rect with white rect: */ 
        g.append("rect")
            .attr("class", "noPointers")
            .attr("x", 770)
            .attr("y", -10)
            .attr("width", 250)
            .attr("height", 305)
            .style("fill", "none")
            .style("stroke", "white")
            .style("stroke-width", 20); 
            
        }
        
    })

    /* When rect clicked: */ 
    .on("click", function() {
        
        /* Select top box: */ 
        selected = 1; 
        
        /* Cover previous top lightblue rect with white rect: */ 
        g.append("rect")
            .attr("class", "noPointers")
            .attr("x", 770)
            .attr("y", -10)
            .attr("width", 250)
            .attr("height", 305)
            .style("fill", "none")
            .style("stroke", "white")
            .style("stroke-width", 20); 
        
        /* Draw lightblue rect in top box: */ 
        /* (Indicates box is currently selected) */ 
        g.append("rect")
            .attr("class", "noPointers")
            .attr("x", 770)
            .attr("y", -10)
            .attr("width", 250)
            .attr("height", 305)
            .style("fill", "none")
            .style("stroke", "lightblue")
            .style("stroke-opacity", "0.5")
            .style("stroke-width", 20); 
                
        /* Cover (potential) bottom lightblue rect with white rect */ 
        g.append("rect")
            .attr("class", "noPointers")
            .attr("x", 770)
            .attr("y", 315)
            .attr("width", 250)
            .attr("height", 305)
            .style("fill", "none")
            .style("stroke", "white")
            .style("stroke-width", 20); 
        
    });


/* Create (invisible) clickable rectangle inside bottom box: */ 
g.append("rect")
    .attr("x", 760)
    .attr("y", 305)
    .attr("width", 270)
    .attr("height", 325)
    .style("fill", "white")
    .style("opacity", "0")

    /* If rect moused-over: */ 
    .on("mouseover", function() {
        
        /* If bottom box is not currently selected: */ 
        if (selected != 2) {
        
        /* Draw lightblue rect of low opacity in bottom box: */ 
        g.append("rect")
            .attr("class", "noPointers")
            .attr("x", 770)
            .attr("y", 315)
            .attr("width", 250)
            .attr("height", 305)
            .style("fill", "none")
            .style("stroke", "lightblue")
            .style("stroke-opacity", "0.25")
            .style("stroke-width", 20); 
            
        }
        
    })

    /* When mouse leaves area of rect: */ 
    .on("mouseout", function() {
        
        /* If bottom box not currently selected: */ 
        if (selected != 2) { 
            
        /* Cover previous lightblue rect with white rect: */ 
        g.append("rect")
            .attr("class", "noPointers")
            .attr("x", 770)
            .attr("y", 315)
            .attr("width", 250)
            .attr("height", 305)
            .style("fill", "none")
            .style("stroke", "white")
            .style("stroke-width", 20); 
            
        }
        
    })

    /* When rect clicked: */ 
    .on("click", function() {
        
        /* Select bottom box: */ 
        selected = 2; 
        
        /* Cover previous bottom lightblue rect with white rect: */ 
        g.append("rect")
            .attr("class", "noPointers")
            .attr("x", 770)
            .attr("y", 315)
            .attr("width", 250)
            .attr("height", 305)
            .style("fill", "none")
            .style("stroke", "white")
            .style("stroke-width", 20); 
        
        /* Cover (potential) top lightblue rect with white rect: */ 
        g.append("rect")
            .attr("class", "noPointers")
            .attr("x", 770)
            .attr("y", -10)
            .attr("width", 250)
            .attr("height", 305)
            .style("fill", "none")
            .style("stroke", "white")
            .style("stroke-width", 20); 
                
        /* Draw bottom lightblue rect: */ 
        g.append("rect")
            .attr("class", "noPointers")
            .attr("x", 770)
            .attr("y", 315)
            .attr("width", 250)
            .attr("height", 305)
            .style("fill", "none")
            .style("stroke", "lightblue")
            .style("stroke-opacity", "0.5")
            .style("stroke-width", 20);
        
    });


/* Append top box's x button: */ 
g.append("svg:image") // appends image to svg 
    .attr("xlink:href", "images/x.png") // uses x.png file from images folder 
    .attr("x", 980)
    .attr("y", 5)
    .style("opacity", ".5") // sets opacity to 50% initially 
    .attr("height", "25px") 
    .attr("width", "25px")

    /* When button moused-over: */ 
    .on("mouseover", function() {
    
        /* Re-append image at full opacity: */ 
        g.append("svg:image")
            .attr("class", "noPointers")
            .attr("xlink:href", "images/x.png") 
            .attr("x", 980)
            .attr("y", 5)
            .attr("height", "25px") // sets height 
            .attr("width", "25px");
    
        /* If top box not currently selected: */ 
        if (selected != 1) {
        
        /* Draw top lightblue rect */ 
        g.append("rect")
            .attr("class", "noPointers")
            .attr("x", 770)
            .attr("y", -10)
            .attr("width", 250)
            .attr("height", 305)
            .style("fill", "none")
            .style("stroke", "lightblue")
            .style("stroke-opacity", "0.25")
            .style("stroke-width", 20); 
            
        }
    
    })

    /* When mouse leaves area of x button: */ 
    .on("mouseout", function() {
        
        /* Cover previous x buttons with white circle: */ 
        g.append("circle")
            .attr("class", "noPointers")
            .attr("cx", "993")
            .attr("cy", "18")
            .attr("r", "12")
            .style("fill", "white");
    
        /* Append x button image at 50% opacity again: */ 
        g.append("svg:image")
            .attr("class", "noPointers")
            .attr("xlink:href", "images/x.png") 
            .attr("x", 980)
            .attr("y", 5)
            .style("opacity", "0.5")
            .attr("height", "25px") 
            .attr("width", "25px");
    
        /* If top box not currently selected: */ 
        if (selected != 1) {
            
        /* Cover previous lightblue rect with white rect: */ 
        g.append("rect")
            .attr("class", "noPointers")
            .attr("x", 770)
            .attr("y", -10)
            .attr("width", 250)
            .attr("height", 305)
            .style("fill", "none")
            .style("stroke", "white")
            .style("stroke-width", 20); 
            
        } 
    
    })

    /* When button clicked:  */ 
    .on("click", function() {
    
        /* Select top box: */ 
        selected = 1; 
    
        /* Cover (potential) bottom lightblue rect with white rect: */ 
        g.append("rect")
            .attr("class", "noPointers")
            .attr("x", 770)
            .attr("y", 315)
            .attr("width", 250)
            .attr("height", 305)
            .style("fill", "none")
            .style("stroke", "white")
            .style("stroke-width", 20); 
    
        /* Cover previous top lightblue rect with white rect:  */ 
        g.append("rect")
            .attr("class", "noPointers")
            .attr("x", 770)
            .attr("y", -10)
            .attr("width", 250)
            .attr("height", 305)
            .style("fill", "none")
            .style("stroke", "white")
            .style("stroke-width", 20); 
    
        /* Draw top lightblue rect: */ 
        g.append("rect")
            .attr("class", "noPointers")
            .attr("x", 770)
            .attr("y", -10)
            .attr("width", 250)
            .attr("height", 305)
            .style("fill", "none")
            .style("stroke", "lightblue")
            .style("stroke-opacity", "0.5")
            .style("stroke-width", 20); 
    
        /* Update 'first' variable to show top box is empty: */ 
        first = false; 
    
        /* Cover previous top box contents with white rect: */ 
        g.append("rect")
            .attr("class", "noPointers")
            .attr("x", 780)
            .attr("y", 0)
            .style("fill", "white")
            .attr("width", 230)
            .attr("height", 285);
    
        /* Re-append top x button: */ 
        g.append("svg:image")
            .attr("class", "noPointers")
            .attr("xlink:href", "images/x.png") 
            .attr("x", 980)
            .attr("y", 5)
            .attr("height", "25px") 
            .attr("width", "25px");
    });



/* Append bottom x button (in the same manner as the top button): */ 
g.append("svg:image")
    .attr("xlink:href", "images/x.png") 
    .attr("x", 980)
    .attr("y", 330)
    .style("opacity", ".5")
    .attr("height", "25px") 
    .attr("width", "25px")

    .on("mouseover", function() {
    
        g.append("svg:image")
            .attr("class", "noPointers")
            .attr("xlink:href", "images/x.png") 
            .attr("x", 980)
            .attr("y", 330)
            .attr("height", "25px") 
            .attr("width", "25px");
    
        if (selected != 2) {
        
        g.append("rect")
            .attr("class", "noPointers")
            .attr("x", 770)
            .attr("y", 315)
            .attr("width", 250)
            .attr("height", 305)
            .style("fill", "none")
            .style("stroke", "lightblue")
            .style("stroke-opacity", "0.25")
            .style("stroke-width", 20); 
            
        }
    
    })

    .on("mouseout", function() {
    
        g.append("circle")
            .attr("class", "noPointers")
            .attr("cx", "993")
            .attr("cy", "343")
            .attr("r", "12")
            .style("fill", "white");
    
        g.append("svg:image")
            .attr("class", "noPointers")
            .attr("xlink:href", "images/x.png") 
            .attr("x", 980)
            .attr("y", 330)
            .style("opacity", "0.5")
            .attr("height", "25px") 
            .attr("width", "25px");
    
        if (selected != 2) {
        
        g.append("rect")
            .attr("class", "noPointers")
            .attr("x", 770)
            .attr("y", 315)
            .attr("width", 250)
            .attr("height", 305)
            .style("fill", "none")
            .style("stroke", "white")
            .style("stroke-width", 20); 
            
        }
    
    })

    .on("click", function() {
    
        selected = 2; 
    
        g.append("rect")
            .attr("class", "noPointers")
            .attr("x", 770)
            .attr("y", -10)
            .attr("width", 250)
            .attr("height", 305)
            .style("fill", "none")
            .style("stroke", "white")
            .style("stroke-width", 20); 
    
        g.append("rect")
            .attr("class", "noPointers")
            .attr("x", 770)
            .attr("y", 315)
            .attr("width", 250)
            .attr("height", 305)
            .style("fill", "none")
            .style("stroke", "white")
            .style("stroke-width", 20); 
    
        g.append("rect")
            .attr("class", "noPointers")
            .attr("x", 770)
            .attr("y", 315)
            .attr("width", 250)
            .attr("height", 305)
            .style("fill", "none")
            .style("stroke", "lightblue")
            .style("stroke-opacity", "0.5")
            .style("stroke-width", 20); 
    
        second = false; 
    
        g.append("rect")
            .attr("class", "noPointers")
            .attr("x", 780)
            .attr("y", 325)
            .style("fill", "white")
            .attr("width", 230)
            .attr("height", 285);
    
        g.append("svg:image")
            .attr("class", "noPointers")
            .attr("xlink:href", "images/x.png") 
            .attr("x", 980)
            .attr("y", 330)
            .attr("height", "25px") 
            .attr("width", "25px");
    
    });


/* Enter data from data.csv file */
d3.text("data.csv", function(error, painter) {
    
    if (error) throw error; // throw error 
    
    
    var colNames = 
    "painter,size,group,color,link,c0,c1,c2,c3,c4,c5,c6,c7,painting,p1,p2\n" + painter;
    // defines column names according to order of columns in csv file 
    
    
    var data = d3.csv.parse(colNames);
    // creates data variable from which to access csv data 

    
    data.forEach(function(d) { d.size = +d.size; });
    // for each row of data, inputs size as numeric value (rather than string) 
    
    
    /* Print data to console as table for verification */
    console.table(data, ["painter", "size", "group", "color", "link", "c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "painting", "p1", "p2"]);

    
    /* Declare array to account for each cluster/group */
    var cs = []; // declares new array cs for each cluster/group 
    data.forEach(function(d){
        if(!cs.contains(d.group)) { cs.push(d.group); }
    }); // for each row of data, if group is not in cs array, add to array 

    
    /* Declare variables for node and cluster length */ 
    var n = data.length, // sets var n to total # of nodes
        m = cs.length; // sets var m to # of distinct clusters

    
    /* Create clusters and nodes */
    var clusters = new Array(m); // declares new array clusters 
    var nodes = []; // declares new array nodes 
    for (var i = 0; i < n; i++) { nodes.push(create_nodes(data,i)); }
    // for each node, adds data of said node to nodes array 
    
    
    /* Construct a new force-directed layout */ 
    var force = d3.layout.force()
        .nodes(nodes) // sets nodes of layout to those in nodes array 
        .gravity(0.00) // eliminates gravity between clusters 
        .charge(0) // eliminates charge between clusters  
        .on("tick", tick) // activates tick function on each tick 
        .start(); // calls start 

    
    /* Define svg circles as nodes and implement drag function */ 
    var node = svg.selectAll("circle") 
        .data(nodes) // selects nodes array data 
        .enter() // enters data 
        .append("g") // for grouping elements together 
        .call(force.drag); // allows circles to be dragged by user 


    /* Define node circles according to data */ 
    node.append("circle")
    
        /* Set circle color according to color defined in csv */ 
        .style("fill", function (d) { return d.color; }) 
    
        /* Set radius according to (scaled up) size defined in csv */ 
        .attr("r", function(d) { return d.radius })
     
        /* When user clicks, activate clicked function */ 
        .on("click", function(d) { 
        
            /* If node is a painting and no box is selected: */ 
            if ((d.painting != "") && (selected == 3 )) {
                
                /* Activate warning message tooltip: */ 
                d3.select("#pTextTooltip")
                    .style("left", (d3.event.pageX) - 175 + "px") 
                    // sets x position according to cursor position 
                    .style("top", (d3.event.pageY) - 75 + "px") 
                    // sets y position according to cursor position 
                    .style("opacity", 1) // resets opacity to 100% 
                    .classed("hidden", false) // shows tooltip 
                    .transition() // applies transition 
                    .delay(1500) // delays transition onset 
                    .duration(300) // determines transition length 
                    .style("opacity", 0); // transitions to 0% opacity 
                
            }
        
    
            /* If node is a painting and top box currently selected: */ 
            else if ((d.painting != "") && (selected == 1 )) { 
                
                /* Update 'first' to show top box is filled: */ 
                first = true; 
                
                
                /* If bottom box empty, select bottom box: */ 
                if (second == false) selected = 2; 
             
                
                /* Cover (potential) previous contents with white rect: */ 
                g.append("rect")
                    .attr("class", "noPointers")
                    .attr("x", 760)
                    .attr("y", -20)
                    .style("fill", "white")
                    .attr("width", 270)
                    .attr("height", 325);
                
                
                /* Create new var to append elements to svg: */ 
                var newSvg = g.append("svg")
                    .attr("class", "noPointers")
                    .attr("x", 790)
                    .attr("y", -20)
                    .attr("width", 210)
                    .attr("height", 325);
                
              
                /* Append painter's name: */ 
                newSvg.append("text")
                    .attr("x", 105)
                    .attr("y", 40)
                    .attr("dy", ".35em")
                    .style("font-size", 14)
                    .style("text-anchor", "middle")
                    .text("Artist: "+ d.painter); // uses painter string from data 
                    
                
                /* Append painting image: */ 
                newSvg.append("svg:image") 
                    .attr("xlink:href", d.link) // uses image link from data 
                    .attr("x", 25)
                    .attr("y", 60)
                    .attr("height", "160px") 
                    .attr("width", "160px"); 
                
                
                /* Append painting title: */ 
                newSvg.append("text")
                    .attr("x", 105)
                    .attr("y", 248)
                    .style("text-align", "center")
                    .style("font-size", "14px")
                    .style("line-height", "14px")
                    .style("text-anchor", "middle")
                    .text(function() {
                        if (d.p2 == "") return '"' + d.p1 + '"'; 
                        // if p2 empty, return p1 in quotes 
                        else return '"' + d.p1; 
                        // otherwise, only include left quotes 
                    })
                    .append("tspan") // appends tspan for more than line of text 
                    .attr("dy", 16)
                    .attr("x", 105)
                    .text(function() {
                        if (d.p2 == "") return "";
                        // if p2 empty, return empty string 
                        else return d.p2 + '"';
                        // otherwise, return p2 with right quotes 
                    });
                
                
                /* Insert first color */
                newSvg.append("rect") // appends rectangle 
                    .attr("width", "20") // sets width 
                    .attr("height", "20") // sets height 
                    .attr("fill", d.c0) // sets fill to first color from data
                    .attr("x", "20") // sets x position 
                    .attr("y", "275"); // sets y position 
        
                /* Insert second color */ 
                newSvg.append("rect")
                    .attr("width", "20")
                    .attr("height", "20")
                    .attr("fill", d.c1)
                    .attr("x", "40")
                    .attr("y", "275");
        
                /* Insert third color */ 
                newSvg.append("rect")
                    .attr("width", "20")
                    .attr("height", "20")
                    .attr("fill", d.c2)
                    .attr("x", "60")
                    .attr("y", "275");
        
                /* Insert fourth color */ 
                newSvg.append("rect")
                    .attr("width", "20")
                    .attr("height", "20")
                    .attr("fill", d.c3)
                    .attr("x", "80")
                    .attr("y", "275");
        
                /* Insert fifth color */ 
                newSvg.append("rect")
                    .attr("width", "20px")
                    .attr("height", "20")
                    .attr("fill", d.c4)
                    .attr("x", "100")
                    .attr("y", "275");
        
                /* Insert sixth color */ 
                newSvg.append("rect")
                    .attr("width", "20")
                    .attr("height", "20")
                    .attr("fill", d.c5)
                    .attr("x", "120")
                    .attr("y", "275");
        
                /* Insert seventh color */ 
                newSvg.append("rect")
                    .attr("width", "20")
                    .attr("height", "20")
                    .attr("fill", d.c6)
                    .attr("x", "140")
                    .attr("y", "275");
        
                /* Insert eighth color */ 
                newSvg.append("rect")
                    .attr("width", "20")
                    .attr("height", "20")
                    .attr("fill", d.c7)
                    .attr("x", "160")
                    .attr("y", "275"); 
                
                /* Re-append x button */ 
                g.append("svg:image")
                    .attr("class", "noPointers")
                    .attr("xlink:href", "images/x.png") 
                    .attr("x", 980)
                    .attr("y", 5)
                    .style("opacity", ".5")
                    .attr("height", "25px") // sets height 
                    .attr("width", "25px");
                
            }
        
        
            /* If node is a painting and bottom box currently selected: */ 
            /* (Update bottom box in the same way as the top box) */ 
            else if ((d.painting != "") && (selected == 2 )) { 
                
                second = true;
                 
                
                if (first == false) selected = 1; 

                
                g.append("rect")
                    .attr("class", "noPointers")
                    .attr("x", 760)
                    .attr("y", 305)
                    .style("fill", "white")
                    .attr("width", 270)
                    .attr("height", 325); 
                
                
                var newerSvg = g.append("svg")
                    .attr("class", "noPointers")
                    .attr("x", 790)
                    .attr("y", 305)
                    .attr("width", 210)
                    .attr("height", 325)
                    .style("background-color", "purple");
                
                newerSvg.append("text")
                    .attr("x", 105)
                    .attr("y", 40)
                    .attr("dy", ".35em")
                    .style("font-size", 14)
                    .style("text-anchor", "middle")
                    .text("Artist: "+ d.painter);
                    
                
                newerSvg.append("svg:image") 
                    .attr("xlink:href", d.link) 
                    .attr("x", 25)
                    .attr("y", 60)
                    .attr("height", "160px") 
                    .attr("width", "160px"); 
                
                
                newerSvg.append("text")
                    .attr("x", 105)
                    .attr("y", 248)
                    .style("text-align", "center")
                    .style("font-size", "14px")
                    .style("line-height", "14px")
                    .style("text-anchor", "middle")
                    .text('"' + d.p1 + '"')
                    .text(function() {
                        if (d.p2 == "") return '"' + d.p1 + '"'; 
                        else return '"' + d.p1;
                    })
                    .append("tspan")
                    .attr("dy", 16)
                    .attr("x", 105)
                    .text(function() {
                        if (d.p2 == "") return "";
                        else return d.p2 + '"';
                    });
                

                /* Insert first color */
                newerSvg.append("rect") // appends rectangle 
                    .attr("width", "20") // sets width 
                    .attr("height", "20") // sets height 
                    .attr("fill", d.c0) // sets fill to first color from data
                    .attr("x", "20") // sets x position 
                    .attr("y", "275"); // sets y position 
        
                /* Insert second color */ 
                newerSvg.append("rect")
                    .attr("width", "20")
                    .attr("height", "20")
                    .attr("fill", d.c1)
                    .attr("x", "40")
                    .attr("y", "275");
        
                /* Insert third color */ 
                newerSvg.append("rect")
                    .attr("width", "20")
                    .attr("height", "20")
                    .attr("fill", d.c2)
                    .attr("x", "60")
                    .attr("y", "275");
        
                /* Insert fourth color */ 
                newerSvg.append("rect")
                    .attr("width", "20")
                    .attr("height", "20")
                    .attr("fill", d.c3)
                    .attr("x", "80")
                    .attr("y", "275");
        
                /* Insert fifth color */ 
                newerSvg.append("rect")
                    .attr("width", "20px")
                    .attr("height", "20")
                    .attr("fill", d.c4)
                    .attr("x", "100")
                    .attr("y", "275");
        
                /* Insert sixth color */ 
                newerSvg.append("rect")
                    .attr("width", "20")
                    .attr("height", "20")
                    .attr("fill", d.c5)
                    .attr("x", "120")
                    .attr("y", "275");
        
                /* Insert seventh color */ 
                newerSvg.append("rect")
                    .attr("width", "20")
                    .attr("height", "20")
                    .attr("fill", d.c6)
                    .attr("x", "140")
                    .attr("y", "275");
        
                /* Insert eighth color */ 
                newerSvg.append("rect")
                    .attr("width", "20")
                    .attr("height", "20")
                    .attr("fill", d.c7)
                    .attr("x", "160")
                    .attr("y", "275"); 
                
                g.append("svg:image")
                    .attr("class", "noPointers")
                    .attr("xlink:href", "images/x.png") 
                    .attr("x", 980)
                    .attr("y", 330)
                    .style("opacity", ".5")
                    .attr("height", "25px") 
                    .attr("width", "25px");
                
            }
        
        
            /* If top box currently selected: */ 
            if (selected == 1) { 
                
                /* Cover previous top lightblue rect with white rect: */ 
                g.append("rect")
                    .attr("class", "noPointers")
                    .attr("x", 770)
                    .attr("y", -10)
                    .attr("width", 250)
                    .attr("height", 305)
                    .style("fill", "none")
                    .style("stroke", "white")
                    .style("stroke-width", 20); 
                
                /* Draw lightblue top rect: */ 
                g.append("rect")
                    .attr("class", "noPointers")
                    .attr("x", 770)
                    .attr("y", -10)
                    .attr("width", 250)
                    .attr("height", 305)
                    .style("fill", "none")
                    .style("stroke", "lightblue")
                    .style("stroke-opacity", "0.5")
                    .style("stroke-width", 20); 
                
                /* Cover (potential) bottom lightblue rect with white rect: */ 
                g.append("rect")
                    .attr("class", "noPointers")
                    .attr("x", 770)
                    .attr("y", 315)
                    .attr("width", 250)
                    .attr("height", 305)
                    .style("fill", "none")
                    .style("stroke", "white")
                    .style("stroke-width", 20); 
                
            }
        
        
            /* If bottom box currently selected:  */ 
            else if (selected == 2) {
                
                /* Cover previous bottom lightblue rect with white rect: */ 
                g.append("rect")
                    .attr("class", "noPointers")
                    .attr("x", 770)
                    .attr("y", 315)
                    .attr("width", 250)
                    .attr("height", 305)
                    .style("fill", "none")
                    .style("stroke", "white")
                    .style("stroke-width", 20); 
        
                /* Cover (potential) top lightblue rect with white rect: */ 
                g.append("rect")
                    .attr("class", "noPointers")
                    .attr("x", 770)
                    .attr("y", -10)
                    .attr("width", 250)
                    .attr("height", 305)
                    .style("fill", "none")
                    .style("stroke", "white")
                    .style("stroke-width", 20); 
                
                /* Draw lightblue bottom rect: */ 
                g.append("rect")
                    .attr("class", "noPointers")
                    .attr("x", 770)
                    .attr("y", 315)
                    .attr("width", 250)
                    .attr("height", 305)
                    .style("fill", "none")
                    .style("stroke", "lightblue")
                    .style("stroke-opacity", "0.5")
                    .style("stroke-width", 20); 
            } 
        
        
            /* If neither box currently selected: */ 
            else {
                
                /* Cover (potential) top lightblue rect with white rect: */
                g.append("rect")
                    .attr("class", "noPointers")
                    .attr("x", 770)
                    .attr("y", -10)
                    .attr("width", 250)
                    .attr("height", 305)
                    .style("fill", "none")
                    .style("stroke", "white")
                    .style("stroke-width", 20); 
                
                /* Cover (potential) bottom lightblue rect with white rect: */
                g.append("rect")
                    .attr("class", "noPointers")
                    .attr("x", 770)
                    .attr("y", 315)
                    .attr("width", 250)
                    .attr("height", 305)
                    .style("fill", "none")
                    .style("stroke", "white")
                    .style("stroke-width", 20);
            }
        
        }) 
        
        /* When mouse enters area of a circle: */ 
        .on("mouseover", function(d) { 
        
            /* If node is a painting: */ 
            if (d.painting != "") { 
        
                /* Insert painting title */ 
                d3.select("#tooltip") // selects div with id: "tooltip" 
                    .select("#name") // selects span with id: "name" 
                    .text(d.painting); // inserts painting name from csv data 
        
                /* Insert white square to cover previously appended images */ 
                d3.select("#tooltip") // selects div with id: "tooltip" 
                    .select("#image") // selects svg with id: "image" 
                    .append("rect") // appends rectangle 
                    .attr("width", "205px") // sets width 
                    .attr("height", "205px") // sets height 
                    .attr("fill", "#fff"); // sets fill to white 
        
                /* Insert image of painting */ 
                d3.select("#tooltip") // selects div with id: "tooltip" 
                    .select("#image") // selects svg with id: "image" 
                    .append("svg:image") // appends image to svg 
                    .attr("xlink:href", d.link) // uses image link from data 
                    .attr("height", "200px") // sets height 
                    .attr("width", "200px"); // sets width 
        
                /* Insert first color */
                d3.select("#tooltip") // selects div with id: "tooltip" 
                    .select("#pal") // selects svg with id: "pal" 
                    .append("rect") // appends rectangle 
                    .attr("width", "25px") // sets width 
                    .attr("height", "25") // sets height 
                    .attr("fill", d.c0) // sets fill to first color from data
                    .attr("x", "0") // sets x position 
                    .attr("y", "10"); // sets y position 
        
                /* Insert second color */ 
                d3.select("#tooltip") 
                    .select("#pal")
                    .append("rect")
                    .attr("width", "25px")
                    .attr("height", "25")
                    .attr("fill", d.c1)
                    .attr("x", "25")
                    .attr("y", "10");
        
                /* Insert third color */ 
                d3.select("#tooltip") 
                    .select("#pal")
                    .append("rect")
                    .attr("width", "25px")
                    .attr("height", "25")
                    .attr("fill", d.c2)
                    .attr("x", "50")
                    .attr("y", "10");
        
                /* Insert fourth color */ 
                d3.select("#tooltip") 
                    .select("#pal")
                    .append("rect")
                    .attr("width", "25px")
                    .attr("height", "25")
                    .attr("fill", d.c3)
                    .attr("x", "75")
                    .attr("y", "10");
        
                /* Insert fifth color */ 
                d3.select("#tooltip") 
                    .select("#pal")
                    .append("rect")
                    .attr("width", "25px")
                    .attr("height", "25")
                    .attr("fill", d.c4)
                    .attr("x", "100")
                    .attr("y", "10");
        
                /* Insert sixth color */ 
                d3.select("#tooltip") 
                    .select("#pal")
                    .append("rect")
                    .attr("width", "25px")
                    .attr("height", "25")
                    .attr("fill", d.c5)
                    .attr("x", "125")
                    .attr("y", "10");
        
                /* Insert seventh color */ 
                d3.select("#tooltip") 
                    .select("#pal")
                    .append("rect")
                    .attr("width", "25px")
                    .attr("height", "25")
                    .attr("fill", d.c6)
                    .attr("x", "150")
                    .attr("y", "10");
        
                /* Insert eighth color */ 
                d3.select("#tooltip") 
                    .select("#pal")
                    .append("rect")
                    .attr("width", "25px")
                    .attr("height", "25")
                    .attr("fill", d.c7)
                    .attr("x", "175")
                    .attr("y", "10");
        
                /* Set position and show tooltip */ 
                d3.select("#tooltip") // selects div with id: "tooltip"
                    .style("left", (d3.event.pageX) - 50 + "px") 
                    // sets x position according to cursor position 
                    .style("top", (d3.event.pageY) + 25 + "px") 
                    // sets y position according to cursor position 
                    .classed("hidden", false); // shows tooltip
                
            }
        
            /* If node is a painter: */ 
            else { 
                
                /* Insert painter name */ 
                d3.select("#pTooltip") // selects div with id: "pTooltip" 
                    .select("#pName") // selects span with id: "pName" 
                    .text(d.painter); // inserts painter name from csv data 
        
                /* Set transition and show tooltip */ 
                d3.select("#pTooltip") // selects div with id: "pTooltip" 
                    .style("left", (d3.event.pageX) - 50 + "px") 
                    // sets x position according to cursor position 
                    .style("top", (d3.event.pageY) + 25 + "px") 
                    // sets y position according to cursor position 
                    .classed("hidden", false); // shows tooltip
                
            }
        
        }) 
    
        /* When mouse moves: */ 
        .on("mousemove", function() {  
        
            d3.select("#tooltip") // selects div with id: "tooltip" 
                .style("left", (d3.event.pageX) - 50 + "px") 
                // sets x position according to cursor position 
                .style("top", (d3.event.pageY) + 25 + "px");
                // sets y position according to cursor position 
        
            d3.select("#pTooltip") // selects div with id: "pTooltip" 
                .style("left", (d3.event.pageX) - 50 + "px") 
                // sets x position according to cursor position 
                .style("top", (d3.event.pageY) + 25 + "px");
                // sets y position according to cursor position
        
        }) 
    
        /* When mouse leaves area of a circle: */ 
        .on("mouseout", function() { 
        
            d3.select("#tooltip") // selects div with id: "tooltip" 
                .classed("hidden", true); // hides tooltip 
        
            d3.select("#pTooltip") // selects div with id: "tooltip" 
                .classed("hidden", true); // hides tooltip 
        
        })
    
    
    /* Append images of painters */ 
    node.append("svg:image") // appends image to each painter node 
        .attr('width', "60") // sets width 
        .attr('height', "60") // sets height 
        .attr('x', "-30") // sets x position (relative to circle) 
        .attr('y', "-30") // sets y position (relative to circle) 
        .attr("xlink:href", function(d) { 
            /* If circle is a painter, use image link from csv: */ 
            if (d.painting == "") return "images/" + d.link; 
        }) 
        .attr("pointer-events", "none"); 
        // prevents interference with drag function 

    
    /* Define function to create nodes */ 
    function create_nodes(data,node_counter) { 
        var i = cs.indexOf(data[node_counter].group), 
            // sets i to the element of cs at the index of the current node 
            // In other words, i is the current cluster number (ex: 2)
            d = { 
                cluster: i, // sets d.cluster to i 
                radius: data[node_counter].size*1, // scales up circle sizes by 1.2
                painter: data[node_counter].painter, // sets d.painter 
                x: Math.cos(i / m * 2 * Math.PI) * 200 + (width - 270) / 2 + Math.random(), // sets d.x 
                y: Math.sin(i / m * 2 * Math.PI) * 200 + height / 2 + Math.random(), // sets d.y 
                color: data[node_counter].color, // sets d.color 
                painting: data[node_counter].painting, // sets d.painting 
                link: data[node_counter].link, // sets d.link 
                c0: data[node_counter].c0, // sets d.c0 
                c1: data[node_counter].c1, // sets d.c1 
                c2: data[node_counter].c2, // sets d.c2 
                c3: data[node_counter].c3, // sets d.c3 
                c4: data[node_counter].c4, // sets d.c4 
                c5: data[node_counter].c5, // sets d.c5 
                c6: data[node_counter].c6, // sets d.c6 
                c7: data[node_counter].c7, // sets d.c7 
                p1: data[node_counter].p1, // sets d.p1 
                p2: data[node_counter].p2  // sets d.p2 
            };
        if (!clusters[i]) clusters[i] = d;
        // sets data of current cluster to d if clusters[i] is empty
        return d; 
    };


    /* Define tick function */ 
    function tick(e) {
        node.each(cluster(20 * e.alpha * e.alpha)) 
            // determines the speed at which nodes cluster together 
            .each(collide(.7)) 
            // determines the speed at which nodes repel upon collision 
        .attr("transform", function (d) { 
            
            /* Set bounds for nodes to reside within */ 
            if (d.x > width - 280) d.x = width - 280; 
            // d.x is too far right, set to width (or 1200) 
            if (d.x < 0) d.x = 0; 
            // if d.x is too far left, set to 0 (or -400) 
            if (d.y > height) d.y = height; 
            // if d.y is too low, set to svg height 
            if (d.y < 0) d.y = 0; 
            // if d.y is too high, set to 0 
            
            var k = "translate(" + d.x + "," + d.y + ")"; 
            // sets each node to translate by d.x and d.y 
            return k; 
            // return k as translation function 
            
        }) 
    }

    
    /* Define cluster function */ 
    function cluster(alpha) { 
        return function (d) { 
            var cluster = clusters[d.cluster]; 
            // sets cluster to data of current cluster 
            if (cluster === d) return; 
            // if cluster data matches d data, return function 
            // else: 
            var x = d.x - cluster.x, 
                // set x to d.x - cluster.x 
                y = d.y - cluster.y, 
                // set y to d.y - cluster.y 
                l = Math.sqrt(x * x + y * y), 
                // set l to square root of x^2 + y^2 
                r = d.radius + cluster.radius; 
                // set r to d.radius + cluster.radius 
            if (l != r) { // if l does not match r: 
                l = (l - r) / l * alpha; 
                // set l to (l - r) divided by l * alpha 
                x = x * l; // multiply x by l 
                d.x = d.x - x; // subtract x from d.x  
                y = y * l; // multiply y by l
                d.y = d.y - y; // subtract y from d.y 
                cluster.x += x; // add x to cluster.x 
                cluster.y += y; // add x to cluster.x 
            } 
        }; 
    } 

    
    /* Define collide function */ 
    function collide(alpha) { 
        
        var quadtree = d3.geom.quadtree(nodes); // declare quadtree
        
        return function (d) { 
            
            var r = d.radius + Math.max(nodePadding, clusterPadding), 
                // set r to d.radius + clusterPadding 
                nx1 = d.x - r, 
                // set nx1 to d.x - r 
                nx2 = d.x + r, 
                // set nx2 to d.x + r 
                ny1 = d.y - r, 
                // set ny1 to d.y - r 
                ny2 = d.y + r; 
                // set ny2 to d.y + r 
            
            /* Visit each node in quadtree in pre-order traversal */ 
            quadtree.visit(function (node, x1, y1, x2, y2) { 
                
                /* If current node's data does not match d data: */ 
                if (node.point && (node.point !== d)) { 
                    var x = d.x - node.point.x,
                        // set x to d.x - node.point.x 
                        y = d.y - node.point.y,
                        // set y to d.y - node.point.y 
                        l = Math.sqrt(x * x + y * y),
                        // set l to square root of x^2 + y^2 
                        r = d.radius + node.point.radius + (d.cluster === node.point.cluster ? nodePadding : clusterPadding);
                        // set r to d.radius + node.point.radius + 
                        // nodePadding (if d.cluster matches node.point.cluster) 
                        // clusterPadding (if not) 
                    
                    /* If l < r: */ 
                    if (l < r) { 
                        l = (l - r) / l * alpha; 
                        // set l to (l - r) divided by l * alpha 
                        x = x * l; 
                        // multiply x by l 
                        d.x = d.x - x; 
                        // subtract x from d.x 
                        y = y * l; 
                        // multiply y by l 
                        d.y = d.y - y; 
                        // subtract y from d.y 
                        node.point.x += x; 
                        // add x to node.point.x 
                        node.point.y += y; 
                        // add y to node.point.y 
                    } 
                } 
            }); 
            
        }; 
    } 
    
}); 

/* Define contains function for use on arrays */ 
Array.prototype.contains = function(v) { 
    /* For each element in array: */ 
    for (var i = 0; i < this.length; i++) { 
        /* If current element matches given data v, return true */ 
        if (this[i] === v) return true;
    } 
    /* Else, return false */ 
    return false;
};




