const { existsSync, mkdirSync, readdirSync, statSync, symlinkSync } = require('fs');

// recursively create directories until target directory exists
const mkdirpSync = async(target) => {
  const parts = target.split('/');
  const parentPath = parts.slice(0, -1).join('/');

  if (! await existsSync(parentPath)) {
    await mkdirpSync(parentPath);
  }

  if (! await existsSync(target)) {
    await mkdirSync(target);
  }
}

// symlink all files from source directory into target directory
// directories are traversed and created if missing in target
const symlinkAll = async(target, dest, pathBuilder = []) => {
  const files = await readdirSync(target);

  for (const file of files) {
    const filepath = `${target}/${file}`;

    if (await statSync(filepath).isDirectory()) {
      // if we have a folder, the last path should be built into final symlink
      // pathbuilder
      await symlinkAll(filepath, dest, pathBuilder.concat(filepath.split('/').slice(-1)));
    } else {
      const parts = filepath.split('/');
      const path = parts.slice(0, -1).join('/');
      const linkPath = pathBuilder.length > 0 ? `${dest}/${pathBuilder.join('/')}` : dest;

      await mkdirpSync(linkPath);

      if (! await existsSync(`${linkPath}/${file}`)) {
        await symlinkSync(`${path}/${file}`, `${linkPath}/${file}`);
      }
    }
  }
}

exports.symlinkAll = symlinkAll;
exports.mkdirpSync = mkdirpSync;
