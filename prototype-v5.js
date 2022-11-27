const margin = {
    left: 0, right: 0, top: 0, bottom: 0
}
const svgWidth = 900;
const svgHeight = 800;
const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

const svg = d3
.select('body')
.append('svg')
.attr('width', svgWidth)
.attr('height', svgHeight)

const contentContainer = svg.append('g')
.attr('class', 'container')
.attr('transform', `translate(${margin.left}, ${margin.top})`)
.style('user-select', 'none')
.style('pointer-events', 'all')


// zoom setup
//
// attaches zooming functionality to the svg as a whole
// the only element that will change size is the contentContainer, which contains all the nodes
svg
.call(d3.zoom().on('zoom', () => {
    contentContainer.attr('transform', d3.event.transform)
}))


// setup the force simulation
//
// this creates the forces that act on the nodes that will be added later on
const simulation = d3.forceSimulation()
.force('link', d3.forceLink()
    .id((d) => d.label)
    // this d is per link {source, target, etc..}
    .distance((d) => d.distance)
    // for strength, recommended max is 2, > 3 will cause crash
    .strength((d) => 1)
)
.force('charge', d3.forceManyBody().strength(0))
.force('center', d3.forceCenter(width / 2, height / 2))
.force('collision', d3.forceCollide((d) => d.radius).strength(.8))


// setup tooltips
//
// this selects the tooltips for the paintings and the painters to be modified later
const tooltip = d3.select('#tooltip');
const tooltipTitle = d3.select('#tooltip #name');
// creates the color rects for the painting tooltip, so they don't have to be recreated for every painting
for (let i = 0; i < 8; i++) {
    d3.select("#tooltip #pal") // selects div with id: "tooltip" and child id "pal"
    .append("rect") // appends rectangle 
    .attr("width", "25px") // sets width 
    .attr("height", "25") // sets height 
    .attr("x", i * 25) // sets x position 
    .attr("y", "10"); // sets y position 
}
const tooltipColors = d3.selectAll('#tooltip #pal > rect');
// as with the color rects, creates the svg image before hand so that it doesn't get created every time
const tooltipImage = d3.select('#tooltip #image')
.append("svg:image") // appends image to svg 
.attr("height", "200px") // sets height 
.attr("width", "200px") // sets width 
// painter tool tip
const pTooltip = d3.select('#pTooltip');
const pTooltipName = d3.select('#pTooltip #pName')



// this limits the amount of paintings that a painter will have surrounding them
// this is for aesthetic purposes, it can be modified
const maxPaintingsPerPainter = 10;

// this object stores cluster data, which is the same as artist data
// its main use is for conveniently separating the creation of painting nodes and painter nodes
// its data will be filled inside the row converter
// key: artist name
// value: {src: 'path to the artist's image', count: number of paintings for the artist}
const clusters = {};

// this object stores link maps between two nodes
//
// this linkmap is special in that its values will also be maps {}
// this is to have two-way mappings, and will help to prevent duplicate links from being created
const linkMap = {};



// load the raw data from csv
//
d3.csv('./raw-data.csv', (d) => {
    // row converter

    // painting data
    const data = {
        cluster: d['Artist Name'],

        // unique id of the painting, this is using the filename
        label: d['Filename'],

        // title of the painting, if none default to the filename
        name: d['Painting Title'] || d['Filename'],

        // stores the colors into an array temporarily
        // at this stage, the colors are strings of form #abcdef
        colors: [d['Color 1'], d['Color 2'], d['Color 3'], d['Color 4'], d['Color 5'], d['Color 6'], d['Color 7'], d['Color 8']],

        // links is an array of labels
        links: [d['Artist Name']],

        radius: 20,

        // store the src path of the painting
        src: `./paintings/${d['Filename']}`,

        // convenience properties that show that this is a painting node and not a painter node
        // painter nodes are created later from cluster data
        painting: true,
        painter: false
    };

    // skips the painting if the amount of paintings for that artist has reached the max paintings number
    if (clusters[data.cluster] && clusters[data.cluster].count >= maxPaintingsPerPainter) {
        return;
    }


    // convert the array of colors for each palette into more manageable values
    // this includes separating the RGB components and storing the hex value
    // example: '#ff0000' -> {r: 255, g: 0, b: 0, hex: 'ff0000'}
    data.colors = data.colors.map((string) => {
        if (!string) {
            return;
        }
        // remove #
        if (string.charAt(0) === '#') {
            string = string.substr(1);
        }
        const r = parseInt(string.substr(0, 2), 16);
        const g = parseInt(string.substr(2, 2), 16);
        const b = parseInt(string.substr(4, 2), 16);
        return {r, g, b, hex: string};
    })

    // removes undefined colors in the colors array
    for (let i = 0; i < data.colors.length; i++) {
        if (!data.colors[i]) {
            data.colors.splice(i, 1);
            i -= 1;
        }
    }


    // stores new clusters into the clusters map
    // this data will keep track of the painting count of each artist, as well as the artist's picture's path
    if (!clusters[data.cluster]) {
        clusters[data.cluster] = {count: 0};
    }
    clusters[data.cluster].count += 1;
    if (d['Artist Filename']) {
        clusters[data.cluster].src = `./painters/${d['Artist Filename']}`;
    }


    // creates a map for the specific label in the linkmap, which will be used to map back to the original label
    if (!linkMap[data.label]) {
        linkMap[data.label] = {};
    }

    if (!linkMap[data.cluster]) {
        linkMap[data.cluster] = {};
    }
 
    return data; 
}).then(async (data) => {

    // create a center node for each artist/cluster
    // uses the cluster data stored in the clusters map
    Object.entries(clusters).forEach(([key, value]) => {

        // extracts the src property from the value object
        const {src} = value;

        // creates the clusterData mimicking painting data
        // this will make it act like a node that will be able to be dragged around and interacted with
        // similarly to painting nodes, with less errors
        const clusterData = {
            
            // note that the key here is the exact name of the artist
            cluster: key,
            label: key,
            name: key,
            colors: [],
            // links is an array of labels
            links: [],
            radius: 40,
            // image of the painter
            src: src || '',
            painting: false,
            painter: true
        };

        // adds the data to the loaded data, to be among the nodes
        data.push(clusterData);
    })


    // create containers for links and nodes
    // links will be displayed as lines
    const linkContainer = contentContainer.append('g')
    .attr('class', 'link-container')

    const nodeContainer = contentContainer.append('g')
    .attr('class', 'node-container')

    
    // the array of links that will be passed into the simulation
    // this will contain the source and target data
    // links are stored as objects with source and target properties that are just ids
    // these ids correspond with the ids of the nodes that will be added later on
    // the simulation will use the links to move the relevant nodes appropriately
    const links = [];

    // dataMap maps the data's id to the data object itself
    // this is for convenience so that data for any id can be accessed anywhere below given an id/label
    const dataMap = {}


    
    // node creation
    //
    data.forEach((d) => {

        // create a node based on whether the current datum is a painter or not
        // if it is a painter, it will create an svg image, which will have the image of the artist on it
        // otherwise, it will default to a svg circle, which represents a painting
        const node = nodeContainer.append(d.painter ? 'svg:image' : 'circle')
        // attaches the datum to the node
        .datum(d)
        .attr('class', 'node')
        .attr('id', d.label)
        // setup the drag functionality of the nodes
        .call(d3.drag()
            .on('start', (d) => {

                if (!d3.event.active) {
                    simulation.alphaTarget(.3).restart();
                }
                d.fx = d.x;
                d.fy = d.y;
                d.dragging = true;
            })
            .on('drag', (d) => {
                d.fx = d3.event.x;
                d.fy = d3.event.y;
                d.node.attr(d.painting ? 'cx' : 'x', d3.event.x);
                d.node.attr(d.painting ? 'cy' : 'y', d3.event.y);
                d.x = d3.event.x;
                d.y = d3.event.y;

                // hide tooltip if dragging
                tooltip.style('display', 'none')
                pTooltip.style('display', 'none')
            })
            .on('end', (d) => {
                if (!d3.event.active) {
                    simulation.alphaTarget(.3)
                }
                d.fx = null;
                d.fy = null;
                d.dragging = false;
            })
        )
        // setup the mouseover tooltip functionality of the nodes
        // note that there are different branches based on whether the node is of a painting or a painter
        // this will show and modify the respective tooltip to show either the painter or painting data
        .on('mouseover', (d) => {

            if (d.dragging) {
                return;
            }

            if (d.painting) {
    
                let i = 0;
                tooltipColors
                .attr("fill", () => {
                    if (!d.colors) {
                        return '#00000000';
                    }
                    const color = `#${d.colors[i] !== undefined ? d.colors[i].hex : '00000000'}`;
                    i++;
                    return color;
                }) // sets fill to first color from data
    
                // set the painting title
                tooltipTitle.text(d.name);
    
                // set the painting image src
                tooltipImage.attr("xlink:href", d.src);
    
            } else {
    
                // set the painter name
                pTooltipName.text(d.name);
    
            }
    
        })
        .on('mousemove', (d) => {

            if (d.dragging) {
                return;
            }
    
            const e = d3.event;
    
            if (d.painting) {
                tooltip
                .style('display', 'block')
                .style('left', `${e.clientX + 10}px`)
                .style('top', `${e.clientY + 10}px`)
            } else {
                pTooltip
                .style('display', 'block')
                .style('left', `${e.clientX + 10}px`)
                .style('top', `${e.clientY + 10}px`)
            }
    
        })
        .on('mouseout', (d) => {

            if (d.dragging) {
                return;
            }
    
            if (d.painting) {
                tooltip.style('display', 'none')
            } else {
                pTooltip.style('display', 'none')
            }
    
        })

        // stores the node as a property of the data
        // this is for easy access to the node
        d.node = node;

        // lastly, the data is stored to the key of its label in the dataMap
        dataMap[d.label] = d;
    })



    // link creation
    //
    data.forEach((d) => {
        const node = d.node;

        // add links to links
        d.links.forEach((label) => {
            // check if links already has this combination, key or value
            if (linkMap[label][d.label] || linkMap[d.label][label]) {
                return;
            }

            // registers that the link between source and target labels
            linkMap[d.label][label] = true;

            // creates a link object containg the source, target, and distance
            // the distance is used in the force simulation callback in the simulation setup
            // making the distance long enough to avoid clipping collisions will make the simulation stable
            // that is why the source and target radii are added together
            links.push({
                source: d.label,
                target: label,
                distance: d.radius + (dataMap[label].radius),
            })
        });
        

        // if the data is of a painter, setup the image, otherwise setup the circle
        if (d.painter) {
            node
            .attr('width', `${d.radius * 2}px`)
            .attr('height', `${d.radius * 2}px`)
            .attr('xlink:href', d.src || './painters/edvard-munch.png')
            .attr('clip-path', `inset(0% round ${d.radius * 2}px)`)
            .attr('preserveAspectRatio', 'xMinYMin slice')
            .style('transform', `translate(${-d.radius}px, ${-d.radius}px)`)
        } else {
            node
            .attr('r', d.radius)
            .attr('fill', () => {
                if (d.painting) {
                    return d.colors[0] ? `#${d.colors[0].hex}` : '#000000ff';
                }
                return '#000000ff';
            })
        }
    })


    // store the d3 selection of all nodes into a variable called nodeCircles
    const nodeCircles = nodeContainer.selectAll('.node')


    // creates the svg lines that connect nodes
    linkContainer.selectAll('line')
    .data(links).enter()
    .append('line')
    .attr('class', 'link')
    .each((d, i, nodes) => {
        // add link line reference to each data point
        Array.from([d.source, d.target]).forEach((label) => {
            if (!dataMap[label].lines) {
                dataMap[label].lines = [];
            }
            dataMap[label].lines.push(nodes[i]);
        })
        // store the source and target nodes in the link
        d.sourceNode = dataMap[d.source].node;
        d.targetNode = dataMap[d.target].node;
        // store the link data in the line itself
        nodes[i].linkData = d;
    })
    .attr('stroke', 'gray')

    // create a d3 selection of all lines
    const linkLines = linkContainer.selectAll('line');

    // for every simulation tick, when it is running
    // use the original data as the nodes
    simulation.nodes(data)
    .on('tick', () => {

        // update link lines to connect the source and target
        linkLines
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y)

        // update node circle positions
        nodeCircles
        .attr('cx', (d) => d.x)
        .attr('cy', (d) => d.y)
        .attr('x', (d) => d.x)
        .attr('y', (d) => d.y)
    })

    // set the links for the simulation
    simulation.force('link')
    .links(links);
})