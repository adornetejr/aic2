var shortestJob = function (switchTime) {
    'use strict';

    this.switchTime = switchTime;

    this.time = 0;
    this.processEnded = false;

    // implementation shortestJob 
    this.tick = function () {  // happens in a single unit of time

    };
};

// static variables of the function
shortestJob.processFlagsIn = [
    {
        flag: 'name',  // attribute of the object to track
        name: 'Name',  // actual text to be displayed in the tables
        description: 'Name of the process',  // bootstrap's placeholders
        initial: "'process_' + Math.floor(Math.random()  * 1000)"  // will be called with eval()
    },
    {
        flag: 'arrival',
        name: 'Arrival',
        description: 'When the process is started by the user',
        initial: "0 + Math.floor(Math.random()  * 100)"
    },
    {
        flag: 'execution',
        name: "Length",
        description: 'Length of the process',
        initial: "10 + Math.floor(Math.random()  * 100)"
    }
];  // these flags tell what will be the inputs
shortestJob.processInternal = [{flag: 'id'}];  // these flags tell what extra details to store in the tape
shortestJob.processFlagsOut = [
    {flag: 'time', name: 'Position'},
    {flag: 'service', name: 'Service time'},
    {flag: 'wait', name: 'Waiting time'},
    {flag: 'end', name: 'Ending time'}
];  // these flags tell what to be captured as the result

shortestJob.algorithmFlagsIn = [
    {
        flag: 'switchTime',
        name: 'Algorithm Switch Time',
        description: 'Time taken for context switching',
        initial: "1"
    }
];
shortestJob.algorithmInternal = [{flag: 'switchAt'}, {flag: 'processEnded'}, {flag: 'currently'}];
shortestJob.algorithmFlagsOut = [{flag: 'time', name: 'Time'}];
