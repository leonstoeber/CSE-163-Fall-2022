const margin = {
    left: 0, right: 0, top: 0, bottom: 0
}
const svgWidth = 700;
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

svg
.call(d3.zoom().on('zoom', () => {
    contentContainer.attr('transform', d3.event.transform)
}))

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

const tooltip = d3.select('#tooltip');
const tooltipTitle = d3.select('#tooltip #name');
for (let i = 0; i < 8; i++) {
    d3.select("#tooltip #pal") // selects div with id: "tooltip" and child id "pal"
    .append("rect") // appends rectangle 
    .attr("width", "25px") // sets width 
    .attr("height", "25") // sets height 
    .attr("x", i * 25) // sets x position 
    .attr("y", "10"); // sets y position 
}
const tooltipColors = d3.selectAll('#tooltip #pal > rect');
const tooltipImage = d3.select('#tooltip #image')
.append("svg:image") // appends image to svg 
.attr("height", "200px") // sets height 
.attr("width", "200px") // sets width 

const pTooltip = d3.select('#pTooltip');
const pTooltipName = d3.select('#pTooltip #pName')


const maxPaintingsPerPainter = 10;
const clusters = {};
const linkMap = {};

d3.csv('./raw-data.csv', (d) => {
    // painting data
    const data = {
        cluster: d['Artist Name'],
        // unique id of the painting, this is using the filename
        label: d['Filename'],
        // title of the painting, if none default to the filename
        name: d['Painting Title'] || d['Filename'],
        colors: [d['Color 1'], d['Color 2'], d['Color 3'], d['Color 4'], d['Color 5'], d['Color 6'], d['Color 7'], d['Color 8']],
        // links is an array of labels
        links: [d['Artist Name']],
        radius: 10,
        // store the src path of the painting
        src: `./paintings/${d['Filename']}`,
        painting: true,
        painter: false
    };

    if (clusters[data.cluster] && clusters[data.cluster].count >= maxPaintingsPerPainter) {
        return;
    }


    // convert the array of colors for each palette into more manageable values
    // this includes separating the RGB components and storing the hex value
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

    for (let i = 0; i < data.colors.length; i++) {
        if (!data.colors[i]) {
            data.colors.splice(i, 1);
            i -= 1;
        }
    }

    if (!clusters[data.cluster]) {
        clusters[data.cluster] = {count: 0};
    }
    clusters[data.cluster].count += 1;
    if (d['Artist Filename']) {
        clusters[data.cluster].src = d['Artist Filename'];
    }

    if (!linkMap[data.label]) {
        linkMap[data.label] = {};
    }

    if (!linkMap[data.cluster]) {
        linkMap[data.cluster] = {};
    }
 
    return data; 
}).then(async (data) => {

    // create a center node for each artist/cluster
    Object.entries(clusters).forEach(([key, value]) => {
        const {src} = value;
        const clusterData = {
            cluster: key,
            label: key,
            name: key,
            colors: [],
            // links is an array of labels
            links: [],
            radius: 20,
            // image of the painter
            src: src || '',
            painting: false,
            painter: true
        };
        data.push(clusterData);
    })

    const colorScheme = d3.schemeSet1;

    const linkContainer = contentContainer.append('g')
    .attr('class', 'link-container')

    const nodeContainer = contentContainer.append('g')
    .attr('class', 'node-container')

    

    const links = [];

    const dataMap = {}

    data.forEach((d) => {
        const node = nodeContainer.append(d.painter ? 'svg:image' : 'circle')
        .datum(d)
        .attr('class', 'node')
        .attr('id', d.label)
        .call(d3.drag()
            .on('start', (d) => {
                // prevent simulation restart on drag if simulation is disabled
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

        d.node = node;
        dataMap[d.label] = d;
    })
    data.forEach((d) => {
        const node = d.node;
        // add links to links
        d.links.forEach((label) => {
            // check if links already has this combination, key or value
            if (linkMap[label][d.label] || linkMap[d.label][label]) {
                return;
            }
            linkMap[d.label][label] = true;
            links.push({
                source: d.label,
                target: label,
                distance: d.radius + (dataMap[label].radius),
            })
        });
        
        if (d.painter) {
            node
            .attr('width', `${d.radius * 2}px`)
            .attr('height', `${d.radius * 2}px`)
            .attr('xlink:href', d.src || 'https://cdn.singulart.com/famous/artists/cropped/famous_artist_65_787b2120f9007faa11ee5dcc543b4148.jpeg')
            .attr('clip-path', `inset(0% round ${d.radius * 2}px)`)
            .style('transform', `translate(${-d.radius}px, ${-d.radius}px)`)
        } else {
            node
            .attr('r', d.radius)
            .attr('fill', () => {
                if (d.painting) {
                    return d.colors[0] ? `#${d.colors[0].hex}` : colorScheme[clusters[d.cluster]];
                }
                return '#000000ff';
            })
        }
    })

    const nodeCircles = nodeContainer.selectAll('.node')

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

    // create a selection of all lines
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