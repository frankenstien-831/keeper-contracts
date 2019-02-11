pragma solidity 0.5.3;

import './ConditionStoreManager.sol';
import './TemplateStoreManager.sol';
import '../libraries/AgreementStoreLibrary.sol';

import 'openzeppelin-eth/contracts/ownership/Ownable.sol';

contract AgreementStoreManager is Ownable {

    using AgreementStoreLibrary for AgreementStoreLibrary.AgreementList;

    ConditionStoreManager private conditionStoreManager;
    TemplateStoreManager private templateStoreManager;
    AgreementStoreLibrary.AgreementList private agreementList;

    function initialize(
        address _sender
    )
        public
        initializer
    {
        require(
            true == false,
            'Invalid number of parameters for "initialize". Got 1 expected 3!'
        );
    }

    function initialize(
        address _conditionStoreManagerAddress,
        address _templateStoreManagerAddress,
        address _owner
    )
        public
        initializer()
    {
        require(
            _conditionStoreManagerAddress != address(0) &&
            _templateStoreManagerAddress != address(0) &&
            _owner != address(0),
            'Invalid address'
        );

        conditionStoreManager = ConditionStoreManager(
            _conditionStoreManagerAddress
        );
        templateStoreManager = TemplateStoreManager(
            _templateStoreManagerAddress
        );
        Ownable.initialize(_owner);
    }

    function createAgreement(
        bytes32 _id,
        bytes32 _did,
        address _didOwner,
        bytes32 _templateId,
        bytes32[] memory _conditionIds,
        uint[] memory _timeLocks,
        uint[] memory _timeOuts
    )
        public
        returns (uint size)
    {
        require(
            templateStoreManager.isTemplateActive(_templateId) == true,
            'Template not active'
        );

        address[] memory conditionTypes = templateStoreManager
            .getConditionTypes(_templateId);

        require(
            _conditionIds.length == conditionTypes.length &&
            _timeLocks.length == conditionTypes.length &&
            _timeOuts.length == conditionTypes.length,
            'Arguments have wrong length'
        );

        for (uint256 i = 0; i < conditionTypes.length; i++) {
            conditionStoreManager.createCondition(
                _conditionIds[i],
                conditionTypes[i],
                _timeLocks[i],
                _timeOuts[i]
            );
        }
        return agreementList.create(
            _id,
            _did,
            _didOwner,
            _templateId,
            _conditionIds
        );
    }

    function getAgreement(bytes32 _id)
        external
        view
        returns (
            bytes32 did,
            address didOwner,
            bytes32 templateId,
            bytes32[] memory conditionIds,
            address lastUpdatedBy,
            uint256 blockNumberUpdated
        )
    {
        did = agreementList.agreements[_id].did;
        didOwner = agreementList.agreements[_id].didOwner;
        templateId = agreementList.agreements[_id].templateId;
        conditionIds = agreementList.agreements[_id].conditionIds;
        lastUpdatedBy = agreementList.agreements[_id].lastUpdatedBy;
        blockNumberUpdated = agreementList.agreements[_id].blockNumberUpdated;
    }

    function getAgreementDidOwner(bytes32 _id)
        external
        view
        returns (address didOwner)
    {
        return agreementList.agreements[_id].didOwner;
    }

    function getAgreementListSize()
        public
        view
        returns (uint size)
    {
        return agreementList.agreementIds.length;
    }
}
