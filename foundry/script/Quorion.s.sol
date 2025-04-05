// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {QuorionManager} from "../src/QuorionManager.sol";

contract QuorionScript is Script {
    QuorionManager public quorion;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        quorion = new QuorionManager();

        vm.stopBroadcast();
    }
}
