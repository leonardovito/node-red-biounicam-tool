const { allowedNodeEnvironmentFlags, stdout } = require('process');

module.exports = function(RED) {
    function IncrementFastaContig(config) {
        
        function isJson(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        }

        RED.nodes.createNode(this,config);
        var node = this;

        var os = process.platform;
        var jaraddr = "";
        
        if(os == "win32") {
            var useros = require('os');
            var username = useros.userInfo().username;
            jaraddr = 'C:/Users/' + username + '/.node-red/node_modules/increment_fasta_contig/lib/IncremetingConting.jar'
        } else {
            jaraddr = "~/.node-red/node_modules/increment_fasta_contig/lib/IncremetingConting.jar";
        }

        this.fasta = config.fasta;
        this.pathfolder = config.pathfolder;
        this.outputname = config.outputname;

        let command = 'java -jar ' + jaraddr + ' -f ' + node.fasta + ' -path ' + node.pathfolder + ' -out ' + node.outputname;

        node.on('input', function(msg) {
            console.log(msg.payload.fasta)
            /*if(isJson(msg.payload)) {
                console.log(msg.payload)
                var obj = JSON.parse(msg.payload);
                if(obj.status = "done") {
                    command = 'java -jar ' + jaraddr + ' -f ' + obj.path + ' -path ' + node.pathfolder + ' -out ' + node.outputname;
                }
            }*/
            if(node.fasta==null || node.fasta=='') {
                command = 'java -jar ' + jaraddr + ' -f ' + msg.payload.fasta + ' -path ' + msg.payload.pathfolder + ' -out ' + msg.payload.outputname;
            }
            console.log(command)
            const exec = require('child_process').exec;
            const childPorcess = exec(command, function(err, stdout, stderr) {
                if (err) {
                    console.log(err)
                }

                msg.payload = stdout;
                console.log(stdout)

                if(isJson(stdout)){
                    msg.payload = JSON.parse(stdout).process
                }
                //stdout = stdout.slice(0, -3) + ',"path":"' + node.pathfolder + '/' + node.outputname + '"}'
                //console.log(stdout)
                node.send(msg);
            })
        });
    }
    RED.nodes.registerType("increment_fasta_contig",IncrementFastaContig);
}