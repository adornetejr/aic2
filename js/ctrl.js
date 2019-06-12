app.controller('ctrl', function ($scope, $interval) {
    $scope.level = 0;  // track current level of input to display the panel needed

    // level 0 /////////////////////////////////////////////////////////////////////////////////////////////////////////
    $scope.getAvailableAlgorithmNames = function () {  // list of available algorithms
        return algorithms.map(function (element) {
            return element.name;
        })
    };
    $scope.selectAlgorithm = function (name) {  // select an algorithm by name
        for (var ai = 0; ai < algorithms.length; ai++) {
            if (algorithms[ai].name == name) {
                $scope.selectedAlgorithm = algorithms[ai];
                $scope.algorithmParameters = algorithms[ai].func.algorithmFlagsIn;
                $scope.algorithmArguments = {};
                for (var aai = 0; aai < $scope.algorithmParameters.length; aai++) {
                    $scope.algorithmArguments[$scope.algorithmParameters[aai].flag]
                        = eval($scope.algorithmParameters[aai].initial);
                }
            }
        }
    };
    $scope.selectedAlgorithm = algorithms[0];  // here, the algorithm is an object with a name and a function
    $scope.algorithmParameters = algorithms[0].func.algorithmFlagsIn;
    $scope.algorithmArguments = (function () {
        var args = {};
        for (var aai = 0; aai < $scope.algorithmParameters.length; aai++) {
            args[$scope.algorithmParameters[aai].flag]
                = eval($scope.algorithmParameters[aai].initial);
        }
        return args;
    })();
    $scope.createScheduler = function () {
        var scheduler = new Scheduler($scope.selectedAlgorithm.func);
        var args = [];
        for (var aci = 0; aci < $scope.algorithmParameters.length; aci++) {
            args.push(Number($scope.algorithmArguments[$scope.algorithmParameters[aci].flag]));
        }
        scheduler.algorithm.apply(scheduler, args);
        $scope.scheduler = scheduler;

        ////////remove-here
        document.getElementById("insert-file").style.display = "none";
        document.getElementById("panel-file-list").style.display = "none";
        $scope.level = 1;  // increase level
    };
    $scope.isValidScheduler = function () {
        return _.every(_.values($scope.algorithmArguments), function (val) {
            return _.isFinite(val) && val >= 0 && val % 1 == 0;
        })
    };
    $scope.scheduler = null;  // IMPORTANT FOR THE FINAL OUTPUT!

    // level 1 /////////////////////////////////////////////////////////////////////////////////////////////////////////
    $scope.processParameters = $scope.selectedAlgorithm.func.processFlagsIn;
    $scope.processArguments = {};
    $scope.clearProcess = function () {
        var args = {};
        for (var pai = 0; pai < $scope.processParameters.length; pai++) {
            args[$scope.processParameters[pai].flag]
                = eval($scope.processParameters[pai].initial);  // evaluate initial value
        }
        $scope.processArguments = args;
    };
    $scope.clearProcess();
    $scope.isValidProcess = function () {
        return _.every(_.keys($scope.processArguments), function (key) {
            var val = $scope.processArguments[key];
            return (_.isFinite(val) && val >= 0) || (key == 'name' && val);  // name may not be a number
        })
    };
    $scope.processes = [];  // IMPORTANT FOR THE FINAL OUTPUT!
    $scope.maxProcessId = 0;
    $scope.addProcess = function () {
        $scope.processArguments.id = ++$scope.maxProcessId;  // this is an internal flag
        _.forEach($scope.selectedAlgorithm.func.processFlagsOut, function (flag) {
            $scope.processArguments[flag.flag] = 0;  // make all out flags zero
        });
        $scope.processes.push($scope.processArguments);
        $scope.clearProcess();
    };
    $scope.clearProcesses = function () {
        $scope.processes = [];
        $scope.maxProcessId = 0;
    };
    $scope.handleDragOver = function (e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    };
    $scope.handleFileSelect = function (e) {
        e.stopPropagation();
        e.preventDefault();
        var files = e.dataTransfer.files; // FileList object.
        // files is a FileList of File objects. List some properties.
        var output = [];
        for (var i = 0, f; f = files[i]; i++) {
            output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                f.size, ' bytes, last modified: ',
                f.lastModifiedDate.toLocaleDateString(), '</li>');

        }
        document.getElementById("drop-zone").style.display = "none";
        document.getElementById("file-dropped").style.display = "block";
        document.getElementById('file-dropped').innerHTML = '<ul>' + output.join('') + '</ul>';
        document.getElementById("panel-file-list").style.display = "block";
        $scope.handleFiles(files);
    };
    $scope.handleFiles = function (files) {
        // Check for the various File API support.
        if (window.FileReader) {
            // FileReader are supported.
            getAsText(files[0]);
        } else {
            alert('FileReader are not supported in this browser.');
        };
        function getAsText(fileToRead) {
            var reader = new FileReader();
            // Handle errors load
            reader.onload = loadHandler;
            reader.onerror = errorHandler;
            // Read file into memory as UTF-8      
            reader.readAsText(fileToRead);
        };
        function errorHandler(evt) {
            if (evt.target.error.name == "NotReadableError") {
                alert("Canno't read file!");
            };
        };
        function loadHandler(event) {
            var csv = event.target.result;
            $scope.processData(csv);
        };
    };
    $scope.processData = function (csv) {
        var allTextLines = csv.split(/\r\n|\n/);
        var lines = [];
        while (allTextLines.length) {
            lines.push(allTextLines.shift().split(' '));
        }
        $scope.drawInput(lines);
        $scope.loadProcesses(lines);
    };
    $scope.drawInput = function (lines) {
        //Clear previous data
        document.getElementById("file-process-list").innerHTML = "";
        var table = document.createElement("table");
        table.style.width = "100%";

        var tableHeader = table.insertRow(-1);
        for (var pai = 0; pai < $scope.processParameters.length; pai++) {
            var el = document.createElement("TH");
            el.innerHTML = $scope.processParameters[pai].name
            tableHeader.style.padding = "8px";
            tableHeader.appendChild(el);
        }
        for (var i = 0; i < lines.length; i++) {
            var row = table.insertRow(-1);
            for (var j = 0; j < lines[i].length; j++) {
                var cell = row.insertCell(-1);
                cell.className = "col-sm-4";
                cell.style.padding = "8px";
                cell.style.paddingLeft = "0px";
                if (lines[i][j] == '') {
                    //do nothing
                }
                else {
                    if (j == 0) {
                        cell.appendChild(document.createTextNode("process_0"));
                    }
                    cell.appendChild(document.createTextNode(lines[i][j]));
                }
            }
        }
        document.getElementById("file-process-list").appendChild(table);
    };
    $scope.loadProcesses = function (lines) {
        for (var i = 0; i < lines.length; i++) {
            var j = -1;
            if (lines[i][0] == '') {
                alert("There are values missing from .txt file!");
            }
            else {
                _.forEach(_.keys($scope.processArguments), function (key) {
                    if (j == -1) {
                        value = 'process_0' + lines[i][++j];
                    } else {
                        value = lines[i][++j];
                    }
                    $scope.processArguments[key] = value;
                })
                $scope.processArguments.id = i;
                ++$scope.maxProcessId;  // this is an internal flag
                _.forEach($scope.selectedAlgorithm.func.processFlagsOut, function (flag) {
                    $scope.processArguments[flag.flag] = 0;  // make all out flags zero
                });
                $scope.processes.push($scope.processArguments);
                $scope.clearProcess();
            }
        }
    };
    $scope.insertProcesses = function () {
        document.getElementById("panel-file-list").style.display = "none";
        $scope.clearProcess();
    };
    $scope.addFile = function () {
        document.getElementById("insert-file").style.display = "block";
        document.getElementById("drop-zone").style.display = "block";
        ////////remove-here        
        document.getElementById("panel-file-list").style.display = "none";
        document.getElementById("file-dropped").style.display = "none";
        // Setup the dnd listeners.
        var dropZone = document.getElementById('drop-zone');
        dropZone.addEventListener('dragover', $scope.handleDragOver, false);
        dropZone.addEventListener('drop', $scope.handleFileSelect, false);
    }
    $scope.clearFile = function () {
        document.getElementById("insert-file").style.display = "none";
        document.getElementById("panel-file-list").style.display = "none";
        $scope.clearProcesses();
    }
    $scope.removeProcess = function (prc) {
        $scope.processes.splice($scope.processes.indexOf(prc), 1);
    };
    $scope.finishAddingProcesses = function () {
        $scope.level = 2;
    };

    // level 2 /////////////////////////////////////////////////////////////////////////////////////////////////////////
    $scope.speed = 2;
    $scope.isValidSim = function () {
        return _.isFinite($scope.speed) && $scope.speed > 0;
    };
    $scope.simulator = null;  // IMPORTANT !
    $scope.createSimulator = function () {
        $scope.simulator = new Simulator($scope.scheduler, 1000 / $scope.speed, $scope.processes);
        $scope.level = 3;
    };

    // level 3 /////////////////////////////////////////////////////////////////////////////////////////////////////////
    $scope.intervalHandler = null;
    $scope.playing = false;
    $scope.playOnce = function () {
        $scope.simulator.tick.apply($scope.simulator);

    };
    $scope.autoplay = function () {
        if (!$scope.playing) {
            $scope.intervalHandler = $interval($scope.playOnce, $scope.simulator.delay);
            $scope.playing = true;
        }
    };
    $scope.pause = function () {
        if ($scope.playing) {  // we can only pause if playing
            $interval.cancel($scope.intervalHandler);
            $scope.playing = false;
        }
    };

    $scope.addProcessJit = function () {
        $scope.processArguments.id = ++$scope.maxProcessId;
        _.forEach($scope.selectedAlgorithm.func.processFlagsOut, function (flag) {
            $scope.processArguments[flag.flag] = 0;  // make all out flags zero
        });
        $scope.simulator.createProcess($scope.processArguments);
        $scope.clearProcess();
    };

    $scope.timelineColors = ['danger', 'warning', 'info', 'success'];

    $scope.getTransition = function (index) {
        var currently = null;
        if (index < $scope.simulator.tape.length) {
            currently = $scope.simulator.tape[index].algorithm.currently;  // t = t
        } else {
            currently = $scope.simulator.scheduler.currently;
        }

        if (currently == 'idle') {

            return 'active';
        }
        else if (currently == 'waste') {
            return 'progress-bar-striped active';
        }
        else if (_.isFinite(currently)) {
            return 'progress-bar-' + $scope.timelineColors[currently % 4];
        }
        else {
            return "";
        }

    };

});
// TODO use underscore.js to simplify the above expressions
