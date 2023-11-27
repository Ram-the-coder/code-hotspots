const { exec } = require("child_process");

async function getHotspots(directory) {
  return new Promise((resolve, reject) => {
    const cmd = `cd "${directory}" && git log --name-only --pretty="format:" | sed "/^\s*$/"d | sort | uniq -c | sort -r`;
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return reject(error);
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return reject(error);
      }
      const files = stdout
        .split("\n")
        .map((l) => l.trim())
        .map((l) => ({
          commits: parseInt(l.substring(0, l.indexOf(" "))),
          name: l.substring(l.indexOf(" ") + 1),
        }))
        .filter(({ commits }) => Boolean(commits));

      const filesByExtension = {};
      files.forEach((file) => {
        const extensionMatches = file.name.match(/\.[\w.]+$/);
        const extension = extensionMatches
          ? extensionMatches[0]
          : extensionMatches;
        if (!filesByExtension[extension])
          filesByExtension[extension] = { files: [], totalCommits: 0 };
        filesByExtension[extension].files.push(file);
        filesByExtension[extension].totalCommits += file.commits;
      });

      return resolve(filesByExtension);
    });
  });
}

module.exports = { getHotspots };
