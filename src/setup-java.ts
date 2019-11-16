import * as core from '@actions/core';
import * as installer from './installer';
import * as auth from './auth';
import * as path from 'path';

async function run() {
  try {
    let version = core.getInput('version');
    if (!version) {
      version = core.getInput('java-version', {required: true});
    }
    const arch = core.getInput('architecture', {required: true});
    const javaPackage = core.getInput('java-package', {required: true});
    const jdkFile = core.getInput('jdkFile', {required: false}) || '';

    await installer.getJava(version, arch, jdkFile, javaPackage);

    const username = core.getInput('username', {required: false});
    const password = core.getInput('password', {required: false});

    if (username && password) {
      await auth.configAuthentication(username, password);
    }

    const matchersPath = path.join(__dirname, '..', '.github');
    console.log(`##[add-matcher]${path.join(matchersPath, 'java.json')}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
