pragma solidity 0.5.3;

import '../../templates/TemplateStoreManager.sol';

contract TemplateStoreChangeFunctionSignature is TemplateStoreManager {

    function proposeTemplate(address _id, address _sender)
        external
        returns (uint size)
    {
        require(
            _id == _sender,
            'Invalid sender address'
        );
        return templateList.propose(_id);
    }
}
