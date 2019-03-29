
# contract: LockRewardCondition


## Variables

### private token

## Events

###  Fulfilled
Parameters:
* bytes32 _agreementId
* address _rewardAddress
* bytes32 _conditionId
* uint256 _amount

## Functions

### external initialize
Parameters:
* address _owner
* address _conditionStoreManagerAddress
* address _tokenAddress

### public hashValues
Parameters:
* address _rewardAddress
* uint256 _amount

### external fulfill
Parameters:
* bytes32 _agreementId
* address _rewardAddress
* uint256 _amount
