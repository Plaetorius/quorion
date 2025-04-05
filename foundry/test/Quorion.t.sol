// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {QuorionManager} from "../src/QuorionManager.sol";

contract QuorionTest is Test {
    QuorionManager public quorion;

    function setUp() public {
        quorion = new QuorionManager();
    }

    function test_Increment() public {
        quorion.addValidator(address(this));
        assertEq(
            quorion.hasRole(quorion.VALIDATOR_ROLE(), address(this)),
            true
        );
    }

    function testFuzz_CreateMission(uint256 x) public {
        quorion.createMission(
            "https://example.com/instructions",
            "image/png",
            1000000000000000000
        );
        assertEq(quorion.getMissionCount(), 1);
    }
}
