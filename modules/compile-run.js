const { spawn } = require('child_process');
const path = require('path');
const ROOT = process.env.ROOT_PATH;

const run = (projectPath, category) => {
    const sourcePath = path.resolve(ROOT, projectPath); // TODO
    
    let docker = null;
    switch(category.toLowerCase()) {
        case "java":
            docker = spawn("docker", ["run", "--rm", "-i", "-v", `${sourcePath}:/src`, "java-compile-run:1.0"]);
            break;
        case "c": case "cpp":
            docker = spawn("docker", ["run", "--rm", "-i", "-v", `${sourcePath}:/src`, "c-compile-run:1.0"]);
            break;
    }

    return docker;
};

module.exports = { run };
