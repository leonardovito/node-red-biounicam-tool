const { allowedNodeEnvironmentFlags, stdout } = require('process');

module.exports = function(RED) {
    function ExtractIntronFromCuffGtf(config) {
        
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
            jaraddr = 'C:/Users/' + username + '/.node-red/node_modules/extract_intron_from_cuff_gtf/lib/ExtractIntroFromCuff.jar'
        } else {
            jaraddr = "~/.node-red/node_modules/extract_intron_from_cuff_gtf/lib/ExtractIntroFromCuff.jar";
        }

        this.fasta = config.fasta;
        this.cuff = config.cuff;
        this.pathfolder = config.pathfolder;
        this.outputname = config.outputname;
        this.flanking = config.flanking;

        var command;
        if(node.flanking == "" || node.flanking == null) {
            command = 'java -jar ' + jaraddr + ' -fa ' + node.fasta + ' -cu ' + node.cuff +  ' -out ' + node.outputname + ' -path ' + node.pathfolder;
        } else {
            command = 'java -jar ' + jaraddr + ' -fa ' + node.fasta + ' -cu ' + node.cuff +  ' -out ' + node.outputname + ' -path ' + node.pathfolder + ' -f ' + node.flanking;
        }
        
        node.on('input', function(msg) {
            if(node.fasta==null || node.fasta=='') {
                if(msg.payload.flanking == "" || msg.payload.flanking == null) {
                    command = 'java -jar ' + jaraddr + ' -fa ' + msg.payload.fasta + ' -cu ' + msg.payload.cuff +  ' -out ' + msg.payload.outputname + ' -path ' + msg.payload.pathfolder;
                } else {
                    command = 'java -jar ' + jaraddr + ' -fa ' + msg.payload.fasta + ' -cu ' + msg.payload.cuff +  ' -out ' + msg.payload.outputname + ' -path ' + msg.payload.pathfolder + ' -f ' + msg.payload.flanking;
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

               /*if(isJson(stdout)){
                    msg.payload = JSON.parse(stdout).process
                }

                msg.payload = stdout;*/
                
            })
        });
    }
    RED.nodes.registerType("extract_intron_from_cuff_gtf",ExtractIntronFromCuffGtf);
}