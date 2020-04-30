// Add your JavaScript code here/

const MAX_WIDTH = Math.max(1080, window.innerWidth);
console.log(MAX_WIDTH);
const MAX_HEIGHT = 720;
const margin = { top: 40, right: 100, bottom: 40, left: 175 };

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = MAX_WIDTH / 2 - 10,
    graph_1_height = 275;
let graph_2_width = MAX_WIDTH / 2 - 10,
    graph_2_height = 275;
let graph_3_width = MAX_WIDTH / 2 - 10,
    graph_3_height = 400;

const data_file = "./data/video_games.csv";

/**
 * Helper Functions
 */

function getDataSubset(data, comparator, numExamples) {
    // TODO: sort and return the given data with the comparator and the filter(extracting the desired number of examples)
    return data.sort(comparator).slice(0, numExamples);
}
