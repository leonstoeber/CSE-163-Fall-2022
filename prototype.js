/* Set properties of width, height, etc. */
var width = 800, 
    // sets width (1650 for full screen on mac) 
    // (final width yet to be decided) 
    height = 700, 
    // sets height of svg
    nodePadding = 4, 
    // defines separation between same-artist nodes
    clusterPadding = 6 
    // defines separation between different-artist nodes 


var svg = d3.select("body").append("svg") // appends svg to html body 
    .style("margin", "50px") // adds svg margin 
    .attr("overflow", "visible") // shows elements outside of svg 
    .attr("width", width) // sets svg width 
    .attr("height", height); // sets svg height 


/* Enter data from data.csv file */
d3.text("data.csv", function(error, painter) {
    
    if (error) throw error; // throw error 
    
    var colNames = "pLink,painter,size,group,color,painting,link,c0,c1,c2,c3,c4,c5,c6,c7\n" + painter;
    // defines column names according to order of columns in csv file 
    
    var data = d3.csv.parse(colNames);
    // creates data variable from which to access csv data 

    data.forEach(function(d) { d.size = +d.size; });
    // for each row of data, inputs size as numeric value (rather than string) 
    
    /* Print data to console as table for verification */
    console.table(data, ["painter link", "painter", "size", "group", "color", "painting", "link", "c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7"]);


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
    

    /* (The following is replaced with a tooltip:) */ 
    /* Add labels to center circles according to painter name 
    node.append("text") // appends text to each node 
        .attr("dy", ".3em") // adjusts y positioning of text on circle 
        .style("text-anchor", "middle") // anchors text in middle 
        .style("font-size", "12px") // sets font size 
        .text(function(d) { return d.painter; }); // sets text to painter's name */ 
    
    
    /* Append images of painters */ 
    node.append("svg:image") // appends image to each painter node 
        .attr('width', "100") // sets width 
        .attr('height', "100") // sets height 
        .attr('x', "-50") // sets x position (relative to circle) 
        .attr('y', "-50") // sets y position (relative to circle) 
        .attr("xlink:href", function(d) { return d.pLink; })
        // uses link to image from csv data 
        .attr("pointer-events", "none"); 
        // prevents interference with drag function 
    
    
    /* Append circle to make rectangular images appear circular */ 
    /* (Alternative idea is to use circular png images) */
    node.append("circle") // append new circle 
        .style("fill", "none") // eliminate fill 
        .attr("r", function(d){ return d.radius + 14 }) 
        // set radius to scaled-up radius + 14 
        .style("stroke", "#fff") 
        // set circle color to white 
        .style("stroke-width", function(d) { 
            if (d.painting != "") return "0";
            // if circle is not a painter, do not display circle 
            else return "30";
            // if circle is a painter, set stroke width to 30 
        });

    
    /* Define function to create nodes */ 
    function create_nodes(data,node_counter) { 
        var i = cs.indexOf(data[node_counter].group), 
            // sets i to the element of cs at the index of the current node 
            // In other words, i is the current cluster number (ex: 2)
            d = { 
                cluster: i, // sets d.cluster to i 
                radius: data[node_counter].size*1.2, // scales up circle sizes 
                painter: data[node_counter].painter, // sets d.painter 
                x: Math.cos(i / m * 2 * Math.PI) * 200 + width / 2 + Math.random(), // sets d.x 
                y: Math.sin(i / m * 2 * Math.PI) * 200 + height / 2 + Math.random(), // sets d.y 
                color: data[node_counter].color, // sets d.color 
                painting: data[node_counter].painting, // sets d.painting 
                pLink: data[node_counter].pLink, // sets d.pLink
                link: data[node_counter].link, // sets d.link 
                c0: data[node_counter].c0, // sets d.c0 
                c1: data[node_counter].c1, // sets d.c1 
                c2: data[node_counter].c2, // sets d.c2 
                c3: data[node_counter].c3, // sets d.c3 
                c4: data[node_counter].c4, // sets d.c4 
                c5: data[node_counter].c5, // sets d.c5 
                c6: data[node_counter].c6, // sets d.c6 
                c7: data[node_counter].c7 // sets d.c7 
            };
        if (!clusters[i]) clusters[i] = d;
        // sets data of current cluster to d if clusters[i] is empty
        return d; // returns d 
    };


    /* Define tick function */ 
    function tick(e) {
        node.each(cluster(20 * e.alpha * e.alpha)) 
            // determines the speed at which nodes cluster together 
            .each(collide(.7)) 
            // determines the speed at which nodes repel upon collision 
        .attr("transform", function (d) { 
            
            /* Set bounds for nodes to reside within */ 
            if (d.x > 1200) d.x = 1200; 
            // d.x is too far right, set to width (or 1200) 
            if (d.x < -400) d.x = -400; 
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

