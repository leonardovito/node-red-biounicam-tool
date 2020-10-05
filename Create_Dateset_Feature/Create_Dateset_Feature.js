const { notDeepEqual } = require('assert');
const { allowedNodeEnvironmentFlags, stdout } = require('process');

module.exports = function(RED) {
    function Create_Dateset_Feature(config) {        
        RED.nodes.createNode(this,config);
        var node = this;

        var os = process.platform;
        var command = "";
        this.fileirf = config.fileirf;
        this.fileinrf = config.fileinrf;
        this.fileird = config.fileird;
        this.fileinrd = config.fileinrd;
        this.pathfolder = config.pathfolder;
        this.pNu = config.pNu;
        this.kMir = config.kMir;
        this.nf = config.nf;
        this.eNt = config.eNt;
        this.ni = config.ni;
        this.nni = config.nni;
        
        if(os == "win32") {
            var useros = require('os');
            var username = useros.userInfo().username;
            command = '"C:/Program Files/R/R-4.0.2/bin/Rscript.exe" C:/Users/' + username + '/.node-red/node_modules/node-red-biounicam-tool/Create_Dateset_Feature/lib/dataFrameGenerator.R -irfasta=' + node.fileirf + ' -inrfasta=' + node.fileinrf + ' -path=' + node.pathfolder;
        } else {
            command = 'Rscript ~/.node-red/node_modules/node-red-biounicam-tool/Create_Dateset_Feature/lib/dataFrameGenerator.R -irfasta=' + node.fileirf + ' -inrfasta=' + node.fileinrf + ' -path=' + node.pathfolder;
        }

        if(node.fileird != "") {
            command = command + ' -irdot=' + node.fileird
        }

        if(node.fileinrd != "") {
            command = command + ' -inrdot=' + node.fileinrd
        }

        if(node.pNu == "yes") {
            command = command + ' --pNu'
        }

        if(node.kMir == "yes") {
            command = command + ' --kMir'
        }

        if(node.nf != "") {
            command = command + ' -nf=' + node.nf
        }

        if(node.eNt == "yes") {
            command = command + ' --eNt'
        }

        if(node.ni != "") {
            command = command + ' -ni=' + node.ni
        }

        if(node.nni != "") {
            command = command + ' -nni=' + node.nni
        }
       
        
        node.on('input', function(msg) {
            if(node.fileirf==null || node.fileirf=='') {
                if(os == "win32") {
                    var useros = require('os');
                    var username = useros.userInfo().username;
                    command = '"C:/Program Files/R/R-4.0.2/bin/Rscript.exe" C:/Users/' + username + '/.node-red/node_modules/node-red-biounicam-tool/Create_Dateset_Feature/lib/dataFrameGenerator.R -irfasta=' + msg.payload.fileirf + ' -inrfasta=' + msg.payload.fileinrf + ' -path=' + msg.payload.pathfolder;
                } else {
                    command = 'Rscript ~/.node-red/node_modules/node-red-biounicam-tool/Create_Dateset_Feature/lib/dataFrameGenerator.R -irfasta=' + msg.payload.fileirf + ' -inrfasta=' + msg.payload.fileinrf + ' -path=' + msg.payload.pathfolder;
                }

                if(msg.payload.fileird != "") {
                    command = command + ' -irdot=' + msg.payload.fileird
                }
        
                if(msg.payload.fileinrd != "") {
                    command = command + ' -inrdot=' + msg.payload.fileinrd
                }
        
                if(msg.payload.pNu == "yes") {
                    command = command + ' --pNu'
                }
        
                if(msg.payload.kMir == "yes") {
                    command = command + ' --kMir'
                }
        
                if(msg.payload.nf != "") {
                    command = command + ' -nf=' + msg.payload.nf
                }
        
                if(msg.payload.eNt == "yes") {
                    command = command + ' --eNt'
                }
        
                if(msg.payload.ni != "") {
                    command = command + ' -ni=' + msg.payload.ni
                }
        
                if(msg.payload.nni != "") {
                    command = command + ' -nni=' + msg.payload.nni
                }
        }
        console.log(command)
        const exec = require('child_process').exec;
        const childPorcess = exec(command, function(err, stdout, stderr) {
            if (err) {
                console.log(err);
                msg.payload.stdout = "Error";
                node.send(msg);
            }
            else{
                msg.payload.stdout = stdout;
                node.send(msg);
            }
        })
    });
}
RED.nodes.registerType("create_dateset_feature",Create_Dateset_Feature);
}