import _ from 'lodash';
import { getDevices, shutdown } from 'node-simctl';
import { resetXCTestProcesses } from '../../../lib/utils';
import { killAllSimulators as simKill } from 'appium-ios-simulator';


async function killAllSimulators () {
  const allDevices = _.flatMap(_.values(await getDevices()));
  const bootedDevices = allDevices.filter((device) => device.state === 'Booted');

  for (const {udid} of bootedDevices) {
    // It is necessary to stop the corresponding xcodebuild process before killing
    // the simulator, otherwise it will be automatically restarted
    await resetXCTestProcesses(udid, true);
    await shutdown(udid);
  }
  await simKill();
}

async function shutdownSimulator (sim) {
  await resetXCTestProcesses(sim.udid, true);
  await sim.shutdown();
}

export { killAllSimulators, shutdownSimulator };
