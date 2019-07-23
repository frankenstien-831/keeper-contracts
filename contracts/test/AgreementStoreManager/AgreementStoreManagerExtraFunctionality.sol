pragma solidity 0.5.10;
// Copyright BigchainDB GmbH and Ocean Protocol contributors
// SPDX-License-Identifier: (Apache-2.0 AND CC-BY-4.0)
// Code is Apache-2.0 and docs are CC-BY-4.0

// Contain upgraded version of the contracts for test
import '../../agreements/AgreementStoreManager.sol';


contract AgreementStoreManagerExtraFunctionality is AgreementStoreManager {
    //returns a boolean
    function dummyFunction()
        public pure
        returns(bool)
    {
        return true;
    }
}
