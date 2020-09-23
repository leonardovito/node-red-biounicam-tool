const { allowedNodeEnvironmentFlags, stdout } = require('process');

module.exports = function(RED) {
    function ExtractIntronFromStringTie(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var os = process.platform;
        var jaraddr = "";
        
        if(os == "win32") {
            var useros = require('os');
            var username = useros.userInfo().username;
            jaraddr = 'C:/Users/' + username + '/.node-red/node_modules/node-red-biounicam-tool/Extract_Intron_From_String_Tie/lib/extractIntronFromStringTie.jar'
        } else {
            jaraddr = "~/.node-red/node_modules/node-red-biounicam-tool/Extract_Intron_From_String_Tie/lib/extractIntronFromStringTie.jar";
        }

        this.fasta = config.fasta;
        this.st = config.st;
        this.pathfolder = config.pathfolder;
        this.outputname = config.outputname;
        this.start = config.start;

        var command;
        
        command = 'java -jar ' + jaraddr + ' -fa ' + node.fasta + ' -st ' + node.st +  ' -out ' + node.outputname + ' -path ' + node.pathfolder;
        
        if(node.start != "") {
            command = command + ' -start ' + node.start;
        }

        if(node.end != "") {
            command = command + ' -end ' + node.end;
         }

         if(node.contig != "") {
            command = command + ' -contig ' + node.contig;
         }

         if(node.strand != "") {
            command = command + ' -strand ' + node.strand;
         }

         if(node.coverage != "") {
            command = command + ' -coverage ' + node.coverage;
         }

         if(node.label != "" ) {
            command = command + ' -label ' + node.label;
         }
        
        node.on('input', function(msg) {

            if(node.fasta==null || node.fasta=="") {
                command = 'java -jar ' + jaraddr + ' -fa ' + msg.payload.fasta + ' -st ' + msg.payload.st +  ' -out ' + msg.payload.outputname + ' -path ' + msg.payload.pathfolder;
                
                if(msg.payload.start !== "") {
                    command = command + ' -start ' + msg.payload.start;
                 }

                 if(msg.payload.end !== "") {
                    command = command + ' -end ' + msg.payload.end;
                 }

                 if(msg.payload.contig !== "") {
                    command = command + ' -contig ' + msg.payload.contig;
                 }

                 if(msg.payload.strand !== "") {
                    command = command + ' -strand ' + msg.payload.strand;
                 }

                 if(msg.payload.coverage !== "") {
                    command = command + ' -coverage ' + msg.payload.coverage;
                 }

                 if(msg.payload.label !== "") {
                    command = command + ' -label ' + msg.payload.label;
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
    RED.nodes.registerType("extract_intron_from_string_tie",ExtractIntronFromStringTie);
}