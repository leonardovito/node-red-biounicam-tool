const { allowedNodeEnvironmentFlags, stdout } = require('process');

module.exports = function(RED) {
    function RemoveContingFromFasta(config) {
        
        /*function isJson(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        }*/
        
        RED.nodes.createNode(this,config);
        var node = this;

        var os = process.platform;
        var jaraddr = "";
        
        if(os == "win32") {
            var useros = require('os');
            var username = useros.userInfo().username;
            jaraddr = 'C:/Users/' + username + '/.node-red/node_modules/node-red-biounicam-tool/Remove_Conting_From_Fasta/lib/RemoveContingFromFasta.jar'
        } else {
            jaraddr = "~/.node-red/node_modules/node-red-biounicam-tool/Remove_Conting_From_Fasta/lib/RemoveContingFromFasta.jar";
        }

        this.fasta1 = config.fasta1;
        this.fasta2 = config.fasta2;
        this.pathfolder = config.pathfolder;
        this.outputname = config.outputname;

        var command = 'java -jar ' + jaraddr + ' -fa1 ' + node.fasta1 + ' -fa2 ' + node.fasta2 +  ' -out ' + node.outputname + ' -path ' + node.pathfolder;
       
        
        node.on('input', function(msg) {
            if(node.fasta==null || node.fasta=='') {
                command = 'java -jar ' + jaraddr + ' -fa1 ' + msg.payload.fasta1 + ' -fa2 ' + msg.payload.fasta2 +  ' -out ' + msg.payload.outputname + ' -path ' + msg.payload.pathfolder;
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

               /*if(isJson(stdout)){
                    msg.payload = JSON.parse(stdout).process
                }

                msg.payload = stdout;*/
                
            })
        });
    }
    RED.nodes.registerType("remove_conting_from_fasta",RemoveContingFromFasta);
}