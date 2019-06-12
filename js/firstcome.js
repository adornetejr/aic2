var firstCome = function () {
    'use strict';

    this.switchTime = 0;
    // run a process if available instead of dispatcher at the beginning
    // it's zero = 0 when the dispatcher takes no time to switch
    this.time = 0;
    this.processEnded = false;

    this.tick = function () {  // happens in a single unit of time
        this.time += 1;  // increase time

        // there should be some processes to run, otherwise return the same this.queue given
        if (this.queue.length < 1) {
            // if idle, dispatcher has enough time - it should start the next process as soon as it arrives
            this.switchAt = (this.time) % (this.switchTime);
            this.currently = 'idle';
            return;
        }

        if (this.switchTime > 0) {  // dispatcher takes time to switch
        
        } else {  // dispatcher does not take time to switch
            if (this.queue[0].time == 0) {
                this.queue[0].service = this.time - 1;
                this.queue[0].wait = this.queue[0].service - this.queue[0].arrival;
            }

            this.queue[0].time += 1;
            this.currently = "" + this.queue[0].id;  // running state

            if (this.queue[0].time == this.queue[0].execution) {  // process has finished execution
                this.queue[0].end = this.time;
                this.endedQueue.push(this.queue.shift());  // do the process removal now
                this.switchAt = this.time;  // restart switch timer n.b.: this.switchTime = 0
            } else if (this.time == this.switchAt) {  // switchTime needed
                this.queue.push(this.queue.shift());  // perform task switchTime
            }
        }
    };
};

// static variables of the function
firstCome.processFlagsIn = [
    {
        flag: 'name',  // attribute of the object to track
        name: 'Name',  // actual text to be displayed in the tables
        description: 'Name of the process',  // bootstrap's placeholders
        initial: "'process_' + Math.floor(100 + (Math.random() * 900))"  // will be called with eval()
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

firstCome.processInternal = [{ flag: 'id' }];  // these flags tell what extra details to store in the tape

firstCome.processFlagsOut = [
    { flag: 'time', name: 'Position' },
    { flag: 'service', name: 'Service time' },
    { flag: 'wait', name: 'Waiting time' },
    { flag: 'end', name: 'Ending time' }
];  // these flags tell what to be captured as the result

firstCome.algorithmFlagsIn = [
];
firstCome.algorithmInternal = [{ flag: 'switchAt' }, { flag: 'processEnded' }, { flag: 'currently' }];
firstCome.algorithmFlagsOut = [{ flag: 'time', name: 'Time' }];
