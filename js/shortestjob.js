var sortByKey = function (objArray, key) {
    // sorts objects using the given key
    objArray.sort(function (o1, o2) {
        return o1[key] - o2[key];
    });
};

var shortestJob = function () {
    'use strict';

    // run a process if available instead of dispatcher at the beginning
    // it's zero = 0 when the dispatcher takes no time to switch
    this.time = 0;
    this.processEnded = false;

    this.tick = function () {  // happens in a single unit of time
        this.time += 1;  // increase time

        // there should be some processes to run, otherwise return the same this.queue given
        if (this.queue.length < 1) {
            // if idle, dispatcher has enough time - it should start the next process as soon as it arrives
            this.switchAt = this.time;
            this.currently = 'idle';
            return;
        }
        if (this.queue.length == 1) {  // dispatcher takes time to switch
            if (this.queue[0].time == 0) {
                this.queue[0].service = this.time - 1;
                this.queue[0].wait = this.queue[0].service - this.queue[0].arrival;
            }

            this.queue[0].time += 1;
            this.currently = "" + this.queue[0].id;  // running state

            if (this.queue[0].time == this.queue[0].execution) {  // process has finished execution
                this.queue[0].end = this.time;
                this.endedQueue.push(this.queue.shift());  // do the process removal now
            }
        } else if (this.queue.length > 1) {

            sortByKey(this.queue, 'execution');  // sort by execution time

            console.log((this.queue[1].execution - this.queue[1].time) + ' < ' + (this.queue[0].execution - this.queue[0].time));
            if ((this.queue[1].execution - this.queue[1].time) < (this.queue[0].execution - this.queue[0].time)) {  // switchTime needed
                this.currently = 'waste';
                this.queue.push(this.queue.shift());
            }


            if ((this.queue[0].time == 0) && (this.queue[0].service == 0)) {
                this.queue[0].service = this.time - 1;
                this.queue[0].wait = this.queue[0].service - this.queue[0].arrival;
            }
            this.queue[0].time += 1;
            this.currently = "" + this.queue[0].id;  // running state

            if (this.queue[0].time == this.queue[0].execution) {  // process has finished execution
                this.queue[0].end = this.time;
                this.endedQueue.push(this.queue.shift());  // do the process removal now
                this.currently = 'waste';
                this.switchAt = this.time;  // restart switch timer n.b.: this.switchTime = 0
            } else if (this.time == this.switchAt) {  // switchTime needed
                this.currently = 'waste';
                this.queue.push(this.queue.shift());
            }
        }
    }
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
shortestJob.processInternal = [{ flag: 'id' }];  // these flags tell what extra details to store in the tape
shortestJob.processFlagsOut = [
    { flag: 'time', name: 'Position' },
    { flag: 'service', name: 'Service time' },
    { flag: 'wait', name: 'Waiting time' },
    { flag: 'end', name: 'Ending time' }
];  // these flags tell what to be captured as the result

shortestJob.algorithmFlagsIn = [
];
shortestJob.algorithmInternal = [{ flag: 'switchAt' }, { flag: 'processEnded' }, { flag: 'currently' }];
shortestJob.algorithmFlagsOut = [{ flag: 'time', name: 'Time' }];
