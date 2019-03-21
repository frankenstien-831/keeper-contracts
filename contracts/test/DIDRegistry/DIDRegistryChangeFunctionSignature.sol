pragma solidity 0.5.3;

// Contain upgraded version of the contracts for test
import '../../registry/DIDRegistry.sol';

contract DIDRegistryChangeFunctionSignature is DIDRegistry {

    // swap _checksum with _did
    function registerAttribute (
        bytes32 _checksum,
        bytes32 _did,
        address [] memory _providers,
        string memory _value
    )
        public
        returns (uint size)
    {
        require(
            _providers.length <= maxProvidersPerDID,
            'Number of providers exceeds the limit'
        );
        require(
            didRegisterList.didRegisters[_did].owner == address(0x0) ||
            didRegisterList.didRegisters[_did].owner == msg.sender,
            'Attributes must be registered by the DID owners.'
        );
        require(
            //TODO: 2048 should be changed in the future
            bytes(_value).length <= 2048,
            'Invalid value size'
        );
        didRegisterList.update(_did, _checksum);

        emit DIDAttributeRegistered(
            _did,
            didRegisterList.didRegisters[_did].owner,
            _checksum,
            _providers,
            _value,
            msg.sender,
            block.number
        );

        return getDIDRegistrySize();
    }
}
